from http.server import BaseHTTPRequestHandler

from app.Router import Router


class Server(BaseHTTPRequestHandler):
  router = Router()

  def do_HEAD(self):
    return
    
  def do_GET(self):
    try:
      self.respond()
    except:
      self.send_response(400)
    
  def do_POST(self):
    return
    
  def handle_http(self):
    if self.path in self.router.routes:
      response = self.router.routes[self.path]()
    else:
      response = self.router.static(self.path)

    self.send_response(response.status)
    self.send_header('Content-type', response.type)
    self.end_headers()
    try:
      return bytes(response.data, 'utf-8')
    except:
      return response.data
    
  def respond(self):
    content = self.handle_http()
    self.wfile.write(content)