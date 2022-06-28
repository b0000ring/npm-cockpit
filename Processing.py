import json

class Processing:

  loaded = False

  tree = None

  # should be added possibility to pass path to porject root
  # def __init__(path):
  #   something...

  def get_tree(self):
    print('Getting project tree...')
    return json.load(open('dependencies.json'))

  def get_by_frequency(self):
    print('Getting statistic data...')
    return json.load(open('statistic.json'))
