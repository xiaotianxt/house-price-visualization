'''
Author: 小田
Date: 2021-05-19 21:00:00
LastEditTime: 2021-05-22 00:32:12
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

    def query_within_polygon(self, request):
        polygon = Polygon(request['polygon']['coordinates'][0])
        print(list(self.db.location_geo_within(polygon)))
        return json.dumps(list(self.db.location_geo_within(polygon)), cls=JSONEncoder)
