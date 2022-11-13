import json

def open_json_file(path):
  with open(path) as file:
    return json.load(file)

def to_dict(obj):
  return json.loads(json.dumps(obj, default=lambda o: o.__dict__))

def open_file(path):
  try:
    with open(path) as file:
      return file.read()
  except:
     with open(path, 'rb') as file:
      return file.read()