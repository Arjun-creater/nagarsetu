from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.chatbot.services.gemini_chat_service import (
    get_chatbot_response
)
from apps.chatbot.services.intent_service import (
    is_complaint_status_query
)

from apps.chatbot.services.complaint_rag_service import (
    get_latest_complaint_context
)


class ChatbotAPIView(APIView):

    def post(self, request):

        message = request.data.get(
            "message"
        )

        if not message:

            return Response(
                {
                    "error":
                        "Message is required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        context = None

        if is_complaint_status_query(
            message
        ):

            context = (
                get_latest_complaint_context(
                    request.user
                )
            )

        result = get_chatbot_response(
            message,
            context=context
        )

        return Response(result)