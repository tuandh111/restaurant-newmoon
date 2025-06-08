var app = angular.module('loginApp', []);

app.constant('API_BASE_URL', 'http://localhost:8080/api/v1');

app.controller('LoginController', function ($scope, $http, $window, API_BASE_URL) {
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

    // SweetAlert2 toast config
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
    });

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

    // Detailed password checks for user feedback
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

    // Toggle show/hide password input
    $scope.togglePasswordVisibility = function () {
        $scope.showPassword = !$scope.showPassword;
    };

    // Login function called on form submit
    $scope.login = function () {
        $scope.validateEmail();
        $scope.validatePassword();

        if (!$scope.emailValid) {
            Toast.fire({ icon: 'error', title: 'Email must end with @newmoon.vn' });
            return;
        }

        if ($scope.passwordInvalid) {
            const errors = [];
            if (!$scope.isMinLength($scope.user.password)) errors.push('At least 8 characters');
            if (!$scope.hasUpperCase($scope.user.password)) errors.push('At least one uppercase letter');
            if (!$scope.hasLowerCase($scope.user.password)) errors.push('At least one lowercase letter');
            if (!$scope.hasNumber($scope.user.password)) errors.push('At least one number');
            if (!$scope.hasSpecialChar($scope.user.password)) errors.push('At least one special character');

            const errorMsg = errors.map(e => `• ${e}`).join('<br>');
            Toast.fire({
                icon: 'error',
                title: 'Invalid Password',
                html: `Password must:<br>${errorMsg}`
            });
            return;
        }

        const loginData = {
            email: $scope.user.email,
            password: $scope.user.password
        };

        $http.post(`${API_BASE_URL}/auth/authenticate`, loginData)
            .then(response => {
                Toast.fire({ icon: 'success', title: 'Login successful!' });
                setTimeout(() => {
                    $window.location.href = 'index.html';
                }, 1000);
            })
            .catch(error => {
                Toast.fire({ icon: 'error', title: 'Login failed! Check email or password.' });
            });
    };
});