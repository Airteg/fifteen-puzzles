import json

def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

def find_differences(obj1, obj2, path=""):
    differences = []
    if isinstance(obj1, dict) and isinstance(obj2, dict):
        for key in obj1:
            if key in obj2:
                differences.extend(find_differences(obj1[key], obj2[key], f"{path}/{key}"))
            else:
                differences.append(f"Key {key} not found in second JSON at path {path}")
        for key in obj2:
            if key not in obj1:
                differences.append(f"Key {key} not found in first JSON at path {path}")
    elif isinstance(obj1, list) and isinstance(obj2, list):
        for index, (item1, item2) in enumerate(zip(obj1, obj2)):
            differences.extend(find_differences(item1, item2, f"{path}/{index}"))
        if len(obj1) > len(obj2):
            for index in range(len(obj2), len(obj1)):
                differences.append(f"Extra item in first JSON at path {path}/{index}")
        elif len(obj2) > len(obj1):
            for index in range(len(obj1), len(obj2)):
                differences.append(f"Extra item in second JSON at path {path}/{index}")
    else:
        if obj1 != obj2:
            differences.append(f"Different values at path {path}: {obj1} != {obj2}")
    return differences

salute3 = load_json('Salute3.json')
salute4 = load_json('Salute4.json')

differences = find_differences(salute3, salute4)
for diff in differences:
    print(diff)
