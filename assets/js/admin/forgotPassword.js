angular.module('app', [])
    .controller('ResetPasswordCtrl', function ($scope, $q, $timeout, $http) {

        // Giả lập API kiểm tra email có tồn tại
        function checkEmailExists(email) {
            var deferred = $q.defer();
            $timeout(function () {
                // Email có "example" được xem là tồn tại
                deferred.resolve(email.includes('example'));
            }, 1000);
            return deferred.promise;
        }

        // Giả lập API kiểm tra mã OTP
        function verifyCode(email, code) {
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve(code === '123456');
            }, 1000);
            return deferred.promise;
        }

        // Giả lập API cập nhật mật khẩu mới
        function resetPassword(email, newPassword) {
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve(true);
            }, 1000);
            return deferred.promise;
        }
        $scope.sendResetPasswordEmail = function () {
            if (!$scope.email) {
                Swal.fire('Error', 'Please enter your email.', 'error');
                return;
            }

            Swal.fire({
                title: 'Processing...',
                text: 'Please wait while we send the reset instructions',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            $http.post('http://localhost:8080/api/v1/auth/send-code?email=' + encodeURIComponent($scope.email))
                .then(function (response) {
                    Swal.close();

                    const message = response.data.message;

                    if (message == "Successfully send mail") {
                        Swal.fire({
                            icon: 'success',
                            title: 'Email sent!',
                            text: 'Please check your inbox.',
                            showConfirmButton: false,
                            timer: 2000
                        }).then(() => {
                            window.location.href = 'update-password.html';
                        });
                        $scope.email = '';
                    } else if (message == "null") {
                        Swal.fire({
                            icon: 'error',
                            title: 'User not found',
                            text: 'Email does not exist in the system.'
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Failed to send email',
                            text: 'Please try again later.'
                        });
                    }
                })
                .catch(function (error) {
                    Swal.close();
                    console.error("Error calling /send-code:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Request error',
                        text: 'An unexpected error occurred.'
                    });
                });
        };


    });
