from app.utils import open_json_file

from app.path import get_package_json_path

def get_package_data():
  package_json_path = get_package_json_path()
  return open_json_file(package_json_path)