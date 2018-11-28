#! /usr/bin/env python3
# -*- coding: utf-8 -*-

# created by user12043 on 23.11.2018 - 19:12
# part of bms_UI

from time import sleep

from serial import Serial

arduino = Serial("/dev/ttyUSB1", 9600, timeout=.1)


def get_input():
    # data = arduino.readline()[:-2]
    data = str(arduino.readall())
    return data


if __name__ == "__main__":
    print("start")
    while True:
        print(get_input())
        sleep(0.5)
