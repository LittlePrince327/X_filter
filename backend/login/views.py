from rest_framework.response import Response                                           # Response 클래스는 뷰에서 HTTP 응답을 생성하는 데 사용
from django.contrib.auth import get_user_model                                         # 현재 사용 중인 사용자 모델을 가져오는 데 사용
from .serializers import UserSerializer                                                # 사용자 모델의 데이터를 직렬화하고 역직렬화하는 역할
from rest_framework.authtoken.models import Token                                      # 사용자 인증을 위한 토큰을 저장하는 데 사용
from rest_framework import generics                                                    # RESTful API 뷰를 생성하기 위한 generics 모듈을 가져옴. generics 모듈은 일반적인 CRUD(Create, Retrieve, Update, Delete) 작업을 지원하는 뷰 클래스를 제공 
from rest_framework.authtoken.views import ObtainAuthToken                             # 사용자가 로그인할 때 토큰을 발급하는 데 사용
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView        # JWT(토큰)를 발급
from rest_framework.views import APIView                                               # 사용자 정의 API 뷰를 만들 수 있음
from rest_framework import status                                                      # HTTP 응답 상태 코드를 정의
from rest_framework_simplejwt.tokens import RefreshToken                               # 토큰을 갱신 할 때 사용
from rest_framework import permissions                                                 # API 엔드포인트에 대한 접근을 제어



class UserSignup(APIView):                                                             # Django REST framework를 사용하여 사용자 등록(sign-up)을 처리하는 UserSignup 클래스를 정의
    permission_classes = [permissions.AllowAny]                                        # 해당 API 뷰에 대한 권한을 설정. permissions.AllowAny는 모든 사용자가 이 API 엔드포인트에 액세스할 수 있도록 허용하는 권한 클래스

    def create_tokens(self, user):                                                     # create_tokens 메서드는 사용자에 대한 새로운 토큰을 생성하는 역할. 사용자를 인자로 받고, 그 사용자를 기반으로 Refresh Token과 Access Token을 생성하여 딕셔너리 형태로 반환
        refresh = RefreshToken.for_user(user)                                          # 사용자를 기반으로 새로운 Refresh Token을 생성. RefreshToken.for_user(user)를 호출하여 사용자를 인자로 전달하고 해당 사용자에 대한 새로운 Refresh Token을 생성
        token = {                                                                      # Refresh Token과 Access Token을 딕셔너리에 저장. refresh는 Refresh Token을 문자열로 변환하고, refresh.access_token은 Access Token을 문자열로 변환한 것
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        return token

    def post(self, request):                                                           # post 메서드는 HTTP POST 요청을 처리.  사용자가 등록하는 요청을 처리하고 새로운 사용자를 생성
        serializer = UserSerializer(data=request.data)                                 # UserSerializer를 사용하여 클라이언트가 요청한 데이터(request.data)를 직렬화. 이는 사용자가 전달한 데이터를 파싱하고 유효성을 검사하는 역할을 함
        if serializer.is_valid():                                                      # 직렬화한 데이터가 유효한지 검사하고 데이터가 유효하면 다음을 실행
            user = serializer.save()                                                   # 유효한 데이터로부터 사용자를 생성하고 데이터베이스에 저장
            token = self.create_tokens(user)                                           # 사용자에 대한 토큰을 생성하는 create_tokens 메서드를 호출하여 토큰을 가져옴
            return Response(token, status=status.HTTP_201_CREATED)                     # 새로 생성된 토큰을 응답으로 반환. HTTP 상태 코드 201 (Created)와 함께 토큰을 클라이언트에게 제공
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)         # 만약 직렬화된 데이터가 유효하지 않으면, 에러 메시지와 함께 HTTP 상태 코드 400 (Bad Request)로 클라이언트에게 에러 응답을 반환

