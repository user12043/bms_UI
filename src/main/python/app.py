#! /usr/bin/env python3
# -*- coding: utf-8 -*-

# created by user12043 on 24.11.2018 - 18:06
# part of bms_UI

# from flask import Flask
import flask
from flask import Flask

# import ardu_serial as serial

app = Flask(__name__, static_url_path="", static_folder="../webapp")


@app.route("/")
def index():
    return flask.redirect("/index.html")


value_list = [4.55, 3.78, 3.77, 3.77, 3.76, 3.79, 3.76, 3.81, 3.75, 3.78, 3.79, 3.77, 3.72,
              3.65, 3.76, 3.76, 3.79, 3.76, 3.79, 3.82, 3.78, 3.78, 3.76, 3.77]


# for a in range(5):
#     value_list.append(random.randint(0, 42) / 10)


@app.route("/api/read")
def read_input():
    # return serial.getInput()
    for i in range(24):
        value_list[i] = value_list[i] - 0.010
        if value_list[i] < 0 or value_list[i] > 4.2:
            value_list[i] = 4.2
    return str(value_list)


# redirect "/" to "index" route (not to path, to route)
# app.add_url_rule("/", "index")

if __name__ == '__main__':
    app.run("0.0.0.0", 8181)
    # app.run("0.0.0.0", 8080, True)
