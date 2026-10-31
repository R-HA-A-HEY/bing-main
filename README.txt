舒潔水啦：電腦版爆版緊急修復
請把 index.html、style.css、app.js 三個檔案放在 GitHub Pages 目前使用的資料夾根目錄（網址 /bing/ 通常對應 bing 儲存庫根目錄），並保留 sujie 圖片資料夾。
這次在 HTML 加入保底版型及 CSS 快取版本碼，避免舊 CSS 或 CSS 失效時圖片無限放大。
請確認 GitHub Pages 的 Source 為 main / (root)，並等部署完成後使用 Ctrl+Shift+R 強制重整。
若仍爆版，請用瀏覽器 F12 > Network 確認 style.css 是否為 200 而非 404。
