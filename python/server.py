from flask import Flask
import socket
import sys

sys.path.insert(0, './')
# IntelliJ will complain about this import, it works
try:
    import ConfigAccessManager
except:
    import ConfigAccessManager

app = Flask(__name__)

cm = ConfigAccessManager.ConfigManager()


@app.route("/hi")
def hello():
    return "Hello World from Flask!"


# TODO add handshake

@app.route("/weatherapikey")
def api():
    return str(cm.get_weather_api_key())


@app.route("/newsapikey")
def api_news():
    return str(cm.get_news_api_key())


if __name__ == "__main__":
    print("Server boot started")
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('127.0.0.1', 5000))
    if result == 0:
        print("Is up")
    else:
        app.run(host='127.0.0.1', port=5000)
        print("Has been started")

