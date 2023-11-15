import os

# 파이썬 환경 구축 후 라이브러리 버전 맞춰 설치
packages_to_install = [
    "transformers==4.30.2",
    "torch==2.1.0",
    "soynlp==0.0.493",
    "requests==2.31.0",
    "tensorflow==2.10.0",
    "accelerate==0.20.1",
    "PyKoSpacing==0.5",
    "kss==4.5.4",
    "matplotlib==3.7.3",
    "wordcloud==1.9.2",
    "JPype1==1.4.1",
    "rhinoMorph==4.0.1.12",
    "kiwipiepy==0.16.1",
    "Konlpy==0.6.0",
    "nltk==3.8.1"
]

for package in packages_to_install:
    os.system(f"pip install {package}")

# pip 업그레이드
os.system("python -m pip install --upgrade pip")

# 파이썬 라이브러리 버전 전체 확인
os.system("pip freeze")

# 파이썬 라이브러리 버전 하나씩 확인
packages_to_show = [
    "transformers",
    "torch",
    "soynlp",
    "requests",
    "tensorflow",
    "accelerate",
    "PyKoSpacing",
    "kss",
    "matplotlib",
    "wordcloud",
    "JPype1",
    "rhinoMorph",
    "kiwipiepy",
    "Konlpy",
    "nltk"
]

for package in packages_to_show:
    os.system(f"pip show {package}")


# git에서 라이브러리 복제
os.system("git clone https://github.com/ZIZUN/korean-malicious-comments-dataset.git")
os.system("bash <(curl -s https://raw.githubusercontent.com/konlpy/konlpy/master/scripts/mecab.sh)")

print("라이브러리 설치가 완료되었습니다.")
