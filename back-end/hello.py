'''
Author: 小田
Date: 2021-05-19 15:21:48
LastEditTime: 2021-05-19 23:35:14
'''
from flask import Flask, request

app = Flask(__name__)


@app.route("/gisapp", methods=['GET', 'POST'])
def hello_world():
    pass
