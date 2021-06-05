'''
Author: 小田
Date: 2021-05-19 21:05:42
LastEditTime: 2021-06-05 17:18:41
'''
from os import PRIO_PROCESS
from config import CONFIG
from pymongo import MongoClient
from geometry import *

EVALUATE = {
    'transport-type-walk': 50,
    'transport-type-bicycle': 100,
    'transport-type-car': 250
}


class db():
    def __init__(self) -> None:
        DB = CONFIG.DB
        self.client = MongoClient(
            f"mongodb://{DB['host']}:{DB['port']}/{DB['database']}", username="lianjia", password="lianjia", connect=False)
        self._db = self.client['lianjia']
        self.xiaoqu = self._db['xiaoqu']
        self.location = self._db['location']
        self.today = self._db['today']

    def location_filter(self, query):
        return self.location.find(query)

    def location_geo_within(self, coordinates):
        query = {
            'geometry': {
                '$geoWithin': {
                    '$geometry': {
                        'type': 'Multipolygon',
                        'coordinates': [coordinates]
                    }
                }
            }
        }
        return self.location_filter(query)

    def location_geo_near(self, point, min_dis=0, max_dis=10):
        return self.location_filter({
            'geometry': {
                "$near": {
                    "$geometry": {
                        'type': "Point",
                        'coordinates': point.coordinates
                    },
                    '$maxDistance': max_dis,
                    '$minDistance': min_dis
                }
            }
        })

    def xiaoqu_filter(self, query):
        return self.xiaoqu.find(query if isinstance(query, dict) else {"$and": query})

    def xiaoqu_price(self, location):
        return self.xiaoqu_filter(location).sort('date')

    def today_filter(self, query):
        return self.today.find(query if isinstance(query, dict) else {"$and": query})

    def xiaoqu_price_range(self, location, date="today", min_price=0, max_price=0):
        price = [{"price": {"$gt": min_price}}, {
            "price": {"$lt": max_price}} if max_price != 0 else {}]
        if date != "today":
            return self.xiaoqu_filter([location, date, *price])
        else:
            return self.today_filter([location, *price])
    # db.location.find({'properties.xiaoqu': /(\s\S)*华清嘉园(\s\S)*/})

    def xiaoqu_name(self, xiaoqu):
        return (self.xiaoqu.aggregate([
            {
                "$match": {
                    "xiaoqu": f"{xiaoqu}"
                }
            },
            {"$group": {
                "_id": {
                    'price': "$price",
                    'date': "$date"
                }
            }}
        ]))

    def today_name(self, xiaoqu):
        return self.today.find({"properties.xiaoqu": {"$regex": f".*{xiaoqu}.*"}})

    def today_filter(self, query):
        print("QUERY: ", query)
        return self.today.find(query)

    def today_advanced(self, coordinates, price_range, transport):

        if coordinates is None:
            query_polygon = {}
        else:
            query_polygon = {
                'geometry': {
                    '$geoWithin': {
                        '$geometry': {
                            'type': 'MultiPolygon',
                            'coordinates': coordinates
                        }
                    }
                },
            }
        if price_range is None:
            query_price = []
        else:
            query_price = [
                {"properties.price": {"$gt": price_range['min']}},
                {"properties.price": {"$lt": price_range['max']}}]

        if transport is None:
            query_transport = {}
        else:
            query_transport = {
                'geometry': {
                    "$near": {
                        "$geometry": {
                            'type': "Point",
                            'coordinates': transport['coordinates']
                        },
                        '$maxDistance': EVALUATE[transport['type']] * transport['time'],
                        '$minDistance': 0
                    }
                }
            }
        print(query_transport)
        return self.today_filter({"$and": [query_polygon, query_transport, *query_price]})


if __name__ == '__main__':
    from geometry import *

    def result(items):
        for item in items[:5]:
            print(item)

    polygon = Polygon([[116.3, 38.7], [116.3, 39.7], [
        116.4, 39.7], [116.4, 38.7], [116.3, 38.7]])
    point = Point([116.3, 39.9])

    db = db()

    # result(db.location_geo_within(polygon))

    # result(db.location_geo_near(point, max_dis=1000))

    result(db.xiaoqu_price_range(location={"city": "北京"}))
