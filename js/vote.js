const form = document.getElementById('demo-form');
let token = null;

// Turnstile 回调函数
window.onSuccess = function(token) {
    console.log('验证成功，Token:', token);
    window.token = token;
};

window.onError = function() {
    console.error('验证发生错误');
    window.token = null;
};

window.onExpired = function() {
    console.warn('验证已过期');
    window.token = null;
};


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
    fetch("https://raw.zhizhiwang.top/zhizhizhiwang/carnival-pub/refs/heads/main/now-version")
    .then(response => response.text())
    .then(data => {
        console.log("web version: " + data);
        if ( Cookies === undefined ) {
            console.error("jscookie未加载!");
        } else if (Cookies.get('version') === undefined || parseInt(Cookies.get('version')) < parseInt(data)) {
            console.log("当前version: " + Cookies.get('version') + " 开始同步");
            update_item();
        }
        
    })
});

function update_item() {

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

async function verify(e) {
    e.preventDefault();
            
    if (!window.token) {
        alert('请先完成人机验证');
        return;
    }

    const formData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        cf_turnstile_token: window.token
    };

    try {
        const response = await fetch('/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        if (result.success) {
            alert('验证成功！');
            // 这里可以添加登录成功后的跳转逻辑
        } else {
            alert(`验证失败：${result.error}`);
            window.turnstile.reset(); // 重置验证组件
        }
    } catch (error) {
        console.error('请求失败:', error);
        alert('服务器通信失败');
    }
};

function castVote(option) {
    if (Voted !== 'null') return alert('您已经投过票了！');
    if (!confirm(`确认选择 ${option} 选项吗？`)) return;
    
    if(votes[option] !== undefined) votes[option]++;
    else votes[option] = 1

    localStorage.setItem('votes', JSON.stringify(votes));
    localStorage.setItem('Voted', option);
    Voted = option;
    alert('投票成功！');
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

// 初始化定时器
setInterval(updateTimer, 1000);
updateTimer();
if (Date.now() > voteEndTime) showResults();
if (Voted !== 'null') document.getElementById('voteOptions').innerHTML = `<p>感谢您的参与！${option} </p>`;

