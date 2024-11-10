const paragraphs = document.querySelectorAll('.status');


paragraphs.forEach((paragraph) => {
    // 获取每个段落的 data-uuid 属性
    const uuid = paragraph.getAttribute('data-uuid');

    // 构建请求的 URL，发送 GET 请求
    const url = `http://cz.zhizhiwang.us.kg:23244/?uuid=${uuid}`;

    // 使用 fetch 向服务器发起 GET 请求（fetch 默认是 GET）

    fetch(url)
        .then((response) => {
            // 检查请求是否成功
            if (!response.ok) {
                throw new Error('请求失败');
            }
            return response.json();
        })
        .then((data) => {
            console.log('从服务器获取的数据:', data);

            // 获取 data 对象中的 status 值
            const status = data.data.status; // data.data 是返回的数据中的关键部分
            paragraph.textContent = status;
            // 根据 data.status 值更新对应段落的文本内容
            
            if (status === 3) {
                paragraph.textContent = "实例正在运行中...";  // 假设 status 为 3 时，表示实例正在运行
            } else if (status === 4) {
                paragraph.textContent = "实例已停止。";  // 假设 status 为 4 时，表示实例已停止
            } else if (status === 5) {
                paragraph.textContent = "实例状态未知。";  // 假设 status 为 5 时，表示状态未知
            } else {
                paragraph.textContent = "未知状态：" + status;  // 如果 status 不是预期中的值
            }
        })
        .catch((error) => {
            console.error('错误:', error);
            paragraph.textContent = `请求失败，请稍后再试。${error.message}`;
        });
});