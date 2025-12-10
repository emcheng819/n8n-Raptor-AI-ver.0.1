// 【重要】請替換成您的 n8n Webhook 公開 URL
const WEBHOOK_URL = 'https://accusys1.app.n8n.cloud/webhook/e557fe7f-4b69-47f5-84b1-3166466e42ba/chat'; 

document.getElementById('trigger-button').addEventListener('click', async () => {
    // 1. 取得用戶輸入的資料
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const messageElement = document.getElementById('message');

    // 檢查基本輸入（可選，但推薦）
    if (!name || !email) {
        messageElement.textContent = '❌ 姓名和電子郵件欄位不能為空！';
        messageElement.style.color = '#F44336';
        return; 
    }

    // 2. 準備要發送的資料 (JSON 格式)
    const dataToSend = {
        userName: name,
        userEmail: email,
        timestamp: new Date().toISOString(), // 額外加入時間戳
        source: 'Frontend Button Click'
    };

    messageElement.textContent = '正在發送資料...請稍候...';
    messageElement.style.color = '#FFA500'; // 橘色：處理中

    try {
        // 3. 使用 fetch API 發送 POST 請求
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST', // 定義為 POST 請求
            headers: {
                // 告知伺服器我們發送的資料是 JSON 格式
                'Content-Type': 'application/json' 
            },
            // 將 JavaScript 物件轉換為 JSON 字串
            body: JSON.stringify(dataToSend) 
        });

        // 4. 檢查回應狀態
        if (response.ok) {
            // 請求成功 (HTTP 狀態碼 200-299)
            messageElement.textContent = `✅ 資料發送成功！n8n 流程已啟動。`;
            messageElement.style.color = '#4CAF50'; // 綠色：成功
        } else {
            // 請求失敗 (例如 404, 500 錯誤)
            messageElement.textContent = `❌ 資料發送失敗！狀態碼: ${response.status}。請檢查 Webhook URL 或 n8n 狀態。`;
            messageElement.style.color = '#F44336'; // 紅色：失敗
            console.error('Webhook 請求失敗:', response.statusText);
        }

    } catch (error) {
        // 5. 處理網路錯誤 (例如連線中斷)
        messageElement.textContent = `⚠️ 發生網路錯誤：無法連線到伺服器。`;
        messageElement.style.color = '#F44336'; // 紅色：錯誤
        console.error('Fetch 發生錯誤:', error);
    }
});
