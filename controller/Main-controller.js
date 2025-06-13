document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
        window.location.href = 'login.html'; // Chưa đăng nhập => redirect
        return;
    }

    const currentUser = JSON.parse(userData);
    const userRole = currentUser.role.roleName.toLowerCase();

    // Hàm kiểm tra quyền truy cập
    function canAccess(department) {
        return userRole === 'admin' || userRole === department;
    }

    // Gán hàm logout cho nút logout
    const logoutBtn = document.querySelector('#logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            Swal.fire({
                title: 'Logging out...',
                didOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });

            setTimeout(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'login.html';
            }, 1200);
        });
    }
});