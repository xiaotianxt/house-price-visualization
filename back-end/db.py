'''
Author: 小田
Date: 2021-05-19 21:05:42
LastEditTime: 2021-05-21 21:54:11
'''
from config import CONFIG
from pymongo import MongoClient
from geometry import *


class db():
    def __init__(self) -> None:
        DB = CONFIG.DB
        self.client = MongoClient(
            f"mongodb://{DB['host']}:{DB['port']}/{DB['database']}", username="lianjia", password="lianjia")
        self._db = self.client['lianjia']
        self.xiaoqu = self._db['xiaoqu']
        self.location = self._db['location']
        self.today = self._db['today']

    def location_filter(self, query):
        return self.location.find(query)

    def location_geo_within(self, polygon):
        return self.location_filter({
            'geometry': {
                '$geoWithin': {
                    '$geometry': {
                        'type': 'Polygon',
                        'coordinates': [polygon.coordinates]
                    }
                }
            }
        })

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
