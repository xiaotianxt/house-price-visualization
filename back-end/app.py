'''
Author: 小田
Date: 2021-05-19 15:21:48
LastEditTime: 2021-05-30 21:59:20
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
    rq_type = request.args.get("type")
    if rq_type == "xiaoqu":
        xiaoqu = request.args.get("xiaoqu")
        logging.info("查询小区: " + xiaoqu)
        return handler.query_within_today_name(xiaoqu), 200, {'content-type': 'application/json'}
