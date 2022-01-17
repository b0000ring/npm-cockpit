from flask import Flask, redirect, send_from_directory
import webbrowser

app = Flask(__name__, static_url_path='/client')

@app.route("/api/dependencies")
def send_dependencies():
    return "{}"

@app.route("/api/security")
def send_security():
    return "{}"

@app.route("/api/statistic")
def send_statistic():
    return "{}"

@app.route("/")
def index():
    return redirect("/index.html")

@app.route("/<path:path>")
def send_client(path):
    return send_from_directory('client', path)

def open_browser():
    webbrowser.open_new('http://127.0.0.1:5000/')

open_browser()