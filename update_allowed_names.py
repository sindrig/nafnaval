#!/usr/bin/env python
import os
import locale
import json

import asyncio
import traceback
import aiohttp

locale.setlocale(locale.LC_ALL, 'is_IS.utf-8')

keymap = {
    'dr': 'male',
    'st': 'female',
}
unused_nametypes = ['mi']

base = os.path.dirname(os.path.abspath(__file__))
result_folder = os.path.join(base, 'backend', 'server', 'names')


first_chars = 'aábcdðeéfghiíjklmnoópqrstuúwvxyýzþæö'
graphql_query = '''query GetIcelandicNameByInitialLetter($input: GetIcelandicNameByInitialLetterInput!) {
  getIcelandicNameByInitialLetter(input: $input) {
    id
    icelandicName
    type
    status
    verdict
    visible
    description
    url
    __typename
  }
  }'''


async def fetch_names(session, letter):
    try:
        async with session.post(
            'https://island.is/api/graphql',
            json=[
                {
                    "operationName": "GetIcelandicNameByInitialLetter",
                    "variables": {"input": {"initialLetter": letter}},
                    "query": graphql_query,
                }
            ],
        ) as resp:
            return letter, await resp.json()
    except Exception as e:
        traceback.print_exc()
        raise e


async def main():
    names = {
        'dr': [],
        'st': [],
    }
    async with aiohttp.ClientSession() as session:
        tasks = []
        for letter in first_chars:
            task = asyncio.ensure_future(fetch_names(session, letter))
            tasks.append(task)
        responses = asyncio.gather(*tasks)
        for letter, data in await responses:
            for name in data[0]['data']['getIcelandicNameByInitialLetter']:
                # Check if name is approved
                if (name.get('status') or '').lower() == 'sam':
                    nametype = name['type'].lower()
                    if nametype.startswith('r'):
                        # Changed writing, e.g. Agatha and Agata
                        nametype = nametype.lstrip('r')
                    if nametype in unused_nametypes:
                        continue
                    elif nametype == 'kh':
                        for nt in names.keys():
                            names[nt].append(name['icelandicName'])
                    elif nametype not in names:
                        print('Unknown nametype ', nametype, name)
                    else:
                        names[nametype].append(name['icelandicName'])
    for nametype, name_list in names.items():
        key = keymap[nametype]
        with open(os.path.join(result_folder, f'{key}.json'), 'w') as f:
            f.write(
                json.dumps(
                    sorted(
                        list({name.capitalize() for name in name_list}),
                        key=locale.strxfrm,
                    ),
                    indent=2,
                    sort_keys=True,
                    ensure_ascii=False,
                )
            )


if __name__ == '__main__':
    asyncio.run(main())
