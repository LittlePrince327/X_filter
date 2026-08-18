# X-filter 모델 지표 정리

## 현재 공개 기준

최신 검수에서는 저장된 KcBERT 평가 혼동행렬을 기준으로 분류 지표를 다시 계산합니다.

### KcBERT confusion matrix

| 구분 | 값 |
|---|---:|
| TN | 18,389 |
| FP | 820 |
| FN | 680 |
| TP | 22,698 |

Positive class는 **비속어(label 1)** 입니다.

### 재계산 결과

| Accuracy | Precision | Recall | F1 |
|---:|---:|---:|---:|
| **0.9648** | **0.9651** | **0.9709** | **0.9680** |

소수 둘째 자리로 표시할 때는 `Accuracy 0.96 · Precision 0.97 · Recall 0.97 · F1 0.97`로 표기합니다.

- 최종 분류 모델: **KcBERT**
- 모델 체크포인트: `beomi/kcbert-base`
- 평가 지표: Accuracy, Precision, Recall, F1, Confusion Matrix

## 저장소에서 확인되는 데이터 조건

KcBERT 노트북에 남아 있는 조건은 다음과 같습니다.

- 원본 문장: **214,189건**
- 학습/평가 분리: **8:2**
- 분리 시드: `random_state=42`
- 중복 제거 후 학습 데이터: **167,709건**
- 중복 제거 후 평가 데이터: **42,587건**
- 모델 체크포인트: `beomi/kcbert-base`

노트북 상단 제목과 일부 주석에는 KcELECTRA라고 적혀 있지만, 실제 코드에서 불러오는 체크포인트는 `beomi/kcbert-base`입니다.

## 과거 문서 기록과의 관계

이력서·이전 포트폴리오·Notion에는 한동안 다음 값이 반복 기록되어 있었습니다.

- Accuracy `0.96`
- Precision `0.97`
- Recall `0.95`
- F1 `0.96`
- RNN·LSTM 대체문 생성 BLEU `73`

이 값은 **과거 프로젝트 결과 기록**으로 보존하되, 분류 지표의 현재 공개 기준은 위 저장 혼동행렬 재계산값을 사용합니다.

BLEU `73`은 과거 프로젝트 기록에는 남아 있지만, 현재 저장소에 최종 원시 예측 문장·참조 문장·평가 로그가 한 세트로 보존되어 있지 않아 **검증 완료 대표 성과로 사용하지 않습니다.** 원시 자료를 확보하면 `evaluation/evaluate_bleu.py`로 다시 평가합니다.

## 과거 자료에서 확인된 다른 중간 기록

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
- 현재 분류 대표값은 저장 혼동행렬 재계산값을 사용합니다.
- BLEU 73은 재검증 전까지 과거 기록으로만 표기합니다.
