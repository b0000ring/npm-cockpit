import concurrent.futures
import requests
from threading import Thread

from app.path import get_path
from app.data.dependencies import data

thread = None
deprecated_data = {}
isLoaded = False

def pull_package_data(name):
  global deprecated_data
  response = requests.get(url='https://registry.npmjs.org/' + name + '/latest', timeout=10)
  if response.status_code == 200:
    data = response.json()
    if(data['deprecated']):
      deprecated_data[name] = data['deprecated']

def get_deprecated_data():
  global data
  with concurrent.futures.ThreadPoolExecutor() as executor:
    futures = []
    for lib in data: 
      futures.append(executor.submit(pull_package_data, name=lib))
    concurrent.futures.wait(futures)


def get_deprecated():
  print('Getting deprecated data...')
  global deprecated_data
  global data
  global thread
  if not isLoaded:
    if not thread:
      thread = Thread(target=get_deprecated_data)
      thread.start()
    thread.join()
  return deprecated_data