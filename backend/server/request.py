from dataclasses import dataclass
from typing import Optional


@dataclass
class Request:
    path: str
    body: dict
    source_ip: Optional[str] = None
