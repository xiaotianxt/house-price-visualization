'''
Author: 小田
Date: 2021-05-19 21:00:00
LastEditTime: 2021-05-30 21:59:09
'''

from geometry import *
from db import *
import json
from bson import ObjectId


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


class RequestHandler():
    def __init__(self) -> None:
        self.db = db()

    def query_within_polygon(self, polygon):
        print(list(self.db.location_geo_within(polygon)))
        return json.dumps(list(self.db.location_geo_within(polygon)), cls=JSONEncoder)

    def query_within_xiaoqu_name(self, xiaoqu):
        return json.dumps(list(self.db.xiaoqu_name(xiaoqu)), cls=JSONEncoder)

    def query_within_today_name(self, xiaoqu):
        return json.dumps(list(self.db.today_name(xiaoqu)), cls=JSONEncoder)

    def query_within_today_advanced(self, coordinates, min_price, max_price):
        return json.dumps(list(self.db.today_advanced(coordinates, min_price, max_price)), cls=JSONEncoder)
