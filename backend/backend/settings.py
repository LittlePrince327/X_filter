import os                              # 파이썬에게 운영체제(Operating System)와 상호 작용할 수 있는 기능을 제공하는 라이브러리인 os를 가져오는 역할, 운영체제와 관련된 작업을 할 때 사용
from pathlib import Path               # 파일 경로와 관련된 작업을 수행하는 데 도움이 되는 도구
from datetime import timedelta         # 시간 간격을 나타내는 데 사용되며 시간 계산과 관련된 작업에서 유용

BASE_DIR = Path(__file__).resolve().parent.parent                                     # BASE_DIR : 특별한 위치를 가리키는 별명이나 레이블 같은 것, 정보를 저장하고 싶은 장소 // __file__ : 현재 파일의 위치를 컴퓨터에게 알려줌 // .resolve() : 컴퓨터에게 현재 파일의 정확한 실제 위치를 찾도록 하는 역할 // .parent.parent : 폴더 구조에서 현재 위치에서 두 단계 위로 올라가는 것. 현재 디렉토리(폴더)에 있는데, 거기서 두 단계 위에 있는 다른 폴더를 찾는 것과 비슷 // 전체 요약 : 현재 파일의 위치를 찾아서, 폴더 구조에서 두 단계 위로 올라가서 그 위치를 'BASE_DIR'로 부르겠다. 이렇게 하면 중요한 파일이나 데이터가 어디에 있는지 추적할 수 있고, 'BASE_DIR'을 프로그램에서 참조 지점으로 사용할 수 있음.

SECRET_KEY = 'django-insecure-16dpapt6zvjwh$+ba2v$3le(w9ew3kbzb&x@a^opyoufp&*=jn'     # Django 애플리케이션의 보안 키로, 암호화와 보안에 사용

DEBUG = True                                                                          # 디버그 모드가 활성화되어 있는지를 나타내며, 개발 중에는 True로 설정하고 실제 서비스 배포 시에는 False로 설정

ALLOWED_HOSTS = []                                                                    # 접속을 허용할 호스트(도메인 또는 IP 주소) 목록입니다.

INSTALLED_APPS = [                                                                    # Django 애플리케이션에서 사용하는 앱(기능) 목록
    
    'django.contrib.admin',            # 관리자 웹 인터페이스를 제공하는 앱 // 데이터베이스의 내용을 관리하고 관리자 페이지를 사용하여 모델 데이터를 수정                                    
    'django.contrib.auth',             # 사용자 인증과 관련된 기능을 제공 // 사용자 계정, 그룹, 권한, 로그인 및 로그아웃과 같은 기능을 관리
    'django.contrib.contenttypes',     # 콘텐츠 유형과 관련된 모델을 정의하고 관리 // 제네릭 관계와 관련된 작업을 지원하는 데 사용
    'django.contrib.sessions',         # 세션을 처리하는 데 사용되는 앱 // 사용자의 상태 및 로그인 정보를 유지하고 관리
    'django.contrib.messages',         # 사용자에게 메시지를 표시하는 데 사용 // 예를 들어, 성공 메시지 또는 오류 메시지를 사용자에게 표시할 때 유용
    'django.contrib.staticfiles',      # 정적 파일 (CSS, JavaScript, 이미지 등)을 관리하고 제공하는 데 사용 // 웹 페이지의 디자인 및 스타일링과 관련된 파일을 처리
    'login.apps.LoginConfig',          # 사용자 인증 및 로그인과 관련된 사용자 정의 앱 // 프로젝트에서 정의한 사용자 관리를 위한 앱
    'corsheaders',                     # Cross-Origin Resource Sharing (CORS)를 구현하는 데 사용 // 다른 도메인 또는 출처에서 웹 애플리케이션 리소스에 접근하는 권한을 설정
    'rest_framework',                  # Django REST framework를 사용하여 RESTful API를 개발하는 데 필요한 기능을 제공하는 앱 // API 개발 및 관리를 지원
    'rest_framework.authtoken',        # Django REST framework의 인증 토큰을 구현하는 데 사용 //  API 사용자의 인증 및 권한 관리를 지원
    'idpassword',
    'board',


]

