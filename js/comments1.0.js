document.addEventListener('DOMContentLoaded', async () => {
    const commentSection = document.getElementById('comment-section');
    const commentList = document.getElementById('comment-list');
    const commentSectionId = commentSection.dataset.commentSectionId;

    try {
        const response = await fetch(`/api/comments/${commentSectionId}`);
        if (!response.ok) {
            console.error('获取评论失败:', response.status);
            return;
        }
        const comments = await response.json();
        renderComments(comments, commentList);
    } catch (error) {
        console.error('获取评论失败:', error);
    }

    
    const submitCommentButton = document.getElementById('submit-comment');
    const commentInput = document.getElementById('comment-input');
    const commenterIdInput = document.getElementById('commenter-id');

    submitCommentButton.addEventListener('click', async () => {
        const content = commentInput.value;
        const commenter_id = commenterIdInput.value;
        const reply_to_id = null; // 初始版本只处理根评论

        if (content && commenter_id) {
            try {
                const response = await fetch(`/api/comments/${commentSectionId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ content, commenter_id, reply_to_id }),
                });

                if (!response.ok) {
                    console.error('提交评论失败:', response.status);
                    return;
                }

                const data = await response.json();
                if (data.success) {
                    commentInput.value = '';
                    commenterIdInput.value = '';
                    // 重新获取并渲染评论列表
                    const fetchResponse = await fetch(`/api/comments/${commentSectionId}`);
                    const updatedComments = await fetchResponse.json();
                    commentList.innerHTML = '';
                    renderComments(updatedComments, commentList);
                } else {
                    console.error('提交评论失败:', data.error);
                }
            } catch (error) {
                console.error('提交评论失败:', error);
            }
        } else {
            alert('请填写评论内容和您的用户 ID。');
        }
    });
});

function renderComments(comments, parentElement, level = 0) {
    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        if (level > 0) {
            commentDiv.classList.add('reply');
        }
        commentDiv.innerHTML = `<strong>${comment.commenter_id}:</strong> <span class="math-inline">${comment.content} <small\>\(</span>${new Date(comment.created_at * 1000).toLocaleString()})</small>`;
        parentElement.appendChild(commentDiv);

        const replies = comments.filter(reply => reply.reply_to_id === comment.id);
        if (replies.length > 0) {
            const repliesContainer = document.createElement('div');
            repliesContainer.classList.add('replies-container');
            renderComments(replies, repliesContainer, level + 1);
            commentDiv.appendChild(repliesContainer);
        }
    });
}