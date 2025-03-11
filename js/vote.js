// 投票系统逻辑
let voteEndTime = localStorage.getItem('voteEndTime') || (Date.now() + 300000);
let votes = JSON.parse(localStorage.getItem('votes')) || { A: 0, B: 0, C: 0 };
let Voted = localStorage.getItem('Voted');

if Voted === null {
	VOted = 'null';
	localStorage.setItem('Voted', 'null');
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

