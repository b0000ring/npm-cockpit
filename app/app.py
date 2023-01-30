# import webbrowser

from http.server import HTTPServer
from socketserver import ThreadingMixIn
import sys

from app.utils import port_check
from app.Server import Server
from app.data.dependencies import process_dependencies

HOST_NAME = '127.0.0.1'
PORT_NUMBER = 8080

if len(sys.argv) == 3:
	PORT_NUMBER = int(sys.argv[2])

isOpen = port_check(HOST_NAME, PORT_NUMBER)

if not isOpen:
	print('ERROR: port ' + str(PORT_NUMBER) + ' is not available. Provide available port as the second command param')
	exit()

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