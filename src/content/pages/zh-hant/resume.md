---
title: 履歷
description: 林承翰的履歷。專長為檢索增強生成（RAG）、自架模型推論與機器學習預測，以及支撐它們的後端、行動端與金流基礎建設。三個獨立開發的產品。
---

獨立開發過三個上線的產品。專長是把大型語言模型變成可信賴的東西：以檢索增強生成（RAG）確保輸出可追溯、以自架推論守住敏感資料、以機器學習補足模型不擅長的預測任務，並獨力完成其後的後端、行動端與金流基礎建設。

在意評估方法、隱私設計，以及大多數人略過的失敗情境。

## 學歷

### 國立勤益科技大學　資訊工程系　碩士班

2026 年 9 月起就讀　・　台中

### 國立勤益科技大學　資訊工程系　學士

2022 年 9 月 – 2026 年 6 月　・　台中

畢業專題：HeartBox（見下）

## 專案

### HeartBox　—　AI 心情日記平台（RAG + 情緒預測）

獨立開發　・　畢業專題　・　[heartbox.tw](https://heartbox.tw)　・　[原始碼](https://github.com/alanlin0604/HeartBox)

從機器學習、後端、前端、行動端到基礎設施一人完成的心理健康平台。**線上展示：heartbox.tw，以 test1 / test1 登入，無需註冊**。既有資料與圖表皆正常；AI 即時生成需自架推論服務，目前未對外開啟，可來信安排實際操作。

- **RAG 管線**

  以 BGE-M3 embeddings 在 ChromaDB 建立向量索引，知識庫收錄 WHO、APA、NHS、NIMH 等 7 份臨床文件。情緒分數低於 −0.4 時觸發檢索，取回最相關的 top-3 段落並要求模型引用來源，使建議可追溯而非模型自由發揮。

- **Random Forest 情緒預測**

  53 個特徵（12 項指標 × 4 個時間窗口 + 5 個 calendar 特徵）。5-fold 交叉驗證：情緒 MAE 0.22、壓力 MAE 1.04（22,796 列）；高壓日 AUC 0.948、recall 88%（31,720 列）——刻意偏向 recall，因為漏掉低潮的代價高於誤報。

- **模型選型**

  在線性迴歸、決策樹、Random Forest、XGBoost 與 LSTM 之間，依資料量、可解釋性、推論成本與過擬合風險比較後選定：幾百筆即可訓練、純 CPU 50ms 內推論、可用特徵重要度解釋。

- **自架模型推論**

  開放權重的 Qwen2.5-7B-Instruct 架在自有 GPU，以 FastAPI 對外、經 Cloudflare Tunnel 連回後端，使日記內容不離開可控環境。

- **隱私與安全**

  日記以 Fernet 加密（AES-128-CBC + HMAC-SHA256），金鑰與資料庫分離；兩步驟驗證。依 GDPR Art. 7 設計三階段分離式同意，AI 訓練同意可獨立拒絕且不影響任何功能，13–17 歲需家長驗證；三處危機字眼偵測會即時顯示求助專線。

其他：PHQ-9 / GAD-7 量表、情緒趨勢與關聯視覺化、睡眠與習慣分析、103 項成就系統，並以 Capacitor 打包 Android App。

### LapseWatch　—　訂閱到期提醒服務

獨立開發　・　2026 年 6 月起　・　[lapsewatch.smallworks.app](https://lapsewatch.smallworks.app)

- 在自動續訂**之前**透過 LINE、Email 與桌面通知提醒，支援 Google Calendar 同步與 CSV / JSON 匯出。
- Chrome 擴充功能自動偵測訂閱資訊，**僅讀取關鍵字前後的一小段文字**以最小化蒐集範圍。
- 串接訂閱制定期定額扣款與法定電子發票開立（ECPay，台灣的電子發票系統）。
- 隱私優先：不串接銀行帳戶、不做跨站追蹤。

### PantryKeeper　—　家庭共用庫存與效期追蹤

獨立開發　・　2026 年 6 月起　・　[pantrykeeper.net](https://pantrykeeper.net)

- 多人共用的庫存與效期追蹤，具成員權限控制、離線支援與浪費統計。
- 批次匯入解析器接受從 Notion、Excel、Google Sheets 貼上的自由格式內容，並從中推斷品項的數量與單位。

## 技術能力

| 領域         | 內容                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| 程式語言     | Python、JavaScript、TypeScript、SQL、HTML、CSS                                                                   |
| AI／機器學習 | RAG、LangChain、ChromaDB、BGE-M3、自架 LLM 推論、scikit-learn、Random Forest、特徵工程、交叉驗證、模型評估與選型 |
| 後端         | Django、Django REST Framework、Django Channels、FastAPI、Node.js、REST API 設計、PostgreSQL                      |
| 前端         | React、Vite、Tailwind CSS、Recharts、Chrome 擴充功能                                                             |
| 基礎設施     | Google Cloud Run、Cloudflare Pages 與 Tunnel、Capacitor、Git、CI/CD                                              |
| 資訊安全     | Fernet／AES 加密、JWT、兩步驟驗證、速率限制、GDPR 與個資法同意流程設計                                           |
| 系統串接     | ECPay 金流與電子發票、LINE Messaging API、Google Calendar API                                                    |
| 語言         | 中文（母語）、英文（可閱讀專業文件與撰寫）                                                                       |

## 聯絡

[alan930604@gmail.com](mailto:alan930604@gmail.com)　・　[github.com/alanlin0604](https://github.com/alanlin0604)　・　[linkedin.com/in/chenghanlin-tw](https://www.linkedin.com/in/chenghanlin-tw/)
