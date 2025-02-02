// GitHub API URL
const repoOwner = 'zhizhizhiwang';
const repoName = 'RedStoneHub';
const VersionApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/commits`;

// 获取最后一次提交的哈希码
fetch(VersionApiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // 获取最后一次提交的 7 位哈希码
        const commitHash = data[0].sha.substring(0, 7);

        // 获取所有带有 version 标签的元素
        const versionElements = document.querySelectorAll('[version]');

        // 替换每个元素的内容
        versionElements.forEach(element => {
            element.textContent = commitHash; 
        });

        console.log(commitHash)
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
