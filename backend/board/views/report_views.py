from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from board.models import Report
from board.serializers import ReportSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def report_item_api(request):
    if request.method == 'POST':
        try:
            data = request.data
            existing_report = Report.objects.filter(content=data.get('content')).first()
            if existing_report:
                return JsonResponse({'message': '이미 신고된 내용입니다.'}, status=400)
            serializer = ReportSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse({'message': '신고가 접수되었습니다.'}, status=200)
            return JsonResponse({'message': '유효하지 않은 데이터입니다.', 'details': serializer.errors}, status=400)
        except Exception as e:
            return JsonResponse({'message': f'에러 발생: {str(e)}'}, status=500)
    return JsonResponse({'message': 'Only POST requests allowed'}, status=405)
