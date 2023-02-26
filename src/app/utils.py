import json
import socket
import urllib.request

def open_json_file(path):
  try:
    with open(path) as file:
      return json.load(file)
  except:
    pass
    # print(path)

def to_dict(obj):
  return json.loads(json.dumps(obj, default=lambda o: o.__dict__))

def open_file(path):
  try:
    with open(path) as file:
      return file.read()
  except:
     with open(path, 'rb') as file:
      return file.read()

def check_npm_availability():
  try:
    resp = urllib.request.urlopen("https://www.npm.com", timeout=10).getcode()
  except:
    resp = 502
  return resp

# TODO implement
def check_semver():
  None

def port_check(host, port):
  s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  s.settimeout(1) #Timeout in case of port not open
  try:
    s.bind((host, port)) 
    return True
  except:
    return False
