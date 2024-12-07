const toggleButton_1 = document.getElementById('toggle-button-1');
const element_1 = document.getElementById('element-1');

const toggleButton_2 = document.getElementById('toggle-button-2');
const element_2 = document.getElementById('element-2');

toggleButton_1.addEventListener('click', function () {
    if (element_1.style.height === '0px') {
        element_1.style.height = 'auto';
    } else {
        element_1.style.height = '0px';
    }
});

toggleButton_2.addEventListener('click', function () {
    if (element_2.style.height === '0px') {
        element_2.style.height = 'auto';
    } else {
        element_2.style.height = '0px';
    }
});
