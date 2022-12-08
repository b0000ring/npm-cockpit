# import webbrowser

from http.server import HTTPServer
from socketserver import ThreadingMixIn

from app.Server import Server
from app.dependencies import process_dependencies
from app.Router import Router

HOST_NAME = '0.0.0.0'
PORT_NUMBER = 8080

class ThreadingSimpleServer(ThreadingMixIn, HTTPServer):
    pass

def init():
  process_dependencies()
  httpd = ThreadingSimpleServer((HOST_NAME, PORT_NUMBER), Server)
  try:
      httpd.serve_forever()
  except KeyboardInterrupt:
      pass
  httpd.server_close()