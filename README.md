# 圓山秘宴 · 單頁電子喜帖

海派復古解謎喜帖（圓山大飯店主題）＋ Google Sheets RSVP。

## 本機預覽

用瀏覽器直接開啟 `index.html`，或在專案根目錄執行：

```bash
python3 -m http.server 8080
```

然後前往 `http://localhost:8080`。

## 關卡流程

1. **大門**：把金屬鑰匙拖到鎖孔（支援滑鼠與觸控）。
2. **客房**：日曆翻到 2027/02/21，保險箱輸入 `0221` 或 `20270221`。
3. **喜帖與表單**：條件欄位會依出席與否展開／隱藏。

右上角可隨時「跳過解謎，直接看喜帖」。

## 串接 Google 試算表

1. 把 `google-apps-script/Code.gs` 部署成網頁應用程式（任何人可存取）。
2. 將部署網址貼到 `js/app.js`：

```js
const GAS_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL";
```

尚未填入網址時，送出表單仍會進入 VIP 通關卡，方便本機預覽。

## 自訂

- 新人姓名：新郎 張堙森 · 新娘 羅珮婷
- 合照：放入 `images/photo1.jpg`、`photo2.jpg`、`photo3.jpg`
