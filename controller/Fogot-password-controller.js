angular.module('app', [])
    .controller('ResetPasswordCtrl', function ($scope, $http) {
        console.log("reset password controller");

        const apiBaseUrl = 'https://api.newmoon.vn/api/v1/auth';

        $scope.email = '';
        $scope.emailInvalid = false;

        $scope.validateEmail = function () {
            const emailValue = ($scope.email || '').trim();
            const pattern = /^[^\s@]+@newmoon\.vn$/;
            $scope.emailInvalid = !pattern.test(emailValue); // sai thì báo đỏ

        };

        $scope.sendResetPasswordEmail = function () {
            $scope.validateEmail();

            if (!$scope.email) {
                Toastify({
                    text: "❌ Error! Please enter your email.",
                    duration: 3000,
                    gravity: "top",
                    position: "center",
                    className: "toast-error"
                }).showToast();
                return;
            }

            if ($scope.emailInvalid) {
                Toastify({
                    text: "❌ Error! Email must end with @newmoon.vn",
                    duration: 3000,
                    gravity: "top",
                    position: "center",
                    className: "toast-error"
                }).showToast();
                return;
            }

            Toastify({
                text: "⏳ Sending reset instructions...",
                duration: 2000,
                gravity: "top",
                position: "center",
                className: "toast-info"
            }).showToast();

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
                        Toastify({
                            text: "✅ Email sent! Please check your inbox.",
                            duration: 3000,
                            gravity: "top",
                            position: "center",
                            className: "toast-success"
                        }).showToast();

                        $scope.email = '';
                        setTimeout(() => {
                            window.location.href = 'update-password.html';
                        }, 3000);
                    } else if (message === "null") {
                        Toastify({
                            text: "❌ User not found! Email does not exist.",
                            duration: 3000,
                            gravity: "top",
                            position: "center",
                            className: "toast-error"
                        }).showToast();
                    } else {
                        Toastify({
                            text: "⚠️ Failed to send email. Please try again later.",
                            duration: 3000,
                            gravity: "top",
                            position: "center",
                            className: "toast-error"
                        }).showToast();
                    }
                })
                .catch(function (error) {
                    Swal.close();
                    console.error("Error calling /send-code:", error);
                    Toastify({
                        text: "🚨 Request error! Please check your connection.",
                        duration: 3000,
                        gravity: "top",
                        position: "center",
                        className: "toast-error"
                    }).showToast();
                });
        };
    });
