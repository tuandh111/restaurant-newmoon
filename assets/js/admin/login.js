var app = angular.module('loginApp', []);

app.constant('API_BASE_URL', '');

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

    // Toast config
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
    });

    // Email validation
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

    // Password validation
    $scope.validatePassword = function () {
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;
        if ($scope.user.password && pattern.test($scope.user.password)) {
            $scope.passwordInvalid = false;
            $scope.passwordValid = true;
        } else {
            $scope.passwordInvalid = true;
            $scope.passwordValid = false;
        }
    };
    $scope.showPassword = false; // mặc định ẩn mật khẩu

    $scope.togglePasswordVisibility = function () {
        $scope.showPassword = !$scope.showPassword;
        var input = document.getElementById('example-password');
        input.type = $scope.showPassword ? 'text' : 'password';
    };


    $scope.validatePasswordDetails = function () {
        const password = $scope.user.password;
        const errors = [];

        if (password.length < 8) {
            errors.push('Have at least 8 characters');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Include at least one lowercase letter');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Include at least one uppercase letter');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('Include at least one number');
        }
        if (!/[\W_]/.test(password)) {
            errors.push('Include at least one special character');
        }

        return errors;
    };

    $scope.login = function () {
        $scope.validateEmail();
        $scope.validatePassword();

        if (!$scope.emailValid) {
            Toast.fire({ icon: 'error', title: 'Email must end with @newmoon.vn' });
            return;
        }

        const errors = $scope.validatePasswordDetails();

        if (errors.length > 0) {
            const errorMessage = 'Password must:<br>' + errors.map(e => '• ' + e).join('<br>');
            Toast.fire({
                icon: 'error',
                title: 'Invalid Password',
                html: errorMessage
            });
            return;
        }

        const loginData = {
            email: $scope.user.email,
            password: $scope.user.password
        };

        $http.post('http://localhost:8080/api/v1/auth/authenticate', loginData)
            .then(function (response) {
                console.log('Login success', response.data);
                Toast.fire({ icon: 'success', title: 'Login successful!' });
                setTimeout(() => {
                    $window.location.href = 'index.html';
                }, 1000);
            })
            .catch(function (error) {
                console.error('Login failed', error);
                Toast.fire({ icon: 'error', title: 'Login failed! Check email or password.' });
            });
    };
});
