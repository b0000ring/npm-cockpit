import subprocess
import json
from threading import Thread

from app.path import get_path
from app.utils import check_npm_availability

thread = None
updates_data = {}

def pull_updates():
  print('getting updates data...')
  global updates_data
  try:
    path = get_path()
    command = ['npm', 'outdated', '--json', '--all']
    result = subprocess.run(command, capture_output=True, cwd=path).stdout
    updates_data = json.loads(result)
    print('updates data received successfully', flush=True)
  except:
    pass

def get_updates():
  global updates_data
  global thread
  if not updates_data:
    if check_npm_availability() != 200:
      return
    if not thread:
      thread = Thread(target=pull_updates, daemon=True)
      thread.start()
    thread.join()
  return updates_data