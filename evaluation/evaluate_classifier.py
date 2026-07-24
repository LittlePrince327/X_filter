"""Re-evaluate a saved text-classification model on a fixed dataset.

Example:
    python evaluation/evaluate_classifier.py \
        --dataset "AI_Model/dataset/sentence_data(complete).xlsx" \
        --model "Kc_BERT_model" \
        --text-column Sentence \
        --label-column label \
        --output-dir evaluation/results/kcbert
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import torch
from sklearn.metrics import (
    ConfusionMatrixDisplay,
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from torch.utils.data import DataLoader, Dataset
from transformers import AutoModelForSequenceClassification, AutoTokenizer


class TextDataset(Dataset):
    def __init__(
        self,
        texts: list[str],
        labels: list[int],
        tokenizer: Any,
        max_length: int,
    ) -> None:
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self) -> int:
        return len(self.texts)

    def __getitem__(self, index: int) -> dict[str, torch.Tensor]:
        encoded = self.tokenizer(
            self.texts[index],
            truncation=True,
            padding="max_length",
            max_length=self.max_length,
            return_tensors="pt",
        )
        item = {key: value.squeeze(0) for key, value in encoded.items()}
        item["labels"] = torch.tensor(self.labels[index], dtype=torch.long)
        return item


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dataset", required=True, help="CSV or XLSX dataset path")
    parser.add_argument("--model", required=True, help="Saved model directory or HF model ID")
    parser.add_argument("--text-column", default="Sentence")
    parser.add_argument("--label-column", default="label")
    parser.add_argument("--output-dir", default="evaluation/results/classifier")
    parser.add_argument("--batch-size", type=int, default=64)
    parser.add_argument("--max-length", type=int, default=64)
    parser.add_argument("--test-size", type=float, default=0.2)
    parser.add_argument("--random-state", type=int, default=42)
    parser.add_argument(
        "--use-full-dataset",
        action="store_true",
        help="Evaluate all rows instead of recreating the historical 8:2 split",
    )
    return parser.parse_args()


def load_dataframe(path: Path) -> pd.DataFrame:
    if not path.exists():
        raise FileNotFoundError(f"Dataset not found: {path}")
    suffix = path.suffix.lower()
    if suffix == ".csv":
        return pd.read_csv(path)
    if suffix in {".xlsx", ".xls"}:
        return pd.read_excel(path)
    raise ValueError(f"Unsupported dataset format: {suffix}")


def prepare_evaluation_data(df: pd.DataFrame, args: argparse.Namespace) -> pd.DataFrame:
    required = {args.text_column, args.label_column}
    missing = required.difference(df.columns)
    if missing:
        raise KeyError(f"Missing columns: {sorted(missing)}")

    work = df[[args.text_column, args.label_column]].copy()
    work = work.dropna(subset=[args.text_column, args.label_column])
    work[args.text_column] = work[args.text_column].astype(str)
    work[args.label_column] = pd.to_numeric(work[args.label_column], errors="raise").astype(int)

    if args.use_full_dataset:
        evaluation = work
    else:
        _, evaluation = train_test_split(
            work,
            test_size=args.test_size,
            random_state=args.random_state,
            shuffle=True,
        )

    evaluation = evaluation.drop_duplicates(subset=[args.text_column]).reset_index(drop=True)
    if evaluation.empty:
        raise ValueError("No evaluation rows remain after cleaning")
    return evaluation


def predict(
    model: AutoModelForSequenceClassification,
    loader: DataLoader,
    device: torch.device,
) -> tuple[list[int], list[int], list[float]]:
    true_labels: list[int] = []
    predictions: list[int] = []
    positive_scores: list[float] = []

    model.eval()
    with torch.inference_mode():
        for batch in loader:
            labels = batch.pop("labels")
            inputs = {key: value.to(device) for key, value in batch.items()}
            logits = model(**inputs).logits
            probs = torch.softmax(logits, dim=-1)
            preds = torch.argmax(probs, dim=-1)

            true_labels.extend(labels.cpu().tolist())
            predictions.extend(preds.cpu().tolist())
            if probs.shape[1] >= 2:
                positive_scores.extend(probs[:, 1].cpu().tolist())
            else:
                positive_scores.extend([float("nan")] * len(preds))

    return true_labels, predictions, positive_scores


def main() -> None:
    args = parse_args()
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    source_df = load_dataframe(Path(args.dataset))
    eval_df = prepare_evaluation_data(source_df, args)

    tokenizer = AutoTokenizer.from_pretrained(args.model)
    model = AutoModelForSequenceClassification.from_pretrained(args.model)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)

    dataset = TextDataset(
        texts=eval_df[args.text_column].tolist(),
        labels=eval_df[args.label_column].tolist(),
        tokenizer=tokenizer,
        max_length=args.max_length,
    )
    loader = DataLoader(dataset, batch_size=args.batch_size, shuffle=False)
    y_true, y_pred, positive_scores = predict(model, loader, device)

    metrics = {
        "model": args.model,
        "dataset": str(Path(args.dataset)),
        "evaluation_rows": len(eval_df),
        "accuracy": accuracy_score(y_true, y_pred),
        "precision_binary": precision_score(y_true, y_pred, average="binary", zero_division=0),
        "recall_binary": recall_score(y_true, y_pred, average="binary", zero_division=0),
        "f1_binary": f1_score(y_true, y_pred, average="binary", zero_division=0),
        "precision_weighted": precision_score(y_true, y_pred, average="weighted", zero_division=0),
        "recall_weighted": recall_score(y_true, y_pred, average="weighted", zero_division=0),
        "f1_weighted": f1_score(y_true, y_pred, average="weighted", zero_division=0),
        "test_size": None if args.use_full_dataset else args.test_size,
        "random_state": None if args.use_full_dataset else args.random_state,
        "device": str(device),
    }
    (output_dir / "metrics.json").write_text(
        json.dumps(metrics, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    report = classification_report(y_true, y_pred, output_dict=True, zero_division=0)
    pd.DataFrame(report).transpose().to_csv(
        output_dir / "classification_report.csv", encoding="utf-8-sig"
    )

    predictions_df = eval_df.copy()
    predictions_df["prediction"] = y_pred
    predictions_df["positive_score"] = positive_scores
    predictions_df.to_csv(output_dir / "predictions.csv", index=False, encoding="utf-8-sig")

    matrix = confusion_matrix(y_true, y_pred)
    display = ConfusionMatrixDisplay(confusion_matrix=matrix)
    display.plot(values_format="d")
    plt.title("Confusion Matrix")
    plt.tight_layout()
    plt.savefig(output_dir / "confusion_matrix.png", dpi=180)
    plt.close()

    print(json.dumps(metrics, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
