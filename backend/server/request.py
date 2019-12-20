from dataclasses import dataclass


@dataclass
class Request:
    path: str
    query: dict
    body: dict
