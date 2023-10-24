from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import FileUploadSerializer

class FileUploadView(APIView):  
    def post(self, request, format=None):
        serializer = FileUploadSerializer(data=request.data)

        if serializer.is_valid():
            # 파일 업로드 및 데이터베이스에 저장
            serializer.save(user=request.user, chat_message_id=request.data.get('chat_message_id'))
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)