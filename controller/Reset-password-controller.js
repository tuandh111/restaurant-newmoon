var app = angular.module('app', []);

app.controller('ChangePasswordCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.user = {};
    const apiBaseUrl = 'http://125.253.113.76/api/v1/auth';

    // ===== Validation Functions =====
    $scope.isMinLength = pw => pw && pw.length >= 8;
    $scope.hasUpperCase = pw => /[A-Z]/.test(pw);
    $scope.hasLowerCase = pw => /[a-z]/.test(pw);
    $scope.hasNumber = pw => /\d/.test(pw);
    $scope.hasSpecialChar = pw => /[\W_]/.test(pw);

    $scope.isPasswordValid = pw =>
        $scope.isMinLength(pw) &&
        $scope.hasUpperCase(pw) &&
        $scope.hasLowerCase(pw) &&
        $scope.hasNumber(pw) &&
        $scope.hasSpecialChar(pw);

    $scope.isValidEmail = email =>
        /^[a-zA-Z0-9._%+-]+@newmoon\.vn$/.test(email);

    function showToast(message, type = 'info') {
        Toastify({
            text: message,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: {
                success: "#4caf50",
                error: "#f44336",
                warning: "#ff9800",
                info: "#2196f3"
            }[type] || "#333"
        }).showToast();
    }

    // ===== Update Password =====
    $scope.updatePassword = function () {
        if (!$scope.isValidEmail($scope.user.email)) {
            showToast("Email must end with @newmoon.vn", "warning");
            return;
        }

        if (!$scope.isPasswordValid($scope.user.currentPassword)) {
            showToast("Invalid current password. Use 8+ chars, upper/lowercase, number & symbol.", "warning");
            return;
        }

        if (!$scope.isPasswordValid($scope.user.newPassword)) {
            showToast("Invalid new password. Use 8+ chars, upper/lowercase, number & symbol.", "warning");
            return;
        }

        if ($scope.user.newPassword !== $scope.user.confirmPassword) {
            showToast("Password confirmation does not match.", "error");
            return;
        }

        const requestData = {
            email: $scope.user.email,
            password: $scope.user.currentPassword,
            newPassword: $scope.user.newPassword
        };

        $http.post(apiBaseUrl + '/update-password', requestData)
            .then(function (response) {
                showToast(response.data.message || "Password updated successfully!", "success");

                // Chờ Toastify chạy xong (ví dụ: 2 giây)
                setTimeout(() => {
                    // Thêm loading spinner overlay
                    const loadingOverlay = document.createElement('div');
                    loadingOverlay.id = 'loading-overlay';
                    loadingOverlay.style.position = 'fixed';
                    loadingOverlay.style.top = 0;
                    loadingOverlay.style.left = 0;
                    loadingOverlay.style.width = '100vw';
                    loadingOverlay.style.height = '100vh';
                    loadingOverlay.style.background = 'rgba(255, 255, 255, 0.85)';
                    loadingOverlay.style.display = 'flex';
                    loadingOverlay.style.alignItems = 'center';
                    loadingOverlay.style.justifyContent = 'center';
                    loadingOverlay.style.zIndex = '9999';
                    loadingOverlay.innerHTML = `
                <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                </div>
            `;
                    document.body.appendChild(loadingOverlay);

                    // Tiếp tục chuyển trang sau 1.2 giây nữa
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1200);
                }, 2000); // delay = thời gian Toastify hiển thị
            })
            .catch(function (error) {
                showToast(error?.data?.message || "Failed to update password. Please try again.", "error");
            });


    };
}]);
