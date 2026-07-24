# X-filter 모델 지표 정리

## 공개 자료의 통일 기준

현재 이력서·경력기술서·포트폴리오·Notion에서 사용하는 기준은 다음과 같습니다.

| 구분 | 모델 | 기준 지표 |
|---|---|---:|
| 비속어 분류 | KcBERT | Accuracy 0.96 |
| 비속어 분류 | KcBERT | Precision 0.97 |
| 비속어 분류 | KcBERT | Recall 0.95 |
| 비속어 분류 | KcBERT | F1 0.96 |
| 대체 문장 생성 | RNN·LSTM | BLEU 73 |

이 값은 2026년 2월과 7월에 작성된 이력서·경력기술서에 반복 기록된 프로젝트 결과를 기준으로 정리한 값입니다. 현재 저장소에는 최종 수치를 텍스트로 저장한 단일 원시 평가 파일이 남아 있지 않으므로, 아래 재평가 절차를 통해 동일 평가 데이터 기준으로 다시 검증할 수 있습니다.

## 저장소에서 확인되는 데이터 조건

KcBERT 노트북에 남아 있는 조건은 다음과 같습니다.

- 원본 문장: 214,189건
- 학습/평가 분리: 8:2
- 분리 시드: `random_state=42`
- 중복 제거 후 학습 데이터: 167,709건
- 중복 제거 후 평가 데이터: 42,587건
- 모델 체크포인트: `beomi/kcbert-base`
- 평가 지표: Accuracy, Precision, Recall, F1, Confusion Matrix

노트북 상단 제목과 일부 주석에는 KcELECTRA라고 적혀 있지만, 실제 코드에서 불러오는 체크포인트는 `beomi/kcbert-base`입니다.

## 과거 자료에서 확인된 다른 기록

서로 다른 시점과 실험 조건의 자료에는 다음 기록도 존재합니다.

| 자료·실험 | 모델 | 기록 |
|---|---|---|
| 초기 포트폴리오 | KcELECTRA | Accuracy 93%, BLEU 73 |
| Drive 빅데이터분석정의서 | KcELECTRA | Accuracy 0.8529, Precision 0.7059, Recall 0.8276, F1 0.7619 |
| GitHub KcELECTRA 중간 실험 | KcELECTRA | Accuracy 0.4511, Precision 0.2034, Recall 0.4511, F1 0.2804 |

이 값들은 데이터 구성·배치 크기·모델 상태가 다른 중간 결과이므로 KcBERT 최종 결과와 합산하거나 같은 평가 결과로 해석하지 않습니다.

## 재평가 절차

1. 당시 사용한 `sentence_data(complete).xlsx`를 준비합니다.
2. `random_state=42`로 8:2 분리하고 각 데이터셋 내부 중복 문장을 제거합니다.
3. 저장된 KcBERT 모델 디렉터리 또는 Hugging Face 체크포인트를 지정합니다.
4. `evaluation/evaluate_classifier.py`를 실행합니다.
5. 다음 산출물을 보관합니다.
   - `metrics.json`
   - `classification_report.csv`
   - `predictions.csv`
   - `confusion_matrix.png`
6. 대체문 생성 결과와 기준 문장을 CSV로 준비한 뒤 `evaluation/evaluate_bleu.py`를 실행합니다.
7. 재평가 결과가 현재 문서 기록과 다르면 동일한 평가 실행에서 생성된 값을 기준으로 모든 공개 자료를 다시 갱신합니다.

## 표기 원칙

- KcBERT와 KcELECTRA 결과를 하나의 결과처럼 합치지 않습니다.
- 분류 지표와 생성 지표 BLEU를 구분합니다.
- Accuracy만으로 Precision·Recall·F1을 환산하지 않습니다.
- 재평가 전까지 공개 문서의 수치는 ‘기존 프로젝트 결과 기록 기준’으로 관리합니다.
