var app = angular.module('loginApp', []);

app.constant('API_BASE_URL', 'https://api.newmoon.vn/api/v1/auth');
app.controller('LoginController', function ($scope, $http, $window, API_BASE_URL) {
    console.log("loginController");

    $scope.user = {
        email: '',
        password: '',
        rememberMe: false
    };

    $scope.emailInvalid = false;
    $scope.emailValid = false;
    $scope.passwordInvalid = false;
    $scope.passwordValid = false;
    $scope.showPassword = false;

    // Validate email ends with @newmoon.vn
    $scope.validateEmail = function () {
        const pattern = /^[a-zA-Z0-9._%+-]+@newmoon\.vn$/;
        if ($scope.user.email && pattern.test($scope.user.email)) {
            $scope.emailInvalid = false;
            $scope.emailValid = true;
        } else {
            $scope.emailInvalid = true;
            $scope.emailValid = false;
        }
    };

    // Password validation helpers
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

    $scope.validatePassword = function () {
        const pw = $scope.user.password || '';
        const isValid =
            $scope.isMinLength(pw) &&
            $scope.hasUpperCase(pw) &&
            $scope.hasLowerCase(pw) &&
            $scope.hasNumber(pw) &&
            $scope.hasSpecialChar(pw);

        $scope.passwordInvalid = !isValid;
        $scope.passwordValid = isValid;
    };

    $scope.togglePasswordVisibility = function () {
        $scope.showPassword = !$scope.showPassword;
    };

    $scope.showToast = function (text, type = 'info') {
        let bgColor = '#17a2b8'; // info
        if (type === 'success') bgColor = '#28a745';
        if (type === 'error') bgColor = '#dc3545';
        if (type === 'warning') bgColor = '#ffc107';

        Toastify({
            text: text,
            duration: 3000,
            gravity: "top",
            position: "center",
            style: {
                background: bgColor,
                color: type === 'warning' ? 'black' : 'white',
                fontWeight: 'bold'
            }
        }).showToast();
    };
    $scope.login = function () {
        $scope.validateEmail();
        $scope.validatePassword();

        if (!$scope.emailValid) {
            $scope.showToast("❌ Email must end with @newmoon.vn", "error");
            return;
        }

        if ($scope.passwordInvalid) {
            const errors = [];
            if (!$scope.isMinLength($scope.user.password)) errors.push("• At least 8 characters");
            if (!$scope.hasUpperCase($scope.user.password)) errors.push("• One uppercase letter");
            if (!$scope.hasLowerCase($scope.user.password)) errors.push("• One lowercase letter");
            if (!$scope.hasNumber($scope.user.password)) errors.push("• One number");
            if (!$scope.hasSpecialChar($scope.user.password)) errors.push("• One special character");

            const errorMsg = "❌ Invalid Password:\n" + errors.join("\n");
            $scope.showToast(errorMsg, "error");
            return;
        }

        const loginData = {
            email: $scope.user.email,
            password: $scope.user.password
        };

        $http.post(API_BASE_URL + '/authenticate', loginData)
            .then(response => {
                const data = response.data;
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                sessionStorage.setItem('justLoggedIn', 'true');
                if ($scope.user.rememberMe) {
                    localStorage.setItem('email', $scope.user.email);
                    localStorage.setItem('password', $scope.user.password);
                    localStorage.setItem('rememberMe', 'true');
                } else {
                    localStorage.removeItem('email');
                    localStorage.removeItem('password');
                    localStorage.setItem('rememberMe', 'false');
                }

                Toastify({
                    text: `<div style="display: flex; align-items: center; justify-content: center; white-space: nowrap;">
           <span class="spinner-border spinner-border-sm text-light me-2" role="status" aria-hidden="true"></span>
           <span>Login successful! Redirecting...</span>
         </div>`,
                    duration: 2000,
                    gravity: "top",
                    position: "center",
                    escapeMarkup: false,
                    style: {
                        background: "#28a745",
                        color: "#fff",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        minWidth: "250px",
                        textAlign: "center"
                    }
                }).showToast();
                setTimeout(() => {
                    $window.location.href = 'index.html';
                }, 2300);
            })
            .catch(error => {
                const message = error?.data?.message;

                if (message === 'LOGIN_FAIL') {
                    $scope.showToast("❌ Login failed! Invalid email or password.", "error");
                } else if (message === 'ACCOUNT_DISABLED') {
                    $scope.showToast("⚠️ Your account has been disabled. Contact admin.", "warning");
                } else {
                    $scope.showToast("🚨 Login failed! Please try again later.", "error");
                }
            });
    };

    if (localStorage.getItem('rememberMe') === 'true') {
        $scope.user.email = localStorage.getItem('email') || '';
        $scope.user.password = localStorage.getItem('password') || '';
        $scope.user.rememberMe = true;

        $scope.validateEmail();
        $scope.validatePassword();
    }
});
