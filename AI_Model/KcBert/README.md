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

## 취업 문서 기준 기록

- Accuracy: 0.96
- Precision: 0.97
- Recall: 0.95
- F1: 0.96

현재 노트북에는 최종 숫자 결과가 텍스트로 저장되지 않고 혼동행렬 이미지 중심으로 남아 있습니다. 동일 평가셋을 이용한 재검증은 저장소의 `evaluation/evaluate_classifier.py`를 사용합니다.
