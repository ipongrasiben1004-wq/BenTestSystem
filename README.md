# 🏛️ 復興610 綜合門戶站 (Portal)
> 小說連載 · 生活日記 · 即時新聞公告 · 專屬管理發文後台

專為**復興610**量身打造的高質感全能網站。採用現代 Glassmorphism 玻璃擬態設計、全站深淺色主題切換、沉浸式小說閱讀器（可調字體/羊皮紙/護眼模式），並結合 **GitHub Pages** 免費靜態託管與 **Supabase** 雲端資料庫。

---

## ✨ 網站亮點功能

1. **📰 新聞公告站**：
   - 支援重要公告置頂、分類標籤（重要公告、活動快訊、榮譽榜）。
   - 即時關鍵字搜尋與彈窗全文閱讀。
   - 訪客即時按讚與瀏覽次數統計。
2. **📖 原創小說館 & 護眼閱讀器**：
   - 書庫瀏覽、小說目錄抽屜、連載/完結狀態。
   - **專屬閱讀器**：支援字體放大/縮小、4種閱讀配色（極致深色、羊皮紙、綠意護眼、純白明亮）、自動記錄最後閱讀章節。
3. **✍️ 生活日記時間軸**：
   - 時間軸視圖、今日心情徽章（😊開心、🌿平靜、💡靈感、😴疲憊、🔥熱血）、天氣圖示。
4. **📱 隨時隨地後台發文 (Admin CMS)**：
   - 密碼驗證登入（管理員專屬後台）。
   - 手機或電腦瀏覽器打開網頁即可直接發布新聞、日記、小說與章節。
   - 支援即時刪除與編輯管理。

---

## 🚀 部署到 GitHub Pages 教學 (完全免費)

### 步驟 1：在 GitHub 建立儲存庫
1. 登入你的 [GitHub](https://github.com/) 帳號。
2. 點擊右上角的 **「+」** -> **「New repository」**。
3. Repository name 填寫專案名稱（例如 `fuxing610` 或 `yourname.github.io`）。
4. 設為 **Public**，點擊 **Create repository**。

### 步驟 2：將檔案推送到 GitHub
在你的本機專案目錄（`e:\日記站`）開啟終端機或 VS Code 終端機，執行以下指令：

```bash
git init
git add .
git commit -m "feat: 復興610 綜合網站初始版本"
git branch -M main
git remote add origin https://github.com/你的GitHub帳號/你的倉庫名.git
git push -u origin main
```

### 步驟 3：開啟 GitHub Pages 免費發布
1. 在 GitHub 該倉庫頁面點擊上方的 **「Settings」**（設定）。
2. 在左側選單點擊 **「Pages」**。
3. 在 **「Build and deployment」** 下方的 Branch 選擇 **`main`** 分支，資料夾選擇 **`/(root)`**，點擊 **「Save」**。
4. 約 1~2 分鐘後重新整理頁面，頂部就會出現你的專屬免費網址（例如：`https://你的帳號.github.io/fuxing610/`）！

---

## 🗄️ 啟用 Supabase 雲端資料庫（可選）

> 本網站內建「**本地 Demo 儲存模式**」，即使尚未設定 Supabase，所有新增文章、閱讀小說與後台發文都能在瀏覽器正常運作！

若想啟用跨裝置雲端同步與多人共享：

1. 前往 [Supabase 官網](https://supabase.com/) 免費註冊並建立專案。
2. 點擊左側選單的 **「SQL Editor」**。
3. 開啟本專案的 `database/schema.sql` 檔案，複製全部內容貼上，點擊 **「Run」** 即可自動建立所有資料表與範例資料。
4. 點擊左下角 **「Project Settings」** -> **「API」**，複製 **Project URL** 與 **anon public Key**。
5. 打開你的網站，進入「⚙️ 管理後台」，在頂部的 Supabase 設定欄位貼上並點擊「儲存設定」，即完成雲端串接！

---

## 🌐 未來買網域後的自訂網域綁定 (Custom Domain)

當你購買了專屬網域（例如 `fuxing610.com`）：

1. **在網域託管商（如 Cloudflare, GoDaddy, Namecheap）設定 DNS**：
   - 新增一筆 `CNAME` 記錄：
     - **Name / 主機記錄**：`www` 或 `@`
     - **Value / 目標**：`你的GitHub帳號.github.io`
2. **在 GitHub Pages 設定**：
   - 進入 GitHub 倉庫的 **Settings** -> **Pages**。
   - 在 **Custom domain** 欄位輸入你的自訂網域（例如 `fuxing610.com`），點擊 **Save**。
   - 勾選 **Enforce HTTPS**（GitHub 會自動為你申請免費的 SSL 安全憑證）。

---

## 📂 專案目錄結構

```text
e:\日記站/
├── index.html              # 主頁面結構（門戶、新聞、小說、日記、後台、閱讀器）
├── css/
│   ├── variables.css       # 設計系統配色、字型與深淺主題變數
│   ├── base.css            # 全站共用樣式、玻璃擬態、導航與彈窗
│   ├── portal.css          # 首頁 Hero 與三大板塊卡片
│   ├── novel.css           # 小說書庫與沉浸式小說閱讀器樣式
│   ├── news.css            # 新聞公告專區樣式
│   ├── diary.css           # 日記時間軸與心情天氣樣式
│   └── admin.css           # 後台發文 CMS 與管理表格樣式
├── js/
│   ├── supabase-config.js  # Supabase 雲端連線設定管理
│   ├── data-store.js       # 統一資料存取層 (Supabase + LocalStorage 雙模式)
│   ├── reader.js           # 小說閱讀器控制 (字體調整/背景模式/進度記憶)
│   ├── admin.js            # 後台管理與發文認證邏輯
│   └── app.js              # SPA 路由分發與介面動態渲染
├── database/
│   └── schema.sql          # Supabase 一鍵建表與初始資料 SQL
└── README.md               # 專案說明與部署指南
```
