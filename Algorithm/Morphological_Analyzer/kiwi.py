import subprocess

# kiwi 모듈을 설치하는 명령어
command = 'pip install kiwi'

# subprocess 모듈을 사용하여 명령어 실행
subprocess.run(command, shell=True)


from kiwipiepy import Kiwi
kiwi= Kiwi(num_workers=0, model_path=None, load_default_dict=True, integrate_allomorph=False)


##########################


# import sys
# from kiwipiepy import Kiwi

# # Kiwi 인스턴스 생성
# kiwi = Kiwi()

# while True:
#     # 사용자로부터 단어 입력 받기
#     word = input("단어를 입력하세요 (종료하려면 'exit'를 입력하세요): ")
    
#     # 'exit'를 입력하면 루프 종료
#     if word.lower() == 'exit':
#         break
    
#     tokens = kiwi.tokenize(word, normalize_coda=True)
    
#     # 토큰 출력
#     for token in tokens:
#         print(token)
#         print(" ")
    
####################################################3

def start():
    kiwi.tokenize('개쓰레기', normalize_coda=True)
    kiwi.add_user_word("코로나 19", tag='NNG', score=0.0)
    kiwi.add_user_word("18년", tag='NNG', score=0.0)
    kiwi.add_user_word("같은", tag='VA', score=0.0)
    kiwi.add_user_word("시발놈", tag='NNG', score=0.0)
    kiwi.add_user_word("다니다", tag='VV', score=0.0)
    kiwi.add_user_word("보면", tag='VV', score=0.0)
    kiwi.add_user_word("차키", tag='NNG', score=0.0)
    kiwi.add_user_word("없을", tag='VA', score=0.0)
    kiwi.add_user_word("패밀리룩", tag='NNG', score=0.0)
    kiwi.add_user_word("헤드램프", tag='NNG', score=0.0)

start()

# NNG - 일반 명사
# NNP - 고유 명사
# NNB - 의존 명사
# NR - 수사 (숫자)
# NP - 대명사
# VV - 동사
# VA - 형용사
# VX - 보조 용언
# VCP - 긍정 지정사
# VCN - 부정 지정사
# MM - 관형사
# MAG - 일반 부사
# MAJ - 접속 부사
# IC - 감탄사
# JKS - 주격 조사
# JKC - 보격 조사
# JKG - 관형격 조사
# JKO - 목적격 조사
# JKB - 부사격 조사
# JKV - 호격 조사
# JKQ - 인용격 조사
# JX - 보조사
# JC - 접속 조사
# EP - 선어말 어미
# EF - 종결 어미
# EC - 연결 어미
# ETN - 명사형 전성 어미
# ETM - 관형형 전성 어미
# XPN - 체언 접두사
# XSN - 명사 파생 접미사
# XSV - 동사 파생 접미사
# XSA - 형용사 파생 접미사
# XR - 어근
# SF - 마침표, 물음표, 느낌표
# SP - 쉼표, 가운뎃점, 콜론, 빗금
# SSO - 여는 괄호 (괄호의 시작)
# SSC - 닫는 괄호 (괄호의 닫힘)
# SC - 구두점 (마침표, 물음표, 느낌표)
# SY - 기타 기호
# SH - 한자
# SL - 외국어
# SN - 숫자
# ZP - 한글 특수 문자
# ZN - 숫자 특수 문자
# ZV - 기타 특수 문자