from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from src.core.infrastructure.database import Base

class ChannelModel(Base):
    __tablename__ = "channels"
    
    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    name = Column(String, index=True)

class MessageModel(Base):
    __tablename__ = "messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    channel_id = Column(UUID(as_uuid=True), ForeignKey("channels.id"))
    sender_id = Column(UUID(as_uuid=True))
    content = Column(String)
