#!/usr/bin/env python
import os
import json

import requests
from bs4 import BeautifulSoup

keymap = {
    'Drengir': 'male',
    'Stúlkur': 'female',
}

base = os.path.dirname(os.path.abspath(__file__))
result_folder = os.path.join(base, 'backend', 'server', 'names')


def main():
    r = requests.get(
        'https://vefur.island.is/mannanofn/leit-ad-nafni/',
        params={'Nafn': '', 'Stulkur': 'on', 'Drengir': 'on'},
    )
    r.raise_for_status()
    soup = BeautifulSoup(r.text, 'html.parser')
    nametypes = soup.find_all('div', attrs={'class': 'nametype'})
    for nametype in nametypes:
        key = keymap[nametype.find('h3').text]
        names = [i.text.split()[0] for i in nametype.find_all('li')]
        with open(os.path.join(result_folder, f'{key}.json'), 'w') as f:
            f.write(
                json.dumps(names, indent=2, sort_keys=True, ensure_ascii=False)
            )


if __name__ == '__main__':
    main()
