from flask import Flask
import webbrowser

from Router import Router
import processing

app = Flask(__name__, static_url_path='/client')

def open_browser():
    webbrowser.open_new('http://127.0.0.1:5000/')

if __name__ == '__main__':
    Router(app)
    open_browser()
    processing.get_dependencies()

    app.run()
