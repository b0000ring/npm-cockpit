from flask import Flask
import webbrowser

from Router import Router
from Processing import Processing

def open_browser():
    webbrowser.open_new('http://127.0.0.1:5000/')

app = Flask(__name__, static_url_path='/client')
processing = Processing()
router = Router(app, processing)

processing.get_tree()
open_browser()