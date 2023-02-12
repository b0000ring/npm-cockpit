import os
import json
from mimetypes import guess_type

from app.classes.Response import Response
from app.utils import open_file

from app.data.dependencies import get_dependencies, get_issues
from app.data.updates import get_updates
from app.data.vulnerabilities import get_vulnerabilities
from app.data.package import get_package_data
from app.data.deprecated import get_deprecated

class Router:
  def __init__(self):
    self.routes = {
      '/': self.root,
      '/api/dependencies': self.send_dependencies,
      '/api/vulnerabilities': self.send_vulnerabilities,
      '/api/updates': self.send_updates,
      '/api/issues': self.send_issues,
      '/api/package': self.send_package_data,
      '/api/deprecated': self.send_deprecated_data
    }

  def root(self):
    return self.static('/index.html')

  def send_dependencies(self):
    return Response('application/json', json.dumps(get_dependencies()))

  def send_deprecated_data(self):
    return Response('application/json', json.dumps(get_deprecated()))

  def send_vulnerabilities(self):
    return  Response('application/json', json.dumps(get_vulnerabilities()))
  
  def send_issues(self):
    return Response('application/json', json.dumps(get_issues()))

  def send_package_data(self):
    return Response('application/json', json.dumps(get_package_data()))

  def send_updates(self):
    return Response('application/json', json.dumps(get_updates()))

  def static(self, path):
    static_folder = '/client'
    dir_path = os.path.dirname(os.path.realpath(__file__))
    final_path = dir_path + '/..' + static_folder + path
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
