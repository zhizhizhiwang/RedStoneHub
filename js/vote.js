const form = document.getElementById('demo-form');
let hash = null;
let vote = null;
let token = null;
window.token = null;
let version = -1;

// let domain = 'https://raw.zhizhiwang.top/zhizhizhiwang/carnival-pub/refs/heads/main/'
let domain = `https://raw.qbvisualnovel.top/zhizhizhiwang/carnival-pub/main/`

async function sha256(message) {
    // 将字符串转换为 ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    // 使用 Web Crypto API
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // 将 ArrayBuffer 转换为十六进制字符串
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 投票系统逻辑
let voteEndTime = localStorage.getItem('voteEndTime') || (Date.now() + 300000);
let votes = JSON.parse(localStorage.getItem('votes')) || { A: 0, B: 0, C: 0 };
let Voted = localStorage.getItem('Voted');

if (Voted === null) {
    Voted = 'null';
    localStorage.setItem('Voted', 'null');
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("页面初始化开始");
    fetch(`${domain}now-version?token=password`)
        .then(response => response.text())
        .then(data => data.split(':'))
        .then(data => {
            console.log("now version: " + data[0]);
            version = data[0];
            update_item(data[0]);

            if (data[1] === 'result') {
                window.mode = 'show'; //只展示结果
                showResults();
            } else if (data[1] === 'both') {
                window.mode = 'both'; //都展示
                showResults();
            } else {
                window.mode = 'vote'; //只展示选项
            }
        })

    setInterval(upgrade, 1 * 60 * 1000);
});

async function upgrade() {
    fetch(`${domain}now-version?d=${Date.now()}`, {
        headers: {
            'Cache-Control': 'no-cache, max-age=0',
            'Pragma': 'no-cache'
        }})
        .then(response => response.text())
        .then(data => data.split(':'))
        .then(data => {
            console.log("web version: " + data[0]);
            if (Cookies === undefined) {
                console.error("jscookie未加载!");
                version = data[0];
                update_item(data[0]);
            } else if (Cookies.get('version') === undefined || parseInt(Cookies.get('version')) < parseInt(data[0])) {
                console.log("当前version: " + Cookies.get('version') + " 开始同步");
                version = data[0];
                update_item(data[0]);
            }

            if (data[1] === 'result') {
                window.mode = 'show'; //只展示结果
                showResults();
            } else if (data[1] === 'both') {
                window.mode = 'both'; //都展示
                showResults();
            } else {
                window.mode = 'vote'; //只展示选项
            }
        })
}


async function get_content(version) {
    try {
        const response = await fetch(`${domain}${version}.json?token=password`);
        return await response.json();
    } catch (error) {
        console.error(`与服务器通信不畅: ${error}`);
        alert("无法获取选项内容, 请尝试刷新");
    }
}

async function update_item(version) {
    const title = document.getElementById('voteQuestion');
    const opts = document.getElementById('voteOptions');
    title.innerText = "waiting";
    opts.innerHTML = "waiting";
    try {
        const data = await get_content(version.toString());
        title.innerText = data['title'];

        if (window.mode !== 'show') {
            const options = data['options'];
            opts.innerHTML = options.map(opt => `
                <div class="vote-option" onclick="castVote('${opt['value']}')">
                    ${opt['label']}
                </div>
            `).join("");
            console.log(opts.innerHTML);
            console.log("选项已更新");
        } else {
            if (window.mode === 'show') {
                opts.innerHTML = '';
            }
            showResults();
        }

    } catch (error) {
        console.error('获取数据失败:', error);
    }

}


function updateTimer() {
    const now = Date.now();
    const diff = voteEndTime - now;

    if (diff <= 0) {
        showResults();
        return;
    }

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    document.getElementById('timer').textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function onVerificationSuccess(token) {
    window.token = token;
}

function onVerificationError() {
    window.token = null;
    console.error('投票失败');
}

async function sendVote(voteType, Hash) {
    console.log('发送投票请求:', voteType, Hash);
    if (Hash.length !== 6 || Hash[0] !== '2') return alert("请输入正确学号");

    if (window.token === null) return alert("人机验证未通过");
    //学号要符合格式


    const formData = {
        key: voteType.toString(),
        hash: Hash.toString(),
        cf_turnstile_token: window.token.toString()
    };

    try {
        const response = await fetch('https://carnival.qbvisualnovel.top/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            alert('投票成功！');
            window.turnstile.reset();
        } else {
            alert(`投票失败：${result.error}`);
            window.turnstile.reset(); // 重置验证组件
        }
    } catch (error) {
        console.error('请求失败:', error);
        alert(`服务器通信失败${error.message}:${error}`);
    }
};

async function castVote(Vote) {
    hash = document.getElementById('id').value.toString();
    vote = Vote;
    sendVote(vote, hash);
}

async function queryVote(Votes) {
    let returnData = [];
    const url = Votes.map(V => V['value']).join('|');

    const response = await fetch(`https://carnival.qbvisualnovel.top/vote_worker/QUERY?key=${url}`);
    const data = await response.json();

    // 验证响应结构
    if (!data?.success || !Array.isArray(data.results)) {
        throw new Error('Invalid API response');
    }

    // 直接返回 results 数组（格式：[{ name: "...", value: ... }, ...]）
    return data.results;
}

async function showResults() {
    document.getElementById('voteResults').style.display = 'block';

    try {
        // 使用 await 替代 .then 链
        const response = await fetch(`${domain}${version}.json?token=password`);
        const data = await response.json();
        const options = data.options;

        // 获取投票数据
        const items = await queryVote(options);
        console.log(items);
        // 计算总票数 (使用 reduce)
        const total = items.reduce((sum, item) => sum + parseInt(item['value']), 0);
        console.log(total);
        // 构建结果 HTML
        const container = document.getElementById('resultsContainer');
        let htmlContent = '';

        // 遍历数组而非对象 (假设 items 是对象数组)
        items.forEach(item => {
            const percent = total === 0 ? 0 : Math.round((item['value'] / total) * 100);
            htmlContent += `
                <div>${item['name']}选项：${item['value']}票 (${percent}%)</div>
                <div class="results-bar">
                    <div class="results-fill" style="width: ${percent}%"></div>
                </div>
            `;
        });

        container.innerHTML = htmlContent;

    } catch (error) {
        console.error('Error fetching results:', error);
        // 可以添加错误提示到页面
        document.getElementById('resultsContainer').innerHTML =
            `<div class="error">获取结果失败，请刷新重试</div>`;
    }
}

if (Date.now() > voteEndTime) showResults();
if (Voted !== 'null') document.getElementById('voteOptions').innerHTML = `<p>感谢您的参与！${option} </p>`;

