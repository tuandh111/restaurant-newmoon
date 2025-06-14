var app = angular.module('loginApp', []);

app.constant('API_BASE_URL', 'http://125.253.113.76/api/v1/auth');
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

    $scope.showToast = function (text, className) {
        Toastify({
            text: text,
            duration: 3000,
            gravity: "top",
            position: "center",
            className: className
        }).showToast();
    };

    $scope.login = function () {
        $scope.validateEmail();
        $scope.validatePassword();

        if (!$scope.emailValid) {
            $scope.showToast("❌ Email must end with @newmoon.vn", "toast-error");
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
            $scope.showToast(errorMsg, "toast-error");
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

                if ($scope.user.rememberMe) {
                    localStorage.setItem('email', $scope.user.email);
                    localStorage.setItem('password', $scope.user.password);
                    localStorage.setItem('rememberMe', 'true');
                } else {
                    localStorage.removeItem('email');
                    localStorage.removeItem('password');
                    localStorage.setItem('rememberMe', 'false');
                }

                $scope.showToast("✅ Login successful!", "toast-success");

                setTimeout(() => {
                    $window.location.href = 'index.html';
                }, 1500);
            })
            .catch(error => {
                const message = error?.data?.message;

                if (message === 'LOGIN_FAIL') {
                    $scope.showToast("❌ Login failed! Invalid email or password.", "toast-error");
                } else if (message === 'ACCOUNT_DISABLED') {
                    $scope.showToast("⚠️ Your account has been disabled. Contact admin.", "toast-warning");
                } else {
                    $scope.showToast("🚨 Login failed! Please try again later.", "toast-error");
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
