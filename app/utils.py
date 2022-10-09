import json

def open_json_file(path):
  with open(path) as file:
    return json.load(file)

def to_dict(obj):
  return json.loads(json.dumps(obj, default=lambda o: o.__dict__))