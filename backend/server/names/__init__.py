import json
import os


BASE = os.path.dirname(os.path.abspath(__file__))
MALE = 'male'
FEMALE = 'female'


def get(gender):
    with open(os.path.join(BASE, f'{gender}.json'), 'r') as f:
        return set(json.loads(f.read()))
