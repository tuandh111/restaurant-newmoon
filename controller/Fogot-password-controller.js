angular.module('app', [])
    .controller('ResetPasswordCtrl', function ($scope, $http) {
        console.log("reset password controller");

        const apiBaseUrl = 'http://125.253.113.76/api/v1/auth';

        $scope.email = '';
        $scope.emailInvalid = false;

        // Kiểm tra email phải đúng định dạng @newmoon.vn
        $scope.validateEmail = function () {
            const pattern = /^[^\s@]+@newmoon\.vn$/;
            $scope.emailInvalid = !$scope.email || !pattern.test($scope.email);
        };

        $scope.sendResetPasswordEmail = function () {
            $scope.validateEmail();

            if (!$scope.email) {
                Swal.fire('Error', 'Please enter your email.', 'error');
                return;
            }

            if ($scope.emailInvalid) {
                Swal.fire('Error', 'Email must end with @newmoon.vn', 'error');
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

            $http.post(apiBaseUrl + '/send-code?email=' + encodeURIComponent($scope.email))
                .then(function (response) {
                    Swal.close();

                    const message = response.data.message;

                    if (message === "Successfully send mail") {
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
                    } else if (message === "null") {
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
