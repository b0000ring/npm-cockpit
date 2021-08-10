from flask import Flask, send_from_directory
import webbrowser

app = Flask(__name__, static_url_path='/client')

@app.route("/<path:path>")

def send_client(path):
    return send_from_directory('client', path)

def open_browser():
    webbrowser.open_new('http://127.0.0.1:5000/index.html')

open_browser()