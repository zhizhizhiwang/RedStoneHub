const paragraphs = document.querySelectorAll('.status');

paragraphs.forEach((paragraph) => {
    // 获取每个段落的 data-uuid 属性
    const uuid = paragraph.getAttribute('data-uuid');

    // 构建请求的 URL，发送 GET 请求
    const url = `https://uapis.cn/api/mcserver?server=${uuid}`;
    // 使用 fetch 向服务器发起 GET 请求（fetch 默认是 GET）

    function fetchData() {
        fetch(url)
            .then((response) => {
                // 检查请求是否成功
                if (!response.ok) {
                    throw new Error('请求失败');
                }
                return response.json();
            })
            .then((data) => {
                // 获取 data 对象中的 status 值
                const code = data.code;
                // 根据 data.status 值更新对应段落的文本内容
                if (code === 200) {
                    paragraph.textContent = "实例正在运行中...";
                } else {
                    retryCount++;
                    if (retryCount <= maxRetryCount) {
                        console.log(`重试第 ${retryCount} 次`);
                        fetchData();
                    } else {
                        paragraph.textContent = `请求失败，请稍后再试。error:${data.code} data:${data.username}`;
                    }
                }
            })
            .catch((error) => {
                if (error.message.includes('Mixed Content')) {
                    console.error('错误：HTTPS 强制导致的错误');
                } else {
                    retryCount++;
                    if (retryCount <= maxRetryCount) {
                        console.log(`重试第 ${retryCount} 次`);
                        fetchData();
                    } else {
                        console.error('错误：', error);
                        paragraph.textContent = `请求失败，请稍后再试。error:${error.message}`;
                    }
                }
            });
    }

    fetchData();
});
