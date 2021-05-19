'''
Author: 小田
Date: 2021-05-19 21:06:18
LastEditTime: 2021-05-19 21:07:27
'''
import configparser

config = configparser.ConfigParser()
config.read("config.ini")
print(config.sections())
