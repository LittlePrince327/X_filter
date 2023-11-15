import subprocess
result_1 = subprocess.run(['pip', 'install', 'tensorflow'], capture_output=True, text=True)   # 필요 라이브러리 설치
result_2 = subprocess.run(['pip', 'show', 'tensorflow'], capture_output=True, text=True)
print(result_1.stdout)
print(result_2.stdout)                                               

import numpy as np
import pandas as pd
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

df = pd.read_csv(r'C:\Users\GJAISCHOOL\Documents\카카오톡 받은 파일\sentence pl data1113 수정.csv')

sentences = df['sentence'].tolist()
rnn_tokenizer = Tokenizer()
rnn_tokenizer.fit_on_texts(sentences)

vocab_size = len(rnn_tokenizer.word_index) + 1                              # 어휘 사전에 크기 계산 

sequences = list()                                                      # 각 문장을 단어 시퀀스로 변환하고, 문장의 부분 시퀀스를 생성하여 리스트에 추가
for line in sentences:
    encoded = rnn_tokenizer.texts_to_sequences([line])[0]                   # 현재 문장을 정수로 시퀀스로 변수
    for i in range(1, len(encoded)):                                    # 문장의 부분 시퀀스를 생성하고 리스트에 추가
        sequence = encoded[: i+1]
        sequences.append(sequence)

max_len = max(len(l) for l in sequences)                                # 모든 샘플에서 길이가 가장 긴 샘플의 길이 출력
sequences = pad_sequences(sequences, maxlen=max_len, padding='pre')     # 시퀀스 데이터를 패딩하여 일정한 길이로 만듦 (여기서는 가장 긴 샘플의 길이로 패딩)

sequences = np.array(sequences)                                         # 패딩이 된 시퀀스를 넘파이 배열로 변환
                                                                        # 입력 및 출력 데이터 생성
X = sequences[:, :-1]                                                   # 시퀀스에서 마지막 단어를 제외한 부분은 입력(X)
y = sequences[:, -1]                                                    # 시퀀스에 마지막 단어는 출력
y = to_categorical(y, num_classes=vocab_size)                           # 출력(y)을 one-hot 인코딩 형태로 변환

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, Dense, SimpleRNN

embedding_dim = 10                                                      # 임베딩 차원을 10으로 10차원의 실수 벡터로 표현
hidden_units = 32                                                       # 순환 신경망 내 내부에서의 뉴련의 수

RNN_model = Sequential()                                                    
RNN_model.add(Embedding(vocab_size, embedding_dim))                     # Embedding 레이어 추가: 어휘 사전의 크기를 입력으로 받고, 지정된 임베딩 차원으로 단어를 임베딩
RNN_model.add(SimpleRNN(hidden_units))                                  # 지정된 은닉 유닛 수를 가진 단순한 RNN 레이어
RNN_model.add(Dense(vocab_size, activation='softmax'))                  # 출력 레이어 추가 : 어휘 사전의 크길르 가진 Dense 레이어를 사용하며, 활성화 함수는 softmax
RNN_model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
                                                                        # 모델 컴파일: 다중 클래스 분류 문제이므로 categorical_crossentropy 손실 함수와 Adam 옵티마이저 사용
RNN_model.fit(X, y, epochs=200, verbose=2)                              # 모델 학습: 입력(X) 및 출력(y) 데이터를 사용하여 주어진 에폭 동안 모델을 학습

def sentence_generation(current_word, n, temperature=1.0, model=RNN_model, tokenizer=rnn_tokenizer):
    init_word = current_word                                            # 시작 단어와 문장을 저장할 빈 문자열 초기화
    sentence = ''

    for _ in range(n):                                                  # n개 단어 만큼 문자 생성
        encoded = rnn_tokenizer.texts_to_sequences([current_word])[0]       # 현재 단어를 토크나이저를 사용하여 정수 시퀀스로 변환 
                                                                        # ex) "Hello, how are you?" => "Hello"가 1, "how"가 2, "are"가 3, "you"가 4라고 할 때 => [1, 2, 3, 4]
        encoded = pad_sequences([encoded], maxlen=5, padding='pre')     # 시퀀스가 5로 설정하고, 부족하면 앞쪽에 0을 채워넣고 부족하면 앞부분을 자른다.
                                                                        # 만약 뒤쪽으로 바꾸고싶으면 padding='post를 주면 된다.
        result = RNN_model.predict(encoded, verbose=0)                  # 모델의 다음단어 예측
        result = result / temperature                                   # 확률에 온도를 적용하여 랜덤성 조절
        result = np.exp(result) / np.sum(np.exp(result), axis=1)        # 소프트맥스를 적용하여 최종 확률 얻기
        sampled_index = np.random.choice(len(result[0]), p=result[0])   # 예측된 확률을 기반으로 다음 단어 샘플링
        word = rnn_tokenizer.index_word[sampled_index]

        current_word = current_word + ' ' + word                        # 현재 단어와 문장 업데이트
        sentence = sentence + ' ' + word

    sentence = init_word + sentence
    return sentence