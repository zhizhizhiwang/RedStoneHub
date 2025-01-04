fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        console.log(data)
        document.getElementById('footer').innerHTML = data;
    })
    .catch(error => console.error('Error loading the HTML file:', error));