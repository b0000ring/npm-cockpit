from flask import Flask
import webbrowser

from Router import Router
import processing

def open_browser():
    webbrowser.open_new('http://127.0.0.1:5000/')

app = Flask(__name__, static_url_path='/client')
router = Router(app)
open_browser()

processing.get_dependencies()

