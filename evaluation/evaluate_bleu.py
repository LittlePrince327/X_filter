"""Calculate corpus BLEU for generated replacement sentences.

Input CSV must contain a reference sentence column and a generated sentence column.

Example:
    python evaluation/evaluate_bleu.py \
        --input evaluation/replacement_predictions.csv \
        --reference-column reference \
        --prediction-column prediction \
        --output evaluation/results/bleu.json
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import pandas as pd
from sacrebleu.metrics import BLEU


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True, help="CSV containing references and predictions")
    parser.add_argument("--reference-column", default="reference")
    parser.add_argument("--prediction-column", default="prediction")
    parser.add_argument("--output", default="evaluation/results/bleu.json")
    parser.add_argument(
        "--tokenize",
        default="none",
        choices=["none", "ko-mecab", "13a", "intl", "char"],
        help="SacreBLEU tokenization. Use 'none' for pre-tokenized Korean text or 'char' for character BLEU.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    input_path = Path(args.input)
    if not input_path.exists():
        raise FileNotFoundError(f"Input file not found: {input_path}")

    df = pd.read_csv(input_path)
    required = {args.reference_column, args.prediction_column}
    missing = required.difference(df.columns)
    if missing:
        raise KeyError(f"Missing columns: {sorted(missing)}")

    pairs = df[[args.reference_column, args.prediction_column]].dropna().copy()
    pairs[args.reference_column] = pairs[args.reference_column].astype(str)
    pairs[args.prediction_column] = pairs[args.prediction_column].astype(str)
    if pairs.empty:
        raise ValueError("No valid reference/prediction pairs")

    bleu = BLEU(tokenize=args.tokenize, effective_order=True)
    result = bleu.corpus_score(
        pairs[args.prediction_column].tolist(),
        [pairs[args.reference_column].tolist()],
    )

    payload = {
        "input": str(input_path),
        "rows": len(pairs),
        "reference_column": args.reference_column,
        "prediction_column": args.prediction_column,
        "tokenize": args.tokenize,
        "bleu": result.score,
        "precisions": list(result.precisions),
        "brevity_penalty": result.bp,
        "length_ratio": result.sys_len / result.ref_len if result.ref_len else None,
        "system_length": result.sys_len,
        "reference_length": result.ref_len,
    }

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(payload, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
