---
title: Résumé
description: Résumé of Cheng-Han Lin — retrieval-augmented generation, self-hosted model inference and machine-learning forecasting, with the backend, mobile and payment systems around them. Three products built solo.
---

Three shipped products, each built solo. My work is about making large language
models into something that can be trusted: retrieval-augmented generation so the
output is traceable, self-hosted inference so sensitive data stays put, and
machine learning for the forecasting an LLM is bad at — plus all the backend,
mobile and payment infrastructure underneath.

I care about evaluation method, privacy design, and the failure cases most
people skip.

## Projects

### HeartBox — AI mood-journalling platform (RAG + emotion forecasting)

Solo developer · Capstone · [heartbox.tw](https://heartbox.tw) · [source](https://github.com/alanlin0604/HeartBox)

A mental-health platform built end to end — ML, backend, frontend, mobile and
infrastructure. **Live at heartbox.tw, sign in with test1 / test1, no
registration.**

- **RAG pipeline**

  BGE-M3 embeddings over a ChromaDB store built from seven clinical sources (WHO, APA, NHS, NIMH). Retrieval fires when sentiment falls below −0.4, returns the top-3 passages, and the model must cite them — so advice is traceable rather than invented.
- **Random Forest forecasting**

  53 features (12 metrics × 4 lag windows, plus 5 calendar features). 5-fold CV: MAE 0.22 on sentiment and 1.04 on stress (22,796 rows); AUC 0.948 with 88% recall on high-stress days (31,720 rows), deliberately tuned for recall because a missed warning costs more than a false alarm.
- **Model selection**

  Compared linear regression, a decision tree, Random Forest, XGBoost and an LSTM on data requirements, interpretability, inference cost and overfitting risk. Random Forest was the only one that trains on a few hundred rows, predicts in under 50 ms on CPU, and explains itself.
- **Self-hosted inference**

  Open-weight LLaVA-v1.6-Mistral-7B for vision and TAIDE-LX-7B, tuned for Traditional Chinese, on my own GPU behind FastAPI and a Cloudflare Tunnel, so journal text never leaves a controlled environment.
- **Privacy and safety**

  Journals are Fernet-encrypted (AES-128-CBC + HMAC-SHA256) with keys held apart from the database, plus 2FA. Three-step separated consent per GDPR Art. 7, where refusing AI-training use costs no functionality, and parental verification for ages 13–17. Crisis-keyword detection surfaces national helplines.

Also delivered: PHQ-9 / GAD-7 assessments, mood trend and correlation
visualisations, sleep and habit analytics, a 103-achievement system, and an
Android build via Capacitor.

### LapseWatch — Subscription renewal reminders

Solo developer · Jun 2026 – present · [lapsewatch.smallworks.app](https://lapsewatch.smallworks.app)

- Notifies **before** a subscription auto-renews, over LINE, email and desktop,
  with Google Calendar sync and CSV / JSON export.
- A Chrome extension that detects subscriptions while reading **only a narrow
  window of text around a matched keyword**, to bound what it can see.
- Integrated recurring subscription billing and statutory e-invoicing (ECPay,
  Taiwan's e-invoice system).
- Privacy-first: no bank-account linking, no cross-site tracking.

### PantryKeeper — Shared household inventory tracker

Solo developer · Jun 2026 – present · [pantrykeeper.net](https://pantrykeeper.net)

- Multi-user inventory and expiry tracking with per-member permissions, offline
  support and waste statistics.
- A bulk import parser that accepts free-form data pasted from Notion, Excel or
  Google Sheets and infers quantity and unit from it.

## Skills

| Area | Detail |
|---|---|
| Languages | Python, JavaScript, TypeScript, SQL, HTML, CSS |
| AI / ML | RAG, LangChain, ChromaDB, BGE-M3, self-hosted LLM inference, scikit-learn, Random Forest, feature engineering, cross-validation, model evaluation and selection |
| Backend | Django, Django REST Framework, Django Channels, FastAPI, Node.js, REST API design, PostgreSQL |
| Frontend | React, Vite, Tailwind CSS, Recharts, Chrome extensions |
| Infrastructure | Google Cloud Run, Cloudflare Pages and Tunnel, Capacitor, Git, CI/CD |
| Security | Fernet / AES encryption, JWT, 2FA, rate limiting, GDPR and Taiwan PDPA consent design |
| Integrations | Payment gateway and statutory e-invoicing (ECPay, Taiwan), LINE Messaging API, Google Calendar API |
| Spoken | Mandarin Chinese (native), English (professional reading and writing) |

## Education

### National Chin-Yi University of Technology — M.S., Computer Science and Information Engineering

From September 2026 · Taichung, Taiwan

### National Chin-Yi University of Technology — B.S., Computer Science and Information Engineering

September 2022 – June 2026 · Taichung, Taiwan

Capstone project: HeartBox (above)

## Contact

[alan930604@gmail.com](mailto:alan930604@gmail.com) · [github.com/alanlin0604](https://github.com/alanlin0604) · [linkedin.com/in/chenghanlin-tw](https://www.linkedin.com/in/chenghanlin-tw/)
