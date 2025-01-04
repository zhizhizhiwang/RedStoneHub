// GitHub 仓库信息
const owner = 'zhizhizhiwang';
const repo = 'RedStoneHub';

// 获取 span 元素和文件路径
const spanElement = document.querySelector('span[data-file]');
const filePath = spanElement.getAttribute('data-file');
const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?path=${filePath}`;

// 获取文件的最后修改日期
fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.length > 0) {
            // 获取最后一次提交的日期
            const lastModifiedDate = new Date(data[0].commit.committer.date);
            // 格式化日期
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            const formattedDate = lastModifiedDate.toLocaleDateString('zh-CN', options);
            // 替换 span 的内容
            spanElement.textContent = formattedDate;
        } else {
            spanElement.textContent = '没有找到提交记录。';
        }
    })
    .catch(error => {
        console.error('获取文件修改日期时出错:', error);
        spanElement.textContent = '获取日期失败。';
    });