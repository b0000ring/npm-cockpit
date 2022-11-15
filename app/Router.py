import os
import json
from mimetypes import guess_type

from app.processing import get_dependencies, get_frequency, get_updates, get_vulnerabilities, get_issues
from app.layout import get_layout
from app.classes.Response import Response
from app.utils import open_file

static_folder = '/client'

class Router:
  def __init__(self):
    self.routes = {
      '/': self.root,
      '/api/layout': self.send_layout,
      '/api/dependencies': self.send_dependencies,
      '/api/vulnerabilities': self.send_vulnerabilities,
      '/api/updates': self.send_updates,
      '/api/frequency': self.send_frequency,
      '/api/issues': self.send_issues
    }

  def root(self):
    return self.static('/index.html')

  def send_dependencies(self):
    return Response('application/json', json.dumps(get_dependencies()))

  def send_layout(self):
    return Response('application/json', json.dumps(get_layout()))

  def send_vulnerabilities(self):
    return  Response('application/json', json.dumps(get_vulnerabilities()))
  
  def send_issues(self):
    return Response('application/json', json.dumps(get_issues()))

  def send_updates(self):
    return Response('application/json', json.dumps(get_updates()))

  def send_frequency(self):
    return Response('application/json', json.dumps(get_frequency()))

  def static(self, path):
    final_path = os.getcwd() + static_folder + path

    if '..' in path:
      return Response('text/plain', '403 forbidden', status = 403)  

    isfile = os.path.isfile(final_path)

    if isfile:
      data = open_file(final_path)
      type = guess_type(final_path)
      return Response(type[0], data)
    else:
      return self.not_found()

  def not_found(self):
    return Response('text/plain', '404 not found', status = 404)   