MIDDLEWARE = [                                                                        # HTTP 요청 및 응답을 처리하는 미들웨어 목록
    'django.middleware.security.SecurityMiddleware',                                  # 웹 애플리케이션의 보안을 강화하는 데 사용. 예를 들어, HTTP 헤더를 설정하고 보안 관련 측면을 관리하여 웹 애플리케이션을 보다 안전하게 만듬
    'corsheaders.middleware.CorsMiddleware',                                          # "Cross-Origin Resource Sharing" (CORS)를 관리하는 데 사용. 웹 페이지가 다른 도메인에서 리소스(예: 이미지 또는 데이터)를 로드할 때 보안 정책을 설정하고 관리, 이를 통해 웹 애플리케이션이 여러 도메인 간에 데이터를 공유할 수 있음
    'django.contrib.sessions.middleware.SessionMiddleware',                           # 사용자 세션(세션은 사용자 상태 정보를 저장하는 데 사용되는 것)을 처리. 사용자가 로그인하거나 웹 애플리케이션에서 상태 정보를 유지하는 데 사용
    'django.middleware.common.CommonMiddleware',                                      # 일반적인 웹 요청 및 응답 관련 작업을 처리. 예를 들어, URL 리디렉션, 슬래시 처리 등의 작업을 수행
    'django.middleware.csrf.CsrfViewMiddleware',                                      # Cross-Site Request Forgery (CSRF) 공격으로부터 웹 애플리케이션을 보호하기 위해 사용. 사용자가 웹 페이지를 로드하거나 요청을 보낼 때, 요청이 신뢰할 수 있는지 확인하는 역할
    'django.contrib.auth.middleware.AuthenticationMiddleware',                        # 사용자 인증 및 세션 관리를 처리. 사용자가 로그인하고 웹 애플리케이션에 대한 권한을 관리하는 데 사용
    'django.contrib.messages.middleware.MessageMiddleware',                           # 메시지(예: 성공 메시지 또는 오류 메시지)를 처리하고 템플릿으로 전달하는 데 사용
    'django.middleware.clickjacking.XFrameOptionsMiddleware',                         # 웹 애플리케이션을 클릭재킹(CSRF) 공격으로부터 보호하기 위해 사용. 
]

ROOT_URLCONF = 'backend.urls'                                                         # 프로젝트의 URL 패턴을 정의하는 모듈

