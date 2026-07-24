# KcBERT 분류 실험 안내

이 폴더의 `beomi_KcBert.ipynb`는 실제 코드에서 `beomi/kcbert-base` 체크포인트를 불러오는 KcBERT 비속어 분류 실험입니다.

노트북 상단 Markdown과 일부 주석에 `KcELECTRA`라는 표현이 남아 있지만, 실제 모델 설정은 다음과 같습니다.

```python
Kc_model = "beomi/kcbert-base"
```

## 데이터 조건

- 원본 문장: 214,189건
- 8:2 분리, `random_state=42`
- 중복 제거 후 학습 데이터: 167,709건
- 중복 제거 후 평가 데이터: 42,587건

## 기존 프로젝트 결과 기록 기준

| 모델 | Accuracy | Precision | Recall | F1 |
|---|---:|---:|---:|---:|
| Logistic Regression | 0.90 | 0.92 | 0.87 | 0.87 |
| RandomForest | 0.87 | 0.88 | 0.85 | 0.86 |
| KcELECTRA | 0.85 | 0.87 | 0.89 | 0.88 |
| **KcBERT** | **0.96** | **0.97** | **0.95** | **0.96** |

KcBERT가 Accuracy와 F1에서 비교 모델 중 가장 높은 성능을 기록해 최종 분류 모델로 선정됐습니다. 노트북에는 혼동행렬을 이용한 오류 확인 과정이 포함돼 있습니다.

현재 노트북에는 최종 숫자 결과가 텍스트로 저장되지 않고 혼동행렬 이미지 중심으로 남아 있습니다. 동일 평가셋을 이용한 재검증은 저장소의 `evaluation/evaluate_classifier.py`를 사용합니다.
