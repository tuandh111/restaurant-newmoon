app.controller('TopbarController', function($scope, $window) {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
        $window.location.href = 'login.html';
        return;
    }

    const currentUser = JSON.parse(userData);
    $scope.currentUser = currentUser;
    const userRole = currentUser.role.roleName.toLowerCase();

    // Cho phép dùng trong view
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
            $window.location.href = 'login.html';
        }, 1200);
    };
});
