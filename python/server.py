from flask import Flask
import socket
import sys
from ConfigAccessManager import ConfigAccessManager
from FirebaseController import FirebaseController

sys.path.insert(0, './')
# Init flask
app = Flask(__name__)

firebase = FirebaseController()
mirrorKey = ''

'''
Test route
'''
@app.route("/hi")
def hello():
    return "Hello World from Flask!"


'''
Weather api key route gets and returns the weather api key.
'''
@app.route("/weatherapikey")
def api():
    return str(ConfigAccessManager().get_weather_api_key())


'''
News api key route gets and returns the news api key.
'''
@app.route("/newsapikey")
def api_news():
    return str(ConfigAccessManager().get_news_api_key())


'''
MirroKey route gets and returns the mirror key.
'''
@app.route("/mirrorkey")
def mirror_key():
    keyReturn = ConfigAccessManager().get_mirror_key()  # get key or key object
    if str(type(keyReturn)) != "<class 'str'>":  # If it's not a string post the info to firebase
        firebase.firebase_post(str(keyReturn['key']), {'isLive': True})
        return str(keyReturn['key'])
    else:
        return str(keyReturn)


'''
Starts the server
'''
if __name__ == "__main__":
    print("Server boot started")  # Tell the user
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  # Set the socket
    result = sock.connect_ex(('127.0.0.1', 5000))  # Poll local host port 5000
    if result == 0:
        print("Is up")  # If already up, tell user
    else:
        app.run(host='127.0.0.1', port=5000)  # If not start on local host 5000
        print("Has been started")
