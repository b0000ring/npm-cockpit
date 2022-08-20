import json

def get_layout():
  print('Getting layout')
  return json.load(open('app/layout.json'))

def post_layout():
  print('Posting layout')
