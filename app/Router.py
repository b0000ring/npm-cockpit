from flask import redirect, send_from_directory

from app.processing import get_dependencies, get_statistic
from app.layout import get_layout, post_layout

class Router:
  def __init__(self, app):
    @app.route("/api/dependencies")
    def send_dependencies():
        return get_dependencies()

    @app.route("/api/security")
    def send_security():
        return "{}"

    @app.route("/api/statistic")
    def send_statistic():
        return get_statistic()

    @app.route("/api/layout", methods = ['GET'])
    def send_layout():
        return get_layout()

    @app.route("/api/layout", methods = ['POST'])
    def save_layout():
        return post_layout()

    @app.route("/")
    def index():
        return redirect("/index.html")

    @app.route("/<path:path>")
    def send_client(path):
        return send_from_directory('../client', path)