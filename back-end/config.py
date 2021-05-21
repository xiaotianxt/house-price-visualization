'''
Author: 小田
Date: 2021-05-19 21:06:18
LastEditTime: 2021-05-19 21:21:25
'''
import configparser


class CONFIG():
    _CONFIG = configparser.ConfigParser()
    _CONFIG.read("config.ini")
    DB = _CONFIG['db']
