---
title: Résumé
description: Cheng-Han Lin — full-stack developer working on retrieval-augmented generation, self-hosted model inference and machine-learning forecasting, plus the backend, mobile and payment infrastructure around them.
---

Computer science graduate and full-stack developer with hands-on experience
building production LLM systems — retrieval-augmented generation, self-hosted
model inference and machine-learning forecasting — alongside the web, mobile and
payment infrastructure around them. I ship complete products solo and care about
evaluation, privacy and the failure cases most people skip.

## Projects

### HeartBox — AI mood-journalling platform (RAG + emotion forecasting)

Solo developer　・　Capstone project　・　[heartbox.tw](https://heartbox.tw)　・　[github.com/alanlin0604/HeartBox](https://github.com/alanlin0604/HeartBox)

Designed, built and deployed a mental-health platform end to end, combining
retrieval-grounded LLM feedback with a machine-learning emotion forecast. Sole
developer across ML, backend, frontend, mobile and infrastructure.
**Live demo at heartbox.tw — sign in with test1 / test1, no registration
required.**

- **RAG pipeline** — BGE-M3 embeddings over a ChromaDB vector store built from
  seven clinical sources (WHO, APA, NHS, NIMH). Retrieval triggers when an
  entry's sentiment falls below −0.4 and returns the top-3 relevant passages,
  which the model must cite — so advice is traceable to a source rather than
  hallucinated.
- **Random Forest forecasting** — engineered 53 features (12 behavioural and
  physiological metrics × four lag windows, plus five calendar features) over
  22,796 training rows. 5-fold cross-validation: MAE 0.22 on sentiment (range
  −1 to +1), MAE 1.04 on the stress index (range 0–10), and AUC 0.948 with 88%
  recall on high-stress-day classification over 31,720 rows — deliberately
  tuned for recall, since a missed warning costs more than a false alarm.
- **Model selection** — evaluated linear regression, a single decision tree,
  Random Forest, XGBoost and an LSTM against data requirements,
  interpretability, inference cost and overfitting risk. Chose Random Forest for
  sub-50 ms CPU inference that trains on only a few hundred rows per user while
  staying interpretable through feature importance.
- **Self-hosted inference** — ran open-weight models behind a FastAPI GPU
  service exposed through a Cloudflare Tunnel: LLaVA-v1.6-Mistral-7B for vision,
  and TAIDE-LX-7B, an open-weight model tuned for Traditional Chinese. Journal
  text stays inside a controlled environment instead of going to a third-party
  API.
- **Privacy and safety** — journal contents encrypted with Fernet
  (AES-128-CBC + HMAC-SHA256) using environment-injected keys, plus 2FA.
  Three-step separated consent modelled on GDPR Art. 7 and Taiwan's PDPA, with
  AI-training consent independently refusable and parental confirmation required
  for users aged 13–17. Crisis-keyword detection across journals, AI chat and
  the anonymous community surfaces national helplines immediately.
- Also delivered: PHQ-9 / GAD-7 assessments, mood trend and correlation
  visualisations, sleep and habit analytics, a 103-achievement system, and an
  Android build via Capacitor.

### LapseWatch — subscription renewal reminder service

Solo developer　・　Jun 2026 – present　・　[lapsewatch.smallworks.app](https://lapsewatch.smallworks.app)

- Built a service that notifies users **before** subscriptions auto-renew,
  through LINE, email and desktop notifications, with Google Calendar sync and
  CSV / JSON export.
- Developed a Chrome extension that detects subscriptions automatically, reading
  only a narrow window of text around matched keywords to minimise data
  collection.
- Integrated recurring subscription billing with statutory e-invoicing (ECPay,
  Taiwan's e-invoice system); designed privacy-first, with no bank account
  linking and no cross-site tracking.

### PantryKeeper — shared household inventory tracker

Solo developer　・　Jun 2026 – present　・　[pantrykeeper.net](https://pantrykeeper.net)

- Built a multi-user inventory and expiry tracker with per-member permission
  controls, offline support and waste statistics.
- Wrote a bulk import parser that accepts pasted data from Notion, Excel and
  Google Sheets, inferring quantity and unit from free-form text.

## Skills

| Area | Detail |
|---|---|
| Languages | Python, JavaScript, TypeScript, SQL, HTML, CSS |
| AI / ML | Retrieval-augmented generation, LangChain, ChromaDB, embedding models (BGE-M3), self-hosted LLM inference, scikit-learn, Random Forest, feature engineering, cross-validation, model evaluation and selection |
| Backend | Django, Django REST Framework, Django Channels (WebSocket), FastAPI, Node.js, REST API design, PostgreSQL |
| Frontend | React, Vite, Tailwind CSS, Recharts, Chrome extension development |
| Infrastructure | Google Cloud Run, Cloudflare Pages and Tunnel, Capacitor (Android), Git, CI/CD |
| Security | Fernet / AES encryption, JWT, 2FA, rate limiting, GDPR and Taiwan PDPA consent design |
| Integrations | Payment gateway and statutory e-invoicing (ECPay, Taiwan), LINE Messaging API, Google Calendar API |

## Education

**National Chin-Yi University of Technology** — Taichung, Taiwan
M.S. in Computer Science and Information Engineering　・　from September 2026

**National Chin-Yi University of Technology** — Taichung, Taiwan
B.S. in Computer Science and Information Engineering　・　graduated June 2026

Capstone project: HeartBox (above)　・　Student Association, Administration Division

## Languages

Mandarin Chinese (native)　・　English (professional reading and writing)

## Contact

[alan930604@gmail.com](mailto:alan930604@gmail.com)　・　[github.com/alanlin0604](https://github.com/alanlin0604)　・　[linkedin.com/in/chenghanlin-tw](https://www.linkedin.com/in/chenghanlin-tw/)
