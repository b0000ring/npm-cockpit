from flask import Flask
import webbrowser

from app.Router import Router
from app.processing import process_dependencies

app = Flask(__name__, static_url_path='/client')

def open_browser():
    webbrowser.open_new('http://127.0.0.1:5000/')

def init():
    process_dependencies()
    Router(app)
    # open_browser()

    app.run()    
