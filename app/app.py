from http.server import HTTPServer
from socketserver import ThreadingMixIn
import sys

from app.utils import port_check
from app.Server import Server
from app.data.dependencies import process_dependencies

def init():
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

  process_dependencies()
  httpd = ThreadingSimpleServer((HOST_NAME, PORT_NUMBER), Server)
  try:
    print('server is running on http://%s:%s' % (HOST_NAME, PORT_NUMBER))
    httpd.serve_forever()
  except KeyboardInterrupt:
    print('\nExiting app...')

  httpd.server_close()