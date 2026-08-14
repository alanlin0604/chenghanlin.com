---
title: 履歷
description: 林承翰的履歷 —— 全端工程師，專長為檢索增強生成（RAG）、自架模型推論與機器學習預測，以及後端、行動端與金流基礎建設。
---

資訊工程碩士生、全端工程師。專長是把大型語言模型變成可信賴的產品：以檢索增強
生成（RAG）確保輸出可追溯、以自架推論守住敏感資料、以機器學習補足模型不擅長的
預測任務，並獨力完成其後的後端、行動端與金流基礎建設。

在意評估方法、隱私設計，以及大多數人略過的失敗情境。

## 學歷

**國立勤益科技大學**　資訊工程系　碩士班
2026 年 9 月 – 就讀中・台中

**國立勤益科技大學**　資訊工程系　學士
2022 年 9 月 – 2026 年 6 月・台中

畢業專題：HeartBox（見下）　・　系學會行政部

## 專案

### HeartBox —— AI 心情日記平台（RAG + 情緒預測）

獨立開發　・　畢業專題　・　[heartbox.tw](https://heartbox.tw)　・　[github.com/alanlin0604/HeartBox](https://github.com/alanlin0604/HeartBox)

從機器學習、後端、前端、行動端到基礎設施一人完成的心理健康平台，結合檢索增強
生成的 AI 回饋與機器學習的情緒預測。**線上展示：heartbox.tw，以 test1 / test1
登入，無需註冊。**

- **RAG 管線**　以 BGE-M3 embeddings 在 ChromaDB 建立向量索引，知識庫收錄
  WHO、APA、NHS、NIMH 等 7 份臨床文件。日記情緒分數低於 −0.4 時觸發檢索，取回
  最相關的 top-3 段落，並要求模型必須引用來源 —— 建議可追溯，而非模型自由
  發揮。
- **Random Forest 情緒預測**　設計 53 個特徵（12 項行為與生理指標 × 4 個時間
  窗口，共 48 個 lag 特徵，加 5 個 calendar 特徵），在 22,796 列資料上訓練。
  5-fold 交叉驗證：情緒分數 MAE 0.22（範圍 −1 ~ +1）、壓力指數 MAE 1.04
  （範圍 0 ~ 10）；高壓日分類 31,720 列，AUC 0.948、recall 88% —— 刻意偏向
  recall，因為漏掉低潮的代價高於誤報。
- **模型選型**　在線性迴歸、單一決策樹、Random Forest、XGBoost 與 LSTM 之間，
  依資料量需求、可解釋性、推論成本與過擬合風險逐項比較。選擇 Random Forest：
  每位使用者僅數百筆資料即可訓練、純 CPU 50ms 內完成推論、且能以特徵重要度
  解釋。
- **自架模型推論**　將開放權重模型 LLaVA-v1.6-Mistral-7B（視覺）與
  TAIDE-LX-7B（針對繁體中文調校）架在自有 GPU 上，以 FastAPI 對外、透過
  Cloudflare Tunnel 連回後端，使日記內容不離開可控環境。
- **隱私與安全**　日記內容以 Fernet 對稱加密（AES-128-CBC + HMAC-SHA256）
  儲存，金鑰由環境變數注入且與資料庫分離；支援兩步驟驗證。依 GDPR Art. 7 與
  個資法設計三階段分離式同意，AI 訓練同意可獨立拒絕且拒絕後仍能使用全部功能，
  13–17 歲另需家長驗證。日記、AI 聊天與匿名社群三處皆有危機字眼偵測，觸發時
  即時顯示求助專線。
- **其他**　PHQ-9 / GAD-7 標準化量表、情緒趨勢與關聯視覺化、睡眠與習慣分析、
  103 項成就系統，並以 Capacitor 打包 Android App。

### LapseWatch —— 訂閱到期提醒服務

獨立開發　・　2026 年 6 月 – 進行中　・　[lapsewatch.smallworks.app](https://lapsewatch.smallworks.app)

- 在自動續訂**之前**透過 LINE、Email 與桌面通知提醒使用者，支援 Google
  Calendar 同步與 CSV / JSON 匯出。
- 開發 Chrome 擴充功能自動偵測訂閱資訊，**僅讀取比對到關鍵字前後的一小段
  文字**，以最小化資料蒐集範圍。
- 串接完整的訂閱制計費流程，並在交易後開立法定電子發票（ECPay，台灣的電子
  發票系統）。
- 隱私優先設計：不串接銀行帳戶、不做跨站追蹤。

### PantryKeeper —— 家庭共用庫存與效期追蹤

獨立開發　・　2026 年 6 月 – 進行中　・　[pantrykeeper.net](https://pantrykeeper.net)

- 多人共用的庫存與效期追蹤，具備成員權限控制、離線支援與浪費統計。
- 撰寫批次匯入解析器，接受從 Notion、Excel、Google Sheets 貼上的自由格式
  內容，並從中推斷品項的數量與單位。

## 技術能力

| 領域 | 內容 |
|---|---|
| 程式語言 | Python、JavaScript、TypeScript、SQL、HTML、CSS |
| AI / 機器學習 | 檢索增強生成（RAG）、LangChain、ChromaDB、embedding 模型（BGE-M3）、自架 LLM 推論、scikit-learn、Random Forest、特徵工程、交叉驗證、模型評估與選型 |
| 後端 | Django、Django REST Framework、Django Channels（WebSocket）、FastAPI、Node.js、REST API 設計、PostgreSQL |
| 前端 | React、Vite、Tailwind CSS、Recharts、Chrome 擴充功能開發 |
| 基礎設施 | Google Cloud Run、Cloudflare Pages 與 Tunnel、Capacitor（Android）、Git、CI/CD |
| 資訊安全 | Fernet / AES 加密、JWT、兩步驟驗證、速率限制、GDPR 與個資法同意流程設計 |
| 系統串接 | ECPay 金流、電子發票 API、LINE Messaging API、Google Calendar API |

## 語言

中文（母語）　・　英文（可閱讀專業文件與撰寫）

## 聯絡

[alan930604@gmail.com](mailto:alan930604@gmail.com)　・　[github.com/alanlin0604](https://github.com/alanlin0604)　・　[linkedin.com/in/chenghanlin-tw](https://www.linkedin.com/in/chenghanlin-tw/)
