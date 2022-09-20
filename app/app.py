from flask import Flask
from waitress import serve
# import webbrowser

from app.Router import Router
from app.processing import process_dependencies

app = Flask(__name__, static_url_path='/client')
# def open_browser():
    # webbrowser.open_new('http://127.0.0.1:5000/')

def init():
    process_dependencies()
    Router(app)
    # open_browser()

    # app.run(processes=1) 
    serve(app, host='0.0.0.0', port=8080, threads=6)
