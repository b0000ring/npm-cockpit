import subprocess
import json
from threading import Thread

from app.utils import check_npm_availability
from app.path import get_path

vulnerabilities_data = {}
thread = None

def pull_vulnerabilities():
  print('getting vulnerabilities data...', flush=True)
  global vulnerabilities_data
  try:
    path = get_path()
    command = ['npm', 'audit', '--json']
    result = subprocess.run(command, capture_output=True, cwd=path).stdout
    vulnerabilities_data = json.loads(result)
    print('vulnerabilities data received successfully', flush=True)
  except:
    pass


def get_vulnerabilities():
  global vulnerabilities_data
  global thread
  if not vulnerabilities_data:
    if check_npm_availability() != 200:
      return
    if not thread:
      thread = Thread(target=pull_vulnerabilities, daemon=True)
      thread.start()
    thread.join()
  return vulnerabilities_data
  
