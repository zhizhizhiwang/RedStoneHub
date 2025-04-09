document.querySelectorAll('.touchactive').forEach(element => {
    element.addEventListener('touchstart', function (e) {
        e.preventDefault();
        this.classList.add('active');
    });
    element.addEventListener('touchend', function () {
        this.classList.remove('active');
    });
    element.addEventListener('mouseenter', () => this.classList.add('hover'));
    element.addEventListener('mouseleave', () => this.classList.remove('hover'));
});