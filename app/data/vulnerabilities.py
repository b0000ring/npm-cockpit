import subprocess
import json
from threading import Thread

from app.path import get_path

vulnerabilities_data = {}
thread = None

def pull_vulnerabilities():
  global vulnerabilities_data
  path = get_path()
  command = ['npm', 'audit', '--json']
  result = subprocess.run(command, capture_output=True, cwd=path).stdout
  vulnerabilities_data = json.loads(result)

def get_vulnerabilities():
  print('Getting vulnerabilities data...')
  global vulnerabilities_data
  global vt
  if not vulnerabilities_data:
    if not vt:
      vt = Thread(target=pull_vulnerabilities)
      vt.start()
    vt.join()
  return vulnerabilities_data
