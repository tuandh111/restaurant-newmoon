var app = angular.module('app', []);

app.controller('ChangePasswordCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.user = {};
    $scope.emailTouched = false;

    // ========================== VALIDATION ===========================

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

    $scope.isPasswordValid = function (pw) {
        return $scope.isMinLength(pw) &&
            $scope.hasUpperCase(pw) &&
            $scope.hasLowerCase(pw) &&
            $scope.hasNumber(pw) &&
            $scope.hasSpecialChar(pw);
    };

    $scope.isValidEmail = function (email) {
        //const emailRegex = /^[a-zA-Z0-9._%+-]+@newmoon\.vn$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        return emailRegex.test(email);
    };

    $scope.validateEmail = function () {
        // Just update the touched state so UI can respond
    };

    // =========================== UPDATE PASSWORD ===========================

    $scope.updatePassword = function () {
        if (
            !$scope.isValidEmail($scope.user.email) ||
            !$scope.isPasswordValid($scope.user.currentPassword) ||
            !$scope.isPasswordValid($scope.user.newPassword) ||
            $scope.user.newPassword !== $scope.user.confirmPassword
        ) {
            alert("Please fix validation errors before submitting.");
            return;
        }

        // Prepare data to send to backend
        const requestData = {
            email: $scope.user.email,
            password: $scope.user.currentPassword,
            newPassword: $scope.user.newPassword
        };
        // Send POST request to backend API
        $http.post('http://localhost:8080/api/v1/auth/update-password', requestData)
            .then(function (response) {
                const successMessage = response.data.message || "Password updated successfully!";

                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: successMessage,
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                }).then(() => {
                    window.location.href = 'index.html';
                });
            })
            .catch(function (error) {
                const errorMessage = (error.data && error.data.message)
                    ? error.data.message
                    : "Failed to update password. Please try again.";

                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: errorMessage,
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });
            });
    };
}]);
