import json

class Layout:

  def get_layout(self):
    print('Getting layout')
    return json.load(open('layout.json'))

  def post_layout(self):
    print('Posting layout')