TEMPLATES = [                                                                       
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',               
        'DIRS': [os.path.join(BASE_DIR, 'templates')],                               
        'APP_DIRS': True,                                                            
        'OPTIONS': {                                                                  
            'context_processors': [                                                   
                'django.template.context_processors.debug',                          
                'django.template.context_processors.request',                        
                'django.contrib.auth.context_processors.auth',                       
                'django.contrib.messages.context_processors.messages',               
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'                                         # WSGI[ Web Server Gateway Interface - Django와 같은 웹 애플리케이션 프레임워크가 웹 서버와 통신하기 위한 규칙과 규격] 애플리케이션을 설정하는 경로

REST_FRAMEWORK = {                                                                    # RESTful API 설정 [ API : "Application Programming Interface"의 약어로, 두 가지 애플리케이션이 서로 통신하고 데이터를 교환하는 방법을 정의하여 데이터 교환, 기능 확장, 외부 접속을 가능하게 함 // 엔드포인트 :  API에서 특정 리소스(예: 데이터, 서비스, 함수)에 접근하는 URL 또는 경로를 나타냄. 특정 작업을 수행하거나 데이터를 가져오는 데 사용. 일반적으로 URL 경로와 HTTP 요청 메서드(예: GET, POST, PUT, DELETE)로 식별 ]
    'DEFAULT_PERMISSION_CLASSES': (                                                   # API 엔드포인트에 대한 기본 권한 클래스를 설정
        'rest_framework.permissions.IsAuthenticated',                                 # 사용자가 인증(로그인)되어야 API에 접근할 수 있도록 하는 권한 클래스
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (                                               # API 엔드포인트에 대한 기본 인증 클래스를 설정
        'rest_framework_simplejwt.authentication.JWTAuthentication',                  # JSON Web Token (JWT)을 사용하여 사용자를 인증
    ),
}

SIMPLE_JWT = {                                                                        # JSON Web Token (JWT)을 사용하여 사용자 인증 및 권한 관리를 구현하기 위한 설정 [ 토큰의 수명과 갱신 규칙을 설정함으로써, 사용자가 일정 기간 동안 로그인된 상태를 유지하고, 토큰을 갱신하여 계속 사용할 수 있도록 제어 ] 
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),                                   # 액세스 토큰(Access Token)의 수명을 설정. 액세스 토큰은 사용자가 로그인한 후에 발급되며, 이 설정은 액세스 토큰이 만료되는 시간을 나타냄. 여기서는 60분(1시간)으로 설정되어 있으므로, 사용자가 1시간 동안 로그인한 상태를 유지
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),                              # 슬라이딩 토큰 갱신 시간을 설정. 슬라이딩 토큰은 액세스 토큰이 만료되기 전에 갱신할 수 있는 시간을 나타냄. 여기서는 1일로 설정되어 있으므로, 사용자가 액세스 토큰을 1일 동안 갱신할 수 있음
    'SLIDING_TOKEN_LIFETIME': timedelta(days=1),                                      # 슬라이딩 토큰의 수명을 설정. 슬라이딩 토큰은 액세스 토큰의 유효 시간을 나타내며, 여기서는 1일로 설정되어 있으므로, 액세스 토큰은 1일 동안 유효
    'SLIDING_TOKEN_REFRESH_LIFETIME_GRACE_PERIOD': timedelta(days=1),                 # 슬라이딩 토큰 갱신 시간의 유효성 기간을 설정. 슬라이딩 토큰 갱신이 가능한 시간과 관련이 있으며, 여기서는 1일로 설정되어 있으므로, 1일 동안은 슬라이딩 토큰을 갱신할 수 있음
    'SLIDING_TOKEN_LIFETIME_GRACE_PERIOD': timedelta(days=1),                         # 슬라이딩 토큰의 유효 시간의 유효성 기간을 설정. 슬라이딩 토큰의 수명 기간과 관련이 있으며, 여기서는 1일로 설정되어 있으므로, 1일 동안 슬라이딩 토큰을 사용할 수 있음
}

DATABASES = {                                                                         #  데이터베이스에 대한 구성 설정 저장 [ 'default'라는 이름의 SQLite 데이터베이스에 대한 Django 데이터베이스 구성을 설정하고, SQLite 데이터베이스 파일이 프로젝트의 루트 디렉토리에 'db.sqlite3'라는 이름으로 위치하도록 지정 ]
    'default': {                                                                      # 'default'라는 데이터베이스 구성을 정의. 이 이름은 Django 프로젝트 전체에서 이 데이터베이스 구성을 참조할 때 사용
        'ENGINE': 'django.db.backends.sqlite3',                                       # Django가 데이터베이스에 연결할 때 사용할 데이터베이스 엔진을 지정. SQLite 데이터베이스 엔진을 사용해야 함을 나타냄. SQLite는 경량이며 서버 없이 파일 기반의 데이터베이스로, 주로 개발 또는 소규모 응용 프로그램에 사용
        'NAME': BASE_DIR / 'db.sqlite3',                                              # SQLite 데이터베이스 파일의 이름과 위치를 지정. 
    }
}

AUTH_PASSWORD_VALIDATORS = [                                                          # 사용자 비밀번호 유효성 검사 설정
    # {
    #     'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',     # 사용자의 비밀번호와 사용자의 속성(예: 사용자 이름)이 유사한지를 검사하는 비밀번호 유효성 검사기를 활성화. 사용자의 비밀번호와 사용자 이름과 같은 속성 간의 유사성을 확인하여 보안성을 높이려는 목적으로 사용
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',               # 비밀번호의 최소 길이를 검사하는 비밀번호 유효성 검사기를 활성화. 
    #     'OPTIONS': {
    #         'min_length': 8, # 비밀번호의 최소 길이를 8자로 설정
    #     },
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',              # 일반적인, 자주 사용되는 비밀번호(예: "password123")를 사용하지 못하도록 검사하는 비밀번호 유효성 검사기를 활성화
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',             # 비밀번호에 숫자가 포함되는지 검사하는 비밀번호 유효성 검사기를 활성화. 사용자 비밀번호에 숫자를 포함해야 함을 강제
    #     'OPTIONS': {
    #         'min_digits': 4, # 비밀번호에 포함해야 하는 최소 숫자의 수
    #     }
    # },
]


LANGUAGE_CODE = 'ko-kr'                                                                # 기본 언어 코드

TIME_ZONE = 'UTC'                                                                      # 시간대 설정

USE_I18N = True                                                                        # "Internationalization"의 약자로, 다국어 및 지역화 기능을 활성화하거나 비활성화하는 설정

USE_TZ = True                                                                          # "Time Zone"의 약자로, 시간대 관련 설정을 활성화하거나 비활성화하는 설정

STATIC_URL = '/static/'                                                                # 정적 파일의 URL 경로

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

LOGIN_REDIRECT_URL = '/'                                                               # 로그인 후 리디렉션할 URL

LOGOUT_REDIRECT_URL = '/'                                                              # 로그아웃 후 리디렉션할 URL

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'                                   # Django 3.2 버전부터 추가된 설정으로, 모델의 기본 자동 증가(primary key) 필드 유형을 지정하는 데 사용. 이 설정은 사용자가 직접 모델의 primary key 필드 유형을 지정하지 않았을 때, Django에서 자동으로 생성하는 primary key 필드 유형을 결정
 
CORS_ALLOWED_ORIGINS = [                                                               # Cross-Origin Resource Sharing (CORS)를 허용할 원천 주소 목록
    "http://localhost:3000",  # 클라이언트의 도메인 주소
    "http://127.0.0.1:8000",  # 백엔드의 주소
]

CORS_ALLOW_CREDENTIALS = True                                                          # CORS 요청에서 인증 정보를 전송할지 여부를 나타냄

CORS_ALLOW_ALL_ORIGINS = True

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

AUTH_USER_MODEL = 'login.CustomUser' 

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

EMAIL_HOST = 'smtp.gmail.com'

EMAIL_PORT = '587'

EMAIL_HOST_USER = 'iamdoxoak@gmail.com'

EMAIL_HOST_PASSWORD = 'ajrp ytxx mmvk sxmi'

EMAIL_USE_TLS = True

DEFAULT_FROM_EMAIL = EMAIL_HOST_USER