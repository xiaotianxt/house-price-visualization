'''
Author: 小田
Date: 2021-05-19 21:06:18
LastEditTime: 2021-06-06 23:27:12
'''
import configparser

class CONFIG():
    _CONFIG = configparser.ConfigParser()
    _CONFIG.read("config.ini")
    DB = _CONFIG['db']
