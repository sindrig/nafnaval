from dataclasses import dataclass


@dataclass
class Request:
    path: str
    body: dict
