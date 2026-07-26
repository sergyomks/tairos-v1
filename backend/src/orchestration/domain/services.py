class LLMRouterService:
    def route_request(self, request_str: str) -> str:
        # Mock para enrutar modelo idóneo (LiteLLM)
        return "gpt-4o-mini"
