from rest_framework import serializers                       # 데이터를 다른 형식으로 변환하는 serizalization 모듈을 가져옴. 주로 JSON 또는 XML 형식으로 데이터를 표현할 때 사용
from django.contrib.auth import get_user_model               # Django에서 사용자 모델을 가져오는 데 사용되는 함수

class UserSerializer(serializers.ModelSerializer):           # DRF의 serializers.ModelSerializer를 상속하며, 사용자 모델 데이터를 JSON 형식으로 변환하거나 JSON 데이터를 사용자 모델로 역직렬화하는 역할
    class Meta:
        model = get_user_model()                             # get_user_model() 함수는 현재 사용 중인 사용자 모델을 가져오는 Django의 함수
        fields = ['id', 'username', 'password', 'email']     # 시리얼라이저에서 직렬화할 필드 목록을 지정

    extra_kwargs = {'password': {'write_only': True}}        # 'password' 필드가 요청 데이터에서만 사용되고 응답 데이터에는 포함되지 않도록 설정. 보안적인 이유로 비밀번호가 응답 데이터에 노출되지 않도록 함

    def create(self, validated_data):                        # validated_data 매개변수에는 사용자가 제출한 데이터가 유효성 검사를 통과한 후 전달
        user = get_user_model().objects.create_user(         # get_user_model().objects.create_user를 사용하여 사용자를 생성하고 반환합니다.
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    

# 이렇게 정의된 시리얼라이저 클래스는 사용자 모델의 데이터를 JSON 형식으로 직렬화하고, 사용자 생성을 처리하는 데 사용
# 이를 통해 API 엔드포인트에서 사용자 관련 데이터를 다룰 수 있음
# < 시리얼라이저를 사용하여 데이터를 JSON 포맷으로 변경하는 이유 >
# 1) 웹 애플리케이션에서는 클라이언트와 서버간 데이터를 주고 받는데 이 때 클라이언트와 서버 간에 언어나 형식이 다를 수 있기 때문에 데이터를 표준 형식인 JSON으로 변환
# 2) 시리얼라이저를 사용하면 데이터를 검사하고 유효한지 확인 할 수 있음(ex, 사용자가 등록 양식에 이메일 주소를 잘못 입력하면 오류 메시지 발생)
# 3) 민감한 정보(비밀번호)를 포함한 데이터는 JSON 형식으로 변환하여 안전하게 전송 할 수 있음.