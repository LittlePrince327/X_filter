# X-filter

SNS 게시글·캡션·채팅 문장에서 비속어를 탐지하고, 문맥을 유지한 대체 표현을 제안하는 팀 프로젝트입니다.

## 핵심 기능

1. SNS 특유의 줄임말·변형 표현·신조어 정규화
2. KcELECTRA·KcBERT·RandomForest·Logistic Regression 비교
3. KcBERT 기반 비속어 이진 분류
4. 탐지된 비속어 구간 추출
5. 사전 기반 치환 및 RNN·LSTM 기반 대체 문장 생성 실험
6. 생성 문장의 유해 표현 재확인

## 데이터

- 원본 문장: **214,189건**
- 학습/평가 분리: **8:2**, `random_state=42`
- 중복 제거 후 학습 데이터: **167,709건**
- 중복 제거 후 평가 데이터: **42,587건**

## KcBERT 분류 결과

저장된 KcBERT 평가 혼동행렬을 기준으로 다시 계산한 결과입니다.

| TN | FP | FN | TP |
|---:|---:|---:|---:|
| 18,389 | 820 | 680 | 22,698 |

Positive class: **비속어(label 1)**

| Accuracy | Precision | Recall | F1 |
|---:|---:|---:|---:|
| **0.9648** | **0.9651** | **0.9709** | **0.9680** |

소수 둘째 자리 기준으로는 **Accuracy 0.96 · Precision 0.97 · Recall 0.97 · F1 0.97**입니다.

> 이전 이력서·포트폴리오에는 `0.96 / 0.97 / 0.95 / 0.96`이 프로젝트 기록값으로 남아 있었습니다. 현재 공개 기준은 저장 혼동행렬 재계산값을 사용합니다. 상세 근거는 [`docs/XFILTER_METRICS.md`](docs/XFILTER_METRICS.md)에 정리했습니다.

## 대체 표현 생성

- 사전 기반 치환 로직 구현
- RNN·LSTM 기반 대체 문장 생성 실험
- 과거 프로젝트 문서에는 **BLEU 73**이 기록되어 있으나, 최종 원시 예측·참조 문장과 평가 로그를 한 세트로 확보한 뒤 재평가가 필요합니다.

## 프로젝트 구조

- `AI_Model/KcBert/`: KcBERT 분류 실험
- `AI_Model/beomi_KcELECTRA-base/`: KcELECTRA 비교 실험
- `AI_Model/LSTM/`: 대체 문장 생성 및 BLEU 실험
- `AI_Model/RNN/`: RNN 생성 실험
- `backend/`: Django REST Framework 기반 SNS API
- `evaluation/`: 분류·생성 모델 재평가 스크립트
- `docs/XFILTER_METRICS.md`: 지표 출처와 재검증 기준

## 담당 역할

- AI 구조 설계 및 비속어 데이터 전처리 공동 수행
- KcBERT·KcELECTRA·RandomForest·Logistic Regression 비교
- KcBERT 분류 모델 학습·평가 및 혼동행렬 기반 오류 분석
- RNN·Ko-GPT2·ET5 등 대체 문장 생성 모델 실험
- Django REST API 엔드포인트 골격 구현
