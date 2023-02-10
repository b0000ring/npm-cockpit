from app.utils import open_json_file

def get_layout():
  return open_json_file('app/layout.json')

def post_layout():
  print('Posting layout')
