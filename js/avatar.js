document.addEventListener('DOMContentLoaded', function() {
    const avatar = document.getElementById('avatar');
    const avatarInput = document.getElementById('avatarInput');
    const avatarImg = document.getElementById('avatarImg');

    // 从 localStorage 加载保存的头像
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
        avatarImg.src = savedAvatar;
    }

    // 点击头像触发文件选择
    avatar.addEventListener('click', function() {
        avatarInput.click();
    });

    // 处理文件选择
    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                avatarImg.src = event.target.result;
                // 保存到 localStorage
                localStorage.setItem('userAvatar', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
}); 