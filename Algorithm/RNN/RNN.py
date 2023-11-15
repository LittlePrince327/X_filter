import subprocess
result = subprocess.run(['pip', 'show', 'numpy', 'pandas', 'tensorflow'], capture_output=True, text=True)
print(result.stdout)

import numpy as np
import pandas as pd
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

df = pd.read_csv(r'C:\Users\GJAISCHOOL\Desktop\X_filter\Algorithm\dataset\good_sentence.csv')

sentences = df['sentence'].tolist()
tokenizer = Tokenizer()
tokenizer.fit_on_texts(sentences)

vocab_size = len(tokenizer.word_index) + 1

sequences = list()
for line in sentences:
    encoded = tokenizer.texts_to_sequences([line])[0]
    for i in range(1, len(encoded)):
        sequence = encoded[: i+1]
        sequences.append(sequence)

max_len = max(len(l) for l in sequences) # 모든 샘플에서 길이가 가장 긴 샘플의 길이 출력
sequences = pad_sequences(sequences, maxlen=max_len, padding='pre')

sequences = np.array(sequences)
X = sequences[:, :-1]
y = sequences[:, -1]
y = to_categorical(y, num_classes=vocab_size)

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, Dense, SimpleRNN

embedding_dim = 10
hidden_units = 32

model = Sequential()
model.add(Embedding(vocab_size, embedding_dim))
model.add(SimpleRNN(hidden_units))
model.add(Dense(vocab_size, activation='softmax'))
model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

model.fit(X, y, epochs=200, verbose=2)

def sentence_generation(current_word, n, temperature=1.0, model=model, tokenizer=tokenizer):
    init_word = current_word                                                # 시작 단어와 문장을 저장할 빈 문자열 초기화
    sentence = ''

    for _ in range(n):                                                      # n개 단어 만큼 문자 생성
        encoded = tokenizer.texts_to_sequences([current_word])[0]           # 현재 단어를 토크나이저를 사용하여 정수 시퀀스로 변환 
                                                                            # ex) "Hello, how are you?" => "Hello"가 1, "how"가 2, "are"가 3, "you"가 4라고 할 때 => [1, 2, 3, 4]
        encoded = pad_sequences([encoded], maxlen=5, padding='pre')         # 시퀀스가 5로 설정하고, 부족하면 앞쪽에 0을 채워넣고 부족하면 앞부분을 자른다.
                                                                            # 만약 뒤쪽으로 바꾸고싶으면 padding='post를 주면 된다.
        result = model.predict(encoded, verbose=0)                          # 모델의 다음단어 예측
        result = result / temperature                                       # 확률에 온도를 적용하여 랜덤성 조절
        result = np.exp(result) / np.sum(np.exp(result), axis=1)            # 소프트맥스를 적용하여 최종 확률 얻기
        sampled_index = np.random.choice(len(result[0]), p=result[0])       # 예측된 확률을 기반으로 다음 단어 샘플링
        word = tokenizer.index_word[sampled_index]

        current_word = current_word + ' ' + word                            # 현재 단어와 문장 업데이트
        sentence = sentence + ' ' + word

    sentence = init_word + sentence
    return sentence