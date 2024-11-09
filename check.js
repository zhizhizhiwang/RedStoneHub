const links = document.querySelectorAll('.link');
const statuses = document.querySelectorAll('.status');

links.forEach((link, index) => {
    const url = link.href;
    fetch(url, { method: 'GET' })
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    if (data.version && data.players) {
                        statuses[index].textContent = '在线';
                        link.style.color = 'green';
                    } else {
                        statuses[index].textContent = '离线';
                        link.style.color = 'red';
                    }
                });
            } else {
                statuses[index].textContent = '离线';
                link.style.color = 'red';
            }
        })
        .catch((error) => {
            console.error(error);
            statuses[index].textContent = '离线';
            link.style.color = 'red';
        });
});
