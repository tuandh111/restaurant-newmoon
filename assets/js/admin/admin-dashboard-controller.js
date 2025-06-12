var app = angular.module('myApp', []);
app.controller('AdminDashboardController', function ($scope, $window) {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    console.log(JSON.parse(userData).role.roleName)
    if (!token || !userData) {
        $window.location.href = 'index.html'; // Redirect nếu chưa đăng nhập
        return;
    }

    $scope.currentUser = JSON.parse(userData);
    $scope.userRole = $scope.currentUser.role.roleName.toLowerCase();
    $scope.canAccess = function (department) {
        return $scope.userRole === 'admin' || $scope.userRole === department;
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
            $window.location.href = 'index.html';
        }, 1200); // Đợi 1.2 giây rồi chuyển trang cho mượt
    };

});
