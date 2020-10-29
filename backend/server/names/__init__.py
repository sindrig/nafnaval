import json
import os


BASE = os.path.dirname(os.path.abspath(__file__))
MALE = 'male'
FEMALE = 'female'
BOTH = 'both'


def get(selected_gender):
    if selected_gender == BOTH:
        genders = [MALE, FEMALE]
    else:
        genders = [selected_gender]
    names = set()
    for gender in genders:
        with open(os.path.join(BASE, f'{gender}.json'), 'r') as f:
            names = names.union(set(json.loads(f.read())))
    return names
