from datetime import datetime
import uuid
from typing import Optional

class BaseEntity:
    def __init__(self, id: Optional[uuid.UUID] = None):
        self.id = id or uuid.uuid4()
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def update(self):
        self.updated_at = datetime.utcnow()
