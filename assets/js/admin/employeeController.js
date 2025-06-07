var app = angular.module('myApp', []);

// Directive: Gọi sự kiện khi ng-repeat render xong
app.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    };
});

app.controller('UserController', function ($scope, $http, $timeout) {
    $scope.users = [];
    $scope.roles = [];
    $scope.newUser = {};
    $scope.provinces = [];
    $scope.districts = [];
    $scope.wards = [];
    $scope.submitted = false;

    // Hàm khởi tạo lại DataTable
    function initializeDataTable() {
        $timeout(() => {
            $('#example1').DataTable({
                paging: true,
                searching: true,
                ordering: true,
                lengthChange: true,
                pageLength: 10,
                lengthMenu: [5, 10, 25, 50],
                responsive: true
            });
        }, 0);
    }

    // Bắt sự kiện khi ng-repeat render xong
    $scope.$on('ngRepeatFinished', function () {
        console.log("ngRepeat xong, init lại DataTable");

        // Chỉ gọi khi bảng đã destroy trước đó
        if ($.fn.DataTable.isDataTable('#example1')) {
            $('#example1').DataTable().clear().destroy();
        }

        initializeDataTable();
    });

    // Load danh sách users
    function loadUsers() {
        $http.get('http://localhost:8080/api/v1/auth/users').then(function (response) {
            $scope.users = response.data;
            // Không cần gọi lại DataTable ở đây
        }, function (error) {
            console.error("Error loading users:", error);
        });
    }

    // Load roles
    $http.get('http://localhost:8080/api/v1/auth/role').then(function (response) {
        $scope.roles = response.data;
    });

    // Load provinces
    $http.get("https://provinces.open-api.vn/api/?depth=1").then(function (response) {
        $scope.provinces = response.data;
    });

    // Khi chọn tỉnh
    $scope.onProvinceChange = function () {
        const provinceCode = $scope.newUser.province?.code;
        if (!provinceCode) return;
        $http.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`).then(function (response) {
            $scope.districts = response.data.districts;
            $scope.newUser.district = null;
            $scope.wards = [];
            $scope.newUser.ward = null;
        });
    };

    // Khi chọn huyện
    $scope.onDistrictChange = function () {
        const districtCode = $scope.newUser.district?.code;
        if (!districtCode) return;
        $http.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`).then(function (response) {
            $scope.wards = response.data.wards;
            $scope.newUser.ward = null;
        });
    };

    // Submit đăng ký user mới
    $scope.submitRegister = function () {
        $scope.submitted = true;

        if ($scope.registerForm.$valid) {
            const payload = {
                email: $scope.newUser.email,
                password: "12345678",
                roleId: $scope.newUser.roleId,
                dentalStaffId: 0,
                patientId: 0,
                doctorId: 0,
                province: $scope.newUser.province?.name || "",
                district: $scope.newUser.district?.name || "",
                ward: $scope.newUser.ward?.name || "",
                firstname: $scope.newUser.firstname,
                lastname: $scope.newUser.lastname,
                phone: $scope.newUser.phone
            };

            Swal.fire({
                title: 'Processing...',
                text: 'Please wait while we register the user',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            $http.post('http://localhost:8080/api/v1/auth/register', payload).then(function (response) {
                Swal.close();

                // Reset form
                $scope.newUser = {};
                $scope.registerForm.$setPristine();
                $scope.registerForm.$setUntouched();
                $scope.submitted = false;



                loadUsers(); // `ngRepeatFinished` sẽ tự init lại bảng

                Swal.fire({
                    icon: 'success',
                    title: 'User registered successfully!',
                    showConfirmButton: false,
                    timer: 2000
                });
            }, function (error) {
                Swal.close();
                console.error("Registration failed:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Registration failed',
                    text: error.data?.message || 'An unexpected error occurred'
                });
            });
        }
    };

    // Load dữ liệu ban đầu
    loadUsers();
});
