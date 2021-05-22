'''
Author: 小田
Date: 2021-05-19 15:21:48
LastEditTime: 2021-05-22 00:35:14
'''
from flask import Flask, request, jsonify
from handler import *

app = Flask(__name__)
handler = RequestHandler()


@app.route("/gisapp", methods=['GET', 'POST'])
def main():
    data = request.get_json()
    if data['request'] == "QUERY_WITHIN_POLYGON":

        return handler.query_within_polygon(data), 200, {'content-type': 'application/json'}
