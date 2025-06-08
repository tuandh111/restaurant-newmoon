var app = angular.module('app', []);

app.controller('ChangePasswordCtrl', ['$scope', function ($scope) {
    $scope.user = {};

    // Check từng điều kiện mật khẩu
    $scope.isMinLength = function (pw) {
        return pw && pw.length >= 8;
    };

    $scope.hasUpperCase = function (pw) {
        return /[A-Z]/.test(pw);
    };

    $scope.hasLowerCase = function (pw) {
        return /[a-z]/.test(pw);
    };

    $scope.hasNumber = function (pw) {
        return /\d/.test(pw);
    };

    $scope.hasSpecialChar = function (pw) {
        return /[\W_]/.test(pw);
    };
    //
    $scope.user = {};
    $scope.emailTouched = false;

    $scope.validateEmail = function () {
        // Called on every change
        // Just toggles state so ng-class updates
    };

    $scope.isValidEmail = function (email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@newmoon\.vn$/;
        return emailRegex.test(email);
    };



    // Hàm kiểm tra tổng thể mật khẩu hợp lệ
    $scope.isPasswordValid = function (pw) {
        return $scope.isMinLength(pw) &&
            $scope.hasUpperCase(pw) &&
            $scope.hasLowerCase(pw) &&
            $scope.hasNumber(pw) &&
            $scope.hasSpecialChar(pw);
    };

    $scope.updatePassword = function () {
        if ($scope.changePasswordForm.$valid &&
            $scope.user.newPassword === $scope.user.confirmPassword &&
            $scope.isPasswordValid($scope.user.currentPassword) &&
            $scope.isPasswordValid($scope.user.newPassword)) {
            alert("Password updated!");
            // Xử lý tiếp (gọi API...)
        } else {
            alert("Please fix errors first!");
        }
    };
}]);
