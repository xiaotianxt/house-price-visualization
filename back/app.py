'''
Author: 小田
Date: 2021-05-19 15:21:48
LastEditTime: 2021-06-05 16:35:42
'''
from flask import Flask, request, jsonify
from handler import *
from flask_cors import *
import logging

app = Flask(__name__)
handler = RequestHandler()


@app.route("/gisapp", methods=['GET', 'POST'])
def main():
    data = request.get_json()
    if data['request'] == "QUERY_WITHIN_POLYGON":
        return handler.query_within_polygon(data), 200, {'content-type': 'application/json'}


@app.route("/search", methods=["GET", "POST"])
@cross_origin()
def search():
    data = request.get_json()
    rq_type = data['type']
    print("DATA: ", data)

    if rq_type == "xiaoqu":
        xiaoqu = data['xiaoqu']
        logging.info("查询小区: " + xiaoqu)
        return handler.query_within_today_name(xiaoqu), 200, {'content-type': 'application/json'}

    elif rq_type == "advanced":
        return handler.query_within_today_advanced(data['polygon'], data['price'], data['transport']), 200, {'content-type': 'application/json'}

    elif rq_type == "prices":
        xiaoqu = data['item']['xiaoqu']
        return handler.query_within_xiaoqu_name(xiaoqu), 200, {'content-type': "application/json"}
