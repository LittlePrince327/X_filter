from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.db import models
from django.utils import timezone

# 사용자를 생성하고 관리하는 매니저 클래스 정의
class CustomUserManager(BaseUserManager):
    # 일반 사용자를 생성하는 메서드
    def create_user(self, username, email, password=None, full_name='', **extra_fields):
        # 이메일이 없으면 에러 발생
        if not email:
            raise ValueError('The Email field must be set')
        # full_name이 이미 존재하는지 확인
        if CustomUser.objects.filter(full_name__iexact=full_name).exists():
            raise ValueError('User with this full_name already exists.')
        # 이메일을 소문자로 통일
        email = self.normalize_email(email)
        # 사용자 모델을 생성하고 필드 값을 설정
        user = self.model(username=username, email=email, full_name=full_name, **extra_fields)
        # 비밀번호를 설정하고 저장
        user.set_password(password)
        user.save(using=self._db)
        return user

    # 슈퍼유저(관리자)를 생성하는 메서드
    def create_superuser(self, username, email, password=None, **extra_fields):
        # 기본 값으로 스태프 및 슈퍼유저 권한을 설정
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        # 스태프 및 슈퍼유저 권한이 설정되지 않았다면 에러를 발생
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        # 일반 사용자 생성 메서드를 호출하여 슈퍼유저를 생성
        return self.create_user(username, email, password, **extra_fields)

# 사용자 모델 정의
class CustomUser(AbstractBaseUser, PermissionsMixin):
    # 사용자 정보를 저장할 필드 정의
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    followings = models.ManyToManyField('self', symmetrical=False, related_name='followers')

    # 사용자가 속한 그룹과 부여받은 권한을 나타내는 필드들을 정의
    groups = models.ManyToManyField(Group, blank=True, related_name='custom_users', related_query_name='custom_user')
    user_permissions = models.ManyToManyField(Permission, blank=True, related_name='custom_users', related_query_name='custom_user')

    # 위에서 정의한 매니저 클래스를 사용하여 객체를 생성하도록 설정
    objects = CustomUserManager()

    # 로그인 시 사용할 필드를 지정
    USERNAME_FIELD = 'username'
    # 회원가입 시 필수로 입력받을 필드를 지정
    REQUIRED_FIELDS = ['email']
