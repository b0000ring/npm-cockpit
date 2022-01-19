from flask import redirect, send_from_directory

class Router:
  def __init__(self, app):
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