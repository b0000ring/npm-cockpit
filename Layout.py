import json

def get_layout():
  print('Getting layout')
  return json.load(open('layout.json'))

def post_layout():
  print('Posting layout')
