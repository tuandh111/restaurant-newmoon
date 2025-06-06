angular.module('app', [])
    .controller('ResetPasswordCtrl', function ($scope, $q, $timeout) {

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

        $scope.submitEmail = function () {
            // if (!$scope.email) {
            //     Swal.fire('Error', 'Please enter your email.', 'error');
            //     return;
            // }

            // checkEmailExists($scope.email).then(function (exists) {
            //     if (!exists) {
            //         Swal.fire('Error', 'Email not found.', 'error');
            //         return;
            //     }
            console.log("ok")
            // Hiện popup nhập code
            Swal.fire({
                title: 'Enter verification code',
                input: 'text',
                inputLabel: 'A code was sent to your email',
                inputPlaceholder: 'Enter the code',
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return 'You need to enter the code!'
                    }
                }
            }).then(function (result) {
                if (result.isConfirmed) {
                    var code = result.value;

                    verifyCode($scope.email, code).then(function (valid) {
                        // if (!valid) {
                        //     Swal.fire('Error', 'Invalid verification code.', 'error');
                        //     return;
                        // }

                        // Mã code đúng, hiện form nhập mật khẩu mới
                        Swal.fire({
                            title: 'Reset your password',
                            html:
                                `<input type="password" id="newPassword" class="swal2-input" placeholder="New password">
                 <input type="password" id="confirmPassword" class="swal2-input" placeholder="Confirm password">`,
                            focusConfirm: false,
                            preConfirm: () => {
                                const newPassword = Swal.getPopup().querySelector('#newPassword').value;
                                const confirmPassword = Swal.getPopup().querySelector('#confirmPassword').value;
                                if (!newPassword || !confirmPassword) {
                                    Swal.showValidationMessage('Please enter both password fields');
                                } else if (newPassword !== confirmPassword) {
                                    Swal.showValidationMessage('Passwords do not match');
                                }
                                return { newPassword: newPassword, confirmPassword: confirmPassword };
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                var newPassword = result.value.newPassword;
                                resetPassword($scope.email, newPassword).then(function (success) {
                                    if (success) {
                                        Swal.fire('Success', 'Your password has been reset.', 'success');
                                        $scope.email = '';  // Reset email field
                                        $scope.$applyAsync();
                                    } else {
                                        Swal.fire('Error', 'Failed to reset password.', 'error');
                                    }
                                });
                            }
                        });
                    });
                }
            });
            // });
        };

    });
