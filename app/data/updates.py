import subprocess
import json
from threading import Thread

from app.path import get_path

thread = None
updates_data = {}

def pull_updates():
  global updates_data
  path = get_path()
  command = ['npm', 'outdated', '--json', '--all']
  result = subprocess.run(command, capture_output=True, cwd=path).stdout
  updates_data = json.loads(result)

def get_updates():
  print('Getting updates data...')
  global updates_data
  global thread
  if not updates_data:
    if not thread:
      thread = Thread(target=pull_updates)
      thread.start()
    thread.join()
  return updates_data