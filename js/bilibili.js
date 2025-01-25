// 本文作者： EVAN / 忈桀 
// 本文链接： https://four2.site/articles/id19113.html 
// 版权声明： 本博客所有文章除特别声明外，均采用 BY-NC-SA 许可协议。转载请注明出处！ 
// ----------------------------------- START ----------------------------------- 
/**
 * bilibili iframe resize
 */
function bilibiliPlayerResize(item){
    // 获取播放器容器 bilibili-iframe 宽度
    let width = item.clientWidth, iframe = item.querySelector('iframe');
    // 522 是 iframe 调整样式的宽度阈值，宽度小于这个值时（如手机浏览器），播放器不会显示控制条及其后面的元素
    if (width > 522){
        // 设置 iframe 高度
        iframe.height = ~~(width * 9/16);
        // 设置容器高度
        item.style.height = (~~(width * 9/16) - 1) + 'px'; 
        tips.classList.remove('mobile');
    } else {
        iframe.height = ~~(width * 9/16);
        // 窗口窄时
        item.style.height = (~~(width * 9/16) - 2) + 'px';
        tips.classList.add('mobile');
    }
}
// 浏览器窗口大小变化时调整
window.addEventListener('resize', function(){
    document.body.querySelectorAll('.bilibili-iframe').forEach(item => {
        bilibiliPlayerResize(item);
    })
}); 
// 页面加载时调整
document.addEventListener("DOMContentLoaded", function(){
    document.body.querySelectorAll('.bilibili-iframe').forEach(item => {
        bilibiliPlayerResize(item);
    })
})
// -----------------------------------  END  ----------------------------------- 