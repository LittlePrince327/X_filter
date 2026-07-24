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

### 분류 모델 비교

| 모델 | Accuracy | Precision | Recall | F1 |
|---|---:|---:|---:|---:|
| Logistic Regression | 0.90 | 0.92 | 0.87 | 0.87 |
| RandomForest | 0.87 | 0.88 | 0.85 | 0.86 |
| KcELECTRA | 0.85 | 0.87 | 0.89 | 0.88 |
| **KcBERT** | **0.96** | **0.97** | **0.95** | **0.96** |

KcBERT가 Accuracy와 F1에서 비교 모델 중 가장 높은 성능을 기록해 최종 분류 모델로 선정됐습니다. 혼동행렬을 활용해 예측 오류 유형을 함께 확인했습니다.

### 대체 문장 생성

- RNN·LSTM 기반 대체문 생성 결과: **BLEU 73**

위 비교표와 BLEU 수치는 기존 이력서·포트폴리오 등 프로젝트 결과 기록을 기준으로 통일했습니다. 저장소에는 KcELECTRA·KcBERT를 포함한 중간 실험 노트북이 함께 있으며, 실험 조건에 따라 중간 출력값이 다를 수 있습니다. 동일 평가셋을 이용한 재평가 방법은 [`docs/XFILTER_METRICS.md`](docs/XFILTER_METRICS.md)와 `evaluation/` 스크립트에 정리했습니다.

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
