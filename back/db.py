'''
Author: 小田
Date: 2021-05-19 21:05:42
LastEditTime: 2021-06-17 20:09:07
'''
from os import PRIO_PROCESS
from config import CONFIG
from pymongo import MongoClient

EVALUATE = {
    'transport-type-walk': 50,
    'transport-type-bicycle': 100,
    'transport-type-car': 250
}


class DBHandler():
    def __init__(self) -> None:
        DB = CONFIG.DB
        self.client = MongoClient(
            f"mongodb://{DB['host']}:{DB['port']}/{DB['database']}", username="lianjia", password="lianjia", connect=False)
        self._db = self.client['lianjia']
        self.xiaoqu = self._db['xiaoqu']
        self.location = self._db['location']
        self.today = self._db['today']

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

    def result(items):
        for item in items[:5]:
            print(item)

    db = DBHandler()

    # result(db.location_geo_within(polygon))

    # result(db.location_geo_near(point, max_dis=1000))
