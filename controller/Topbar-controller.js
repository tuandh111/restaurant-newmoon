app.controller('TopbarController', function ($scope, $window, $timeout) {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
        $window.location.href = 'login.html';
        return;
    }

    const currentUser = JSON.parse(userData);
    $scope.currentUser = currentUser;
    const userRole = currentUser.role.roleName.toLowerCase();

    $scope.showToast = function (text, type = 'info') {
        let bgColor = '#17a2b8';
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

    function getGreetingMessage() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'Good morning';
        else if (hour >= 12 && hour < 18) return 'Good afternoon';
        else return 'Good evening';
    }

    function showGreeting() {
        $timeout(function () {
            const greeting = getGreetingMessage();
            const fullName = `${currentUser.lastname} ${currentUser.firstname}`;
            const role = currentUser.role.roleName;
            $scope.showToast(`👋 ${greeting}, ${fullName} (Role: ${role})`, 'success');
        }, 200);
    }

    // ✅ Mặc định không hiện gì cả
    $scope.showUserHint = false;
    $scope.zIndexTooltip = -10;

    // ✅ Kiểm tra trạng thái đăng nhập
    const justLoggedIn = sessionStorage.getItem('justLoggedIn') === 'true';
    const hintDismissed = localStorage.getItem('userHintDismissed') === 'true';

    if (justLoggedIn && !hintDismissed) {
        $scope.showUserHint = true;
        $scope.zIndexTooltip = 1060;
        // ✅ Xóa flag luôn để không hiện lại sau khi F5
        sessionStorage.removeItem('justLoggedIn');
    }

    // ✅ Khi nhấn "Đã hiểu"
    $scope.hideUserHint = function () {
        console.log("ok nè")
        $scope.showUserHint = false;
        $scope.zIndexTooltip = -10;
        localStorage.setItem('userHintDismissed', 'true');
        showGreeting();
    };

    $scope.canAccess = function (...departments) {
        return userRole === 'admin' || departments.includes(userRole);
    };

    $scope.logout = function () {
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
            sessionStorage.removeItem('justLoggedIn');       // 👈 xóa flag vừa đăng nhập
            localStorage.removeItem('userHintDismissed');
            $window.location.href = 'login.html';
        }, 1200);
    };
});
