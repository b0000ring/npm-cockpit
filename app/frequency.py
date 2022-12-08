from app.dependencies import get_data
from app.utils import to_dict

# getting count data by usage data
def get_frequency():
  print('Getting frequency data...')
  data = get_data()
  result = {}
  for node in data:
    for dependency in data[node].connections:
      if dependency in result:
        result[dependency]['count'] += 1
      else:
        result[dependency] = {
          'count': 1,
          'data': to_dict(data[dependency])
        }
  return result 