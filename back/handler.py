'''
Author: 小田
Date: 2021-05-19 21:00:00
LastEditTime: 2021-06-17 20:08:43
'''

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
        self.db = DBHandler()

    def query_within_xiaoqu_name(self, xiaoqu):
        return json.dumps(list(self.db.xiaoqu_name(xiaoqu)), cls=JSONEncoder)

    def query_within_today_name(self, xiaoqu):
        return json.dumps(list(self.db.today_name(xiaoqu)), cls=JSONEncoder)

    def query_within_today_advanced(self, coordinates, price, transport):
        return json.dumps(list(self.db.today_advanced(coordinates, price, transport)), cls=JSONEncoder)
