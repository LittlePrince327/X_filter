import rhinoMorph

def add_user_words(rn, words_and_tags):
    for word, tag in words_and_tags:
        rhinoMorph.add_dictionary(rn, [(word, tag)])

def start():
    rn = rhinoMorph.startRhino()

    # 사용자 사전에 추가할 단어와 품사
    new_words_and_tags = [
        ('코로나 19', 'NNG'),
        ('18년', 'NNG'),
        ('같은', 'VA'),
        ('시발놈', 'NNG'),
        ('다니다', 'VV'),
        ('보면', 'VV'),
        ('차키', 'NNG'),
        ('없을', 'VA'),
        ('패밀리룩', 'NNG'),
        ('헤드램프', 'NNG'),
    ]

    # 사용자 사전에 단어와 품사 추가
    add_user_words(rn, new_words_and_tags)

# 함수 호출
start()