class UserLogin(ObtainAuthToken):                                                      # ObtainAuthToken 클래스를 상속받고, 사용자 로그인을 관리
    def create_tokens(self, user):                                                     # 사용자 객체를 받아들여 토큰을 생성하고 해당 토큰 및 사용자 이름을 포함하는 사전을 반환
        token, created = Token.objects.get_or_create(user=user)                        # 사용자에 대한 토큰을 가져오거나 생성.
        return {                                                                       # 생성된 토큰의 키와 사용자 이름을 포함하는 사전을 반환
            'token': token.key,
            'username': user.username
        }

    def post(self, request, *args, **kwargs):                                          # 사용자의 로그인 정보를 포함한 요청 데이터를 받아들임
        serializer = self.serializer_class(data=request.data)                          # 요청 데이터를 기반으로 시리얼라이저를 생성. 시리얼라이저는 데이터를 파이썬 객체로 변환하고 유효성을 검사하는 데 사용
        if serializer.is_valid():                                                      # 시리얼라이저가 유효한지 확인. 시리얼라이저는 요청 데이터의 유효성을 검사하고, 데이터가 유효하면 다음 단계로 이동
            user = serializer.validated_data['user']                                   # 시리얼라이저에서 추출한 유효한 데이터 중에서 사용자 객체를 가져옴
            token_data = self.create_tokens(user)                                      # create_tokens 메서드를 사용하여 사용자에 대한 토큰을 생성하고 해당 토큰 및 사용자 이름을 포함하는 사전을 가져옴
            return Response(token_data)                                                # 성공적으로 생성된 토큰 및 사용자 이름을 포함한 응답을 반환
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)     # 시리얼라이저가 유효하지 않은 경우, 유효성 검사 오류와 함께 400 Bad Request 상태 코드를 반환하여 요청이 거부됨을 나타냄

class CustomTokenObtainPairView(TokenObtainPairView):                                  # TokenObtainPairView 클래스를 상속받아 기본 로그인 동작을 확장
    def create_tokens(self, user):                                                     # 사용자 객체를 받아들여 토큰 및 추가 데이터를 생성하고 반환
        response_data = super().create_tokens(user)                                    # create_tokens 메서드를 호출하여 토큰을 생성하고 해당 응답 데이터를 가져옴
        email = self.request.data.get('email')                                         # 요청 데이터에서 이메일 주소를 추출
        user_data = get_user_model().objects.get(email=email)                          # 이메일 주소를 사용하여 사용자 데이터를 데이터베이스에서 가져옴. get_user_model() 함수는 현재 사용 중인 사용자 모델을 반환
        response_data['email'] = user_data.email                                       # 응답 데이터에 사용자의 이메일 주소를 추가
        return response_data                                                           # 토큰 및 추가 데이터를 포함하는 응답 데이터를 반환

    def post(self, request, *args, **kwargs):                                          # HTTP POST 요청을 처리하는 post 메서드를 정의
        response = super().post(request, *args, **kwargs)                              # TokenObtainPairView 클래스의 post 메서드를 호출하여 기본 로그인 동작을 수행하고 해당 응답을 가져옴

        if response.status_code == 200:                                                # 응답의 상태 코드가 200 (성공)인 경우에만 다음 단계를 수행
            response.data = self.create_tokens(self.user)                              # create_tokens 메서드를 사용하여 토큰 및 추가 데이터를 생성하고 응답 데이터를 업데이트
        
        return response                                                                # 업데이트된 응답을 반환


# class CustomTokenRefreshView(TokenRefreshView):
#     def post(self, request, *args, **kwargs):
#         response = super().post(request, *args, **kwargs)  # 부모 클래스의 post 메서드를 호출하여 토큰을 새로고침합니다.

#         if response.status_code == status.HTTP_200_OK:  # 토큰 새로고침이 성공했는지 확인합니다.
#             # 필요한 경우 여기에 커스텀 로직을 추가할 수 있습니다.
#             # 예를 들어 사용자와 관련된 데이터를 업데이트하려는 경우 사용자를 가져올 수 있습니다.
#             user = self.user
#             # 사용자와 관련된 데이터를 업데이트하는 등의 커스텀 로직을 추가할 수 있습니다.

#             # 필요한 경우 응답 데이터를 업데이트합니다.
#             response.data['custom_key'] = 'custom_value'

#         return response  # 업데이트된 응답을 반환합니다.
