app.controller('MenuController', function ($scope, $window, $timeout) {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    // Nếu chưa đăng nhập → chuyển hướng đến trang login
    if (!token || !userData) {
        $window.location.href = 'login.html';
        return;
    }

    // Hàm hiển thị thông báo Toast
    $scope.showToast = function (text, type = 'info') {
        let bgColor = '#17a2b8'; // info
        if (type === 'success') bgColor = '#28a745';
        else if (type === 'error') bgColor = '#dc3545';
        else if (type === 'warning') bgColor = '#ffc107';

        Toastify({
            text: text,
            duration: 3500,
            gravity: "top",
            position: "center",
            style: {
                background: bgColor,
                color: type === 'warning' ? 'black' : 'white',
                fontWeight: 'bold'
            }
        }).showToast();
    };

    // Hàm lấy lời chào theo giờ
    function getGreetingMessage() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'Good morning';
        else if (hour >= 12 && hour < 18) return 'Good afternoon';
        else return 'Good evening';
    }

    // Gán người dùng hiện tại
    const currentUser = JSON.parse(userData);
    $scope.currentUser = currentUser;
    const userRole = currentUser.role.roleName.toLowerCase();

    // Chỉ chào khi vừa đăng nhập
    if (sessionStorage.getItem('justLoggedIn')) {
        $timeout(function () {
            const greeting = getGreetingMessage();
            const fullName = `${currentUser.lastname} ${currentUser.firstname}`;
            const role = currentUser.role.roleName;
            $scope.showToast(`👋 ${greeting}, ${fullName} (Role: ${role})`, 'success');
        }, 200);
        sessionStorage.removeItem('justLoggedIn');
    }

    // Hàm kiểm tra quyền truy cập
    $scope.canAccess = function (...departments) {
        return userRole === 'admin' || departments.includes(userRole);
    };

    // Đăng xuất
    $scope.logout = function () {
        Swal.fire({
            title: 'Logging out...',
            didOpen: () => Swal.showLoading(),
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false
        });

        setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            sessionStorage.removeItem('justLoggedIn');
            $window.location.href = 'login.html';
        }, 1200);
    };
});
