---
title: Why Random Forest beat XGBoost and an LSTM on my dataset
description: Forecasting mood from a behavioural time series points straight at an LSTM. With a few hundred rows per user, a 50 ms latency budget and users who ask why, it points somewhere else entirely.
pubDatetime: 2026-08-15T09:00:00+08:00
lang: en
tags:
  - machine-learning
  - model-selection
---

The task was to predict someone's mood and stress three days out from the last
fourteen days of their behaviour. Sequential data, temporal dependencies — the
obvious answer is an LSTM. I evaluated five candidates and shipped Random
Forest, and the reasoning is worth writing down because the obvious answer was
wrong for reasons that had nothing to do with accuracy.

## The constraints came first

Model selection is usually framed as an accuracy question. It rarely is. Four
properties of this problem eliminated most of the field before accuracy entered
the conversation.

**There are a few hundred rows per user, not tens of thousands.** People write
journal entries daily at best. A user with a year of diligent history has
somewhere around 300 usable rows. Neural sequence models are hungry, and on
data this thin they overfit rather than generalise — you get a model that has
memorised one person's spring.

**The prediction has to return while the entry is being saved.** The forecast
appears in the same interaction as writing the entry. That is a latency budget
measured in tens of milliseconds on commodity CPU, because there is no GPU in
the request path and there should not be one.

**The user will ask why.** When a system tells you your stress is likely to rise
in three days, "the model said so" is not an acceptable answer in a
mental-health product. Something has to be able to point at sleep, or step
count, or bedtime variance.

**One person operates it.** A model that needs periodic hyperparameter sweeps to
stay good is a model that will silently rot, because there is nobody whose job
that is.

## The five candidates

| | Data needed | Interpretability | Inference | Overfitting risk | Accuracy |
|---|---|---|---|---|---|
| Linear regression | Very little | High | Negligible | Underfits | Capped by linearity |
| Single decision tree | Very little | High | Negligible | High | Unstable |
| **Random Forest** | A few hundred rows | Feature importance | Sub-50 ms, CPU | Low | High, stable |
| XGBoost | Moderate | Feature importance | Low | Medium | Best once tuned |
| LSTM | Tens of thousands | Low | Needs a GPU | High on small data | High with data |

Linear regression and a single tree survive the constraints but not the problem:
the first assumes a linear relationship that mood and sleep do not have, and the
second is famously unstable — retrain on a slightly different window and the
top split changes.

The LSTM fails three constraints at once. It wants far more data than exists per
user, it wants a GPU in the request path, and it cannot explain itself. It would
likely win on a dataset ten times the size. That dataset does not exist here.

XGBoost is the interesting one, because it is the candidate that a benchmark
would probably pick. Tuned properly it usually edges out a random forest on
tabular data. But "tuned properly" is the whole sentence: it has real
hyperparameter sensitivity, and its advantage shows up when someone is
maintaining that tuning. Random Forest's headline property is that it is
approximately correct out of the box — bagging gives it resistance to
overfitting for free, and the defaults are close enough to optimal that the
difference did not justify the maintenance.

## What Random Forest actually bought

I trained 100 trees over **53 features**: twelve behavioural and physiological
metrics — mean sentiment, mean and peak stress, entry count, sleep duration and
quality, deep-sleep proportion, step count, active minutes, HRV, resting heart
rate, bedtime variance — each expanded across 1, 3, 7 and 14-day windows for 48
lag features, plus 5 calendar features such as day of week and journalling
streak.

Regression targets average across the trees; the high-stress-day classifier
takes a majority vote.

**5-fold cross-validation:**

- Sentiment MAE **0.22** on a −1 to +1 scale
- Stress index MAE **1.04** on a 0 to 10 scale, over 22,796 rows
- High-stress-day AUC **0.948** with **88%** recall, over 31,720 rows

Recall was pushed deliberately. The two errors are not symmetric: a false alarm
costs one unnecessary nudge, a missed one costs a low patch nobody caught. In
this domain that asymmetry is large enough to set the threshold on its own.

## What I got wrong

**The validation was random 5-fold, and it should have been temporal.**

Forty-eight of the fifty-three features are lag variables. A random split
therefore puts rows from the same stretch of time on both sides of the fold —
day 40's features overlap heavily with day 42's, and if one is in training while
the other is in validation, the model has effectively seen the answer. The
metrics above are probably optimistic because of it.

The honest evaluation for a forecasting problem is a temporal split: train on
earlier periods, predict later ones, never let the future leak backwards. I
would fix this first if I rebuilt it, and I would expect the numbers to come
down.

I am leaving the figures as measured rather than quietly restating them, because
a result with a known caveat is more useful than a result with a hidden one.

## The transferable part

The framing that made this decision easy was refusing to start with accuracy.
Accuracy is the last tiebreaker, not the first filter. Data volume, latency,
explainability and maintenance burden narrowed five candidates to one before any
model was trained — and the candidate that a leaderboard would have chosen was
eliminated by a constraint that no leaderboard measures.

The [full HeartBox case study](/en/projects/heartbox/) covers the rest of it,
including the retrieval-grounded feedback that sits alongside the forecast.
