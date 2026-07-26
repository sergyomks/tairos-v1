import uuid
from src.workspace.domain.entities import Message
from src.workspace.domain.repository_interfaces import ChannelRepositoryInterface

class SendMessageUseCase:
    def __init__(self, channel_repo: ChannelRepositoryInterface):
        self.channel_repo = channel_repo

    def execute(self, channel_id: uuid.UUID, sender_id: uuid.UUID, content: str):
        channel = self.channel_repo.find_by_id(channel_id)
        if not channel:
            raise ValueError("Channel not found")
        message = Message(sender_id=sender_id, content=content)
        channel.add_message(message)
        self.channel_repo.save(channel)
        return message
