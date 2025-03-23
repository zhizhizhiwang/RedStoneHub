const form = document.getElementById('demo-form');
let hash = null;
let vote = null;
let token = null;
window.token = null;

// let domain = 'https://raw.zhizhiwang.top/zhizhizhiwang/carnival-pub/refs/heads/main/'
let domain = `https://github.cmliussss.net/https://raw.githubusercontent.com/zhizhizhiwang/carnival-pub/refs/heads/main/`

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

document.addEventListener("DOMContentLoaded", function() {
    console.log("页面初始化开始");
    fetch(`${domain}now-version`)
    .then(response => response.text())
    .then(data => {
        console.log("web version: " + data);
        update_item(data);
    })

    setInterval(upgrade, 1 * 60 * 1000);
});

async function upgrade() {
    fetch(`${domain}now-version`)
    .then(response => response.text())
    .then(data => {
        console.log("web version: " + data);
        if ( Cookies === undefined ) {
            console.error("jscookie未加载!");
            update_item(data);
        } else if (Cookies.get('version') === undefined || parseInt(Cookies.get('version')) < parseInt(data)) {
            console.log("当前version: " + Cookies.get('version') + " 开始同步");
            update_item(data);
        }
    })
}


async function get_content(version) {
    try {
        const response = await fetch(`${domain}${version}.json`);
        return await response.json();
    } catch (error) {
        console.error(`与服务器通信不畅: ${error}`);
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
        const options = data['options'];
        opts.innerHTML = options.map(opt => `
            <div class="vote-option" onclick="castVote('${opt['value']}')">
                ${opt['label']}
            </div>
        `).join("");
    
    Cookies.set("version", )
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
    
    if (window.token === null) return alert("人机验证未通过");

    const formData = {
        key: voteType.toString(),
        hash: hash.toString(),
        cf_turnstile_token: window.token.toString()
    };

    try {
        const response = await fetch('verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        if (result.success) {
            alert('投票成功！');
        } else {
            alert(`投票失败：${result.error}`);
            window.turnstile.reset(); // 重置验证组件
        }
    } catch (error) {
        console.error('请求失败:', error);
        alert('服务器通信失败');
    }
};

async function castVote(Vote) {
    sha256(document.getElementById('name').value.toString() + document.getElementById('id').value.toString())
    .then(h => hash = h)
    vote = Vote;

    sendVote(vote, hash);
}

function showResults() {
    document.getElementById('voteOptions').style.display = 'none';
    document.getElementById('voteTimer').style.display = 'none';
    document.getElementById('voteResults').style.display = 'block';

    const total = Object.values(votes).reduce((a, b) => a + b, 0);
    const container = document.getElementById('resultsContainer');
    container.innerHTML = '';

    for (const [option, count] of Object.entries(votes)) {
        const percent = total === 0 ? 0 : Math.round((count / total) * 100);
        container.innerHTML += `
            <div>${option}选项：${count}票 (${percent}%)</div>
            <div class="results-bar">
                <div class="results-fill" style="width: ${percent}%"></div>
            </div>
        `;
    }
}

if (Date.now() > voteEndTime) showResults();
if (Voted !== 'null') document.getElementById('voteOptions').innerHTML = `<p>感谢您的参与！${option} </p>`;

