from app.utils import to_dict
from app.dependencies import get_data

def get_issues():
  print('Getting issues data...')
  data = get_data()
  result = {}
  for key in data:
    errors = data[key].errors
    for error in errors:
      if not error.type in result:
        result[error.type] = {}
      result[error.type][error.lib] = to_dict(error)
  return result