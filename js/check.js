var paragraphs = document.querySelectorAll('.status');

paragraphs.forEach(async (paragraph) => {
    // 获取每个段落的 data-uuid 属性
    const server = paragraph.getAttribute('data-uuid');
    // 获取服务器状态
    const status = await fetchServerStatus(server);    
    // 如果服务器状态正常，显示在线状态
    if (status && status.online) {
        paragraph.innerHTML = `
        <span class="online">当前状态: 在线</span> <br>
        <span class="players">玩家数: ${status.players.online} </span> <br>
        <div>${status.motd.clean}</div> <br>`;
    } else if (status && status.error) {
        // 如果发生错误，显示错误信息
        paragraph.innerHTML = `<span class="error">错误: ${status.error}</span>`;
    } else {
        // 否则显示离线状态
        paragraph.innerHTML = `<span class="offline">离线</span>`;
    }


});


async function fetchServerStatus(server) {
    try {
        // 调用 mcstatus.io 的 API
        const response = await fetch(`https://api.mcstatus.io/v2/status/java/${server}`);
        const data = await response.json();

        return data;
    } catch (error) {
        return { error: error.message, status: 500 };
    }
}