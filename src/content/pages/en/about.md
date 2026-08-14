---
title: About
description: Cheng-Han Lin — full-stack developer working on RAG, self-hosted model inference and machine-learning forecasting, and the backend, mobile and payment infrastructure that carries them.
---

I'm Cheng-Han Lin, a full-stack developer based in Taichung, Taiwan.

I graduated with a B.S. in Computer Science and Information Engineering from
National Chin-Yi University of Technology in June 2026, and started the M.S.
programme at the same university that September.

## What I work on

My work keeps returning to one problem: **how do you turn a large language model
into something people can trust?**

The model itself is the easy part to obtain. The hard part is everything around
it — making sure it cannot invent an answer, keeping sensitive data inside a
controlled environment, producing a useful forecast from only a few hundred rows
per user, and deciding how the system should behave when it is wrong.

Concretely, I have built:

- **Retrieval-augmented generation** — vector retrieval over BGE-M3 embeddings in
  ChromaDB, where the model is required to cite the passage it drew from rather
  than answer freely.
- **Self-hosted inference** — open-weight models running on my own GPU service
  behind FastAPI, so highly sensitive text never leaves an environment I control.
- **Machine-learning forecasting** — feature engineering, model selection and
  cross-validation, traded off against interpretability, inference cost and
  overfitting risk.
- **Backend and infrastructure** — Django REST Framework, PostgreSQL, Cloud Run,
  Cloudflare, and mobile packaging.
- **Billing and compliance** — a complete subscription billing flow including
  statutory e-invoicing (ECPay, Taiwan's e-invoice system).

## What I care about

I care less about which technology was used than about **why it was chosen.**

Every decision costs something. Choosing Random Forest gives up whatever temporal
structure a sequence model might have found. Tuning for recall means accepting
more false alarms. Self-hosting a model means owning its operations. The
difference between engineers shows up mostly in whether they can articulate
those trade-offs.

The HeartBox case study on this site is written to that standard.

## Contact

- Email: [alan930604@gmail.com](mailto:alan930604@gmail.com)
- GitHub: [alanlin0604](https://github.com/alanlin0604)
- LinkedIn: [chenghanlin-tw](https://www.linkedin.com/in/chenghanlin-tw/)
