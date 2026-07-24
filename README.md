# X-filter

SNS 게시글·캡션·채팅 문장에서 비속어를 탐지하고, 문맥을 유지한 대체 문장을 추천하는 팀 프로젝트입니다.

## 핵심 기능

1. SNS 특유의 줄임말·변형 표현·신조어 정규화
2. KcELECTRA·KcBERT·RandomForest·Logistic Regression 비교
3. KcBERT 기반 비속어 이진 분류
4. 탐지된 비속어 구간 추출
5. RNN·LSTM 기반 대체 문장 생성
6. 생성 문장의 혐오 표현 재확인

## 데이터

- 원본 문장: 214,189건
- 중복 제거 후 학습 데이터: 167,709건
- 중복 제거 후 평가 데이터: 42,587건
- 학습/평가 분리: 8:2, `random_state=42`

## 프로젝트 결과 기록

| 구분 | 모델 | 지표 |
|---|---|---|
| 비속어 분류 | KcBERT | Accuracy 0.96 |
| 비속어 분류 | KcBERT | Precision 0.97 |
| 비속어 분류 | KcBERT | Recall 0.95 |
| 비속어 분류 | KcBERT | F1 0.96 |
| 대체 문장 생성 | RNN·LSTM | BLEU 73 |

위 수치는 기존 이력서·경력기술서 등 프로젝트 결과 기록을 기준으로 통일했습니다. 저장소에는 KcELECTRA·KcBERT를 포함한 중간 실험 노트북이 함께 있으며, 실험 조건에 따라 중간 출력값이 다를 수 있습니다. 동일 평가셋을 이용한 재평가 방법은 [`docs/XFILTER_METRICS.md`](docs/XFILTER_METRICS.md)와 `evaluation/` 스크립트에 정리했습니다.

## 프로젝트 구조

- `AI_Model/KcBert/`: KcBERT 분류 실험
- `AI_Model/beomi_KcELECTRA-base/`: KcELECTRA 비교 실험
- `AI_Model/LSTM/`: 대체 문장 생성 및 BLEU 실험
- `AI_Model/RNN/`: RNN 생성 실험
- `backend/`: Django REST Framework 기반 SNS API
- `evaluation/`: 분류·생성 모델 재평가 스크립트
- `docs/XFILTER_METRICS.md`: 지표 출처와 재검증 기준

## 담당 역할

- AI 구조 설계 및 비속어 데이터 전처리
- KcBERT·KcELECTRA·RandomForest·Logistic Regression 비교
- KcBERT 분류 모델 학습·평가 및 혼동행렬 기반 오류 분석
- RNN·Ko-GPT2·ET5 등 대체 문장 생성 모델 실험
- Django REST Framework 기반 게시글 API 구현
