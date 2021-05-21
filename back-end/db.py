'''
Author: 小田
Date: 2021-05-19 21:05:42
LastEditTime: 2021-05-20 13:04:13
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

    def geo_within(self, polygon):
        return self.location.find({
            'geometry': {
                '$geoWithin': {
                    '$geometry': {
                        'type': 'Polygon',
                        'coordinates': [polygon.coordinates]
                    }
                }
            }
        })

    def geo_near(self, point, min_dis=0, max_dis=10):
        return self.location.find({
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

    def xiaoqu_price(self, location, date_range={}, price_range={}):
        return self.xiaoqu.find({'$and': {[location, date_range, price_range]}}).sort('date')


if __name__ == '__main__':
    from geometry import *
    polygon = Polygon([[116.3, 38.7], [116.3, 39.7], [
        116.4, 39.7], [116.4, 38.7], [116.3, 38.7]])
    db = db()
    for item in db.geo_within(polygon)[:5]:
        # print(item)
        pass

    point = Point([116.3, 39.9])
    for item in db.geo_near(point, max_dis=1000)[:5]:
        print(item)

    for item in db.xiaoqu_price({"area": "苏州桥", "xiaoqu": "1+1大厦"}):
        print(item)
