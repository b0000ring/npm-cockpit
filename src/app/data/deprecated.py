import concurrent.futures
import http.client
import json

from threading import Thread, Lock

from src.app.data.dependencies import dependencies
from src.app.utils import check_npm_availability

lock = Lock()

def make_get_request(host, path):
    try:
      lock.acquire()
      connection = http.client.HTTPSConnection(host, timeout=10)
      connection.request("GET", '/' + path)
      response = connection.getresponse()

      if response.status == 200:
          data = response.read().decode("utf-8")
          json_data = json.loads(data)
          return json_data
      else:
          print(f"Error: {response.status} - {response.reason}", flush=True)

    except Exception as e:
      print(e)

    finally:
      connection.close()
      lock.release()


thread = None
deprecated_data = {}

def pull_package_data(name):
  global deprecated_data
  response = make_get_request('registry.npmjs.org', '/' + name + '/latest')
  if response:
    if(response['deprecated']):
      deprecated_data[name] = response['deprecated']
      return

def get_deprecated_data():
  print('getting deprecation data...', flush=True)
  with concurrent.futures.ThreadPoolExecutor() as executor:
    futures = []
    for lib in dependencies: 
      futures.append(executor.submit(pull_package_data, name=lib))
    concurrent.futures.wait(futures)
  print('deprecation data received successfully', flush=True)

def get_deprecated():
  global deprecated_data
  global thread
  if not deprecated_data:
    if check_npm_availability() != 200:
      return
    if not thread:
      thread = Thread(target=get_deprecated_data)
      thread.start()
    thread.join()
  return deprecated_data