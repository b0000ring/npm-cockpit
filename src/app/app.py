from http.server import HTTPServer
from socketserver import ThreadingMixIn
import sys

from src.app.utils import port_check
from src.app.Server import Server
from src.app.data.dependencies import process_dependencies

def init():
  HOST_NAME = '127.0.0.1'
  PORT_NUMBER = 8080
  if len(sys.argv) == 3:
    PORT_NUMBER = int(sys.argv[2])

  isOpen = port_check(HOST_NAME, PORT_NUMBER)
  if not isOpen:
    print('ERROR: port ' + str(PORT_NUMBER) + ' is not available. Provide available port as the second command param', flush=True)
    exit()

  class ThreadingSimpleServer(ThreadingMixIn, HTTPServer):
    pass

  process_dependencies()
  httpd = ThreadingSimpleServer((HOST_NAME, PORT_NUMBER), Server)
  try:
    print('server is running on http://%s:%s' % (HOST_NAME, PORT_NUMBER), flush=True)
    httpd.serve_forever()
  except KeyboardInterrupt:
    print('\nExiting app...', flush=True)

  httpd.server_close()