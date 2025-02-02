// 获取元素
const zoomElement = document.querySelector('.zoom');

// 添加鼠标悬停事件
zoomElement.addEventListener('mouseenter', function () {
    zoomElement.style.transform = 'scale(1.2)'; // 放大
});

// 添加鼠标离开事件
zoomElement.addEventListener('mouseleave', function () {
    zoomElement.style.transform = 'scale(1)'; // 恢复原状
});