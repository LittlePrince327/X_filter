from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.db import models
from django.utils import timezone

class CustomUserManager(BaseUserManager):                                                # 사용자 객체를 생성하고 관리하는 클래스
    def create_user(self, username, email, password=None, **extra_fields):               # 새 사용자 생성(사용자이름,이메일,비밀번호를 필수정보로 입력 받음) // 기본적으로 create_user 함수를 호출할 때 사용자에게 비밀번호를 바로 전달받지 않고, 사용자 객체를 먼저 생성하고 나중에 사용자가 비밀번호를 설정할 수 있도록 하는 것이 보안적으로 더 안전하기 때문에 'password=None'으로 초기값을 설정하여 비밀번호 없이도 함수를 호출 할수 있도록 함
        if not email:                                                                    # 이메일 필드 누락 확인, 데이터의 유효성 검사
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)                                              # 이메일 정규화
        user = self.model(username=username, email=email, **extra_fields)                # 'self.model'은 현재 클래스(CustomUserManager)의 모델을 나타냄. // 'self.model(username=username, email=email, **extra_fields)' 이 부분은 새로운 사용자 객체를 생성하는 부분. 즉, 새 사용자를 만들려고 하는 것. 그리고 데이터베이스에 저장
        user.set_password(password)                                                      # 비밀번호를 해싱하여 저장하는 Django의 내장 메서드
        user.save(using=self._db)                                                        # 데이터베이스 트랜잭션 내에서 작업이 수행되므로, 오류가 발생하면 롤백
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):          # Django의 사용자 모델을 확장하고, 슈퍼유저를 생성(슈퍼유저는 일반 사용자에 비해 추가적인 권한을 가지며, 시스템 관리자 또는 관리 대시보드에 접근할 수 있는 특권을 가짐)
        extra_fields.setdefault('is_staff', True)                                        # extra_fields 딕셔너리에 스태프 권한을 가지는 사용자를 추가
        extra_fields.setdefault('is_superuser', True)                                    # extra_fields 딕셔너리에 슈퍼유저 권한을 가지는 사용자를 추가

        if extra_fields.get('is_staff') is not True:                                     # 'is_staff'키의 값을 확인해서 True가 아니라면 오류를 발생시킴
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:                                 # 'is_superuser'키의 값을 확인해서 True가 아니라면 오류를 발생시킴
            raise ValueError('Superuser must have is_superuser=True.')                   # 사용자가 슈퍼유저(관리자) 권한을 요청할 때, 스태프 권한과 슈퍼유저 권한을 모두 가져야 한다는 조건을 검사하고, 만약 조건을 만족하지 않으면 오류를 발생시킴.

        return self.create_user(username, email, password, **extra_fields)               # 사용자 생성 작업을 수행하는 함수이며, 만들어진 사용자를 함수를 호출한 곳으로 반환

class CustomUser(AbstractBaseUser, PermissionsMixin):                                    # AbstractBaseUser : 사용자이름 또는 이름 등 고유한 값을 통해 사용자를 식별하는 장고의 클래스 // PermissionsMixin :  사용자에게 권한을 부여하고 관리하는데 사용하는 클래스 // 이 두가지 클래스를 함께 사용하면 Django 애플리케이션에서 사용자 모델을 구현하고 사용자의 기본 데이터와 권한을 처리할 수 있음
    username = models.CharField(max_length=50, unique=True)                              # 'CustomUser' 클래스 내에서 'username'이라는 필드를 정의. username 필드의 최대 길이는 50자이며 고유한(unique)값을 가져야함. 사용자명을 저장
    email = models.EmailField(unique=True)                                               # 'CustomUser' 클래스 내에서 'email'이라는 필드를 정의. email 필드는 이메일 주소를 저장하는 데 사용되며 고유한(unique)값을 가져야함
    is_active = models.BooleanField(default=True)                                        # 'is_active'는 사용자 계정의 활성/비활성 상태를 나타내는 필드. 기본은 활성상태('True')이며, 이 필드를 통해 계정의 활성 상태를 제어할 수 있음
    is_staff = models.BooleanField(default=False)                                        # 'is_staff'는 사용자가 관리자 권한을 가지는지 여부를 나타내는 필드. 기본적으로 사용자는 관리자 권한을 가지지 않는 상태(False)로 설정
    date_joined = models.DateTimeField(default=timezone.now)                             # 'date_joined'는 사용자의 계정이 생성된 날짜와 시간을 저장하는 필드. 기본값으로 현재 시간(timezone.now)을 사용


    groups = models.ManyToManyField(Group, blank=True, related_name='custom_users', related_query_name='custom_user')                      # 'groups' 필드는 사용자가 속한 그룹을 냄. 이 필드는 다수의 그룹과 연결될 수 있으며, Group 모델과 연결
    user_permissions = models.ManyToManyField(Permission, blank=True, related_name='custom_users', related_query_name='custom_user')       # 'user_permissions' 필드는 사용자가 가진 권한(permissions)을 나타냄. 이 필드도 다수의 권한과 연결될 수 있으며, Permission 모델과 연결
                                                                                                                                           # 'models.ManytoManyField'는 Django에서 모델 간 다대다(Many-to-Many)관계를 나타내는 필드임. 하나의 모델 인스턴스가 다른 모델의 여러 인스턴스와 연결
    objects = CustomUserManager()                                                                                                          # 'objects'는 사용자 모델을 관리하는 데 사용되는 매니저(manager)를 설정. CustomUserManager() 클래스를 사용하여 사용자와 관련된 작업을 수행
 
    USERNAME_FIELD = 'email'                                                                                                               # 'USERNAME_FIELD'는 사용자가 로그인할 때 사용할 필드를 지정. 이 경우, 사용자는 이메일 주소를 사용하여 로그인
    REQUIRED_FIELDS = ['username', 'email']                                                                                                # 'REQUIRED_FIELDS'는 createsuperuser 명령을 사용하여 슈퍼유저(관리자)를 생성할 때 필수로 입력해야 하는 필드를 정의. 여기에서는 사용자명(username)과 이메일(email)이 필수 필드로 설정



# 사용자 객체는 일반적으로 사용자의 이름, 이메일, 비밀번호 및 다른 정보를 저장하는 데이터 구조

# 사용자 객체를 생성하고 관리한다는 것은 웹 애플리케이션에서 사용자의 정보를 수집하고, 저장하고, 필요할 때 관리하여 사용자와 상호작용하는 일련의 작업을 의미

# 로그인, 가입, 비밀번호 관리 및 사용자 데이터를 다루는 데 중요한 부분