var app = angular.module('myApp', []);

// Directive: Gọi sự kiện khi ng-repeat render xong
// app.directive('onFinishRender', function ($timeout) {
//     return {
//         restrict: 'A',
//         link: function (scope, element, attr) {
//             if (scope.$last === true) {
//                 $timeout(function () {
//                     scope.$emit(attr.onFinishRender);
//                 });
//             }
//         }
//     };
// });

app.controller('UserController', function ($scope, $http, $timeout) {
    $scope.users = [];
    $scope.roles = [];
    $scope.newUser = {};
    $scope.provinces = [];
    $scope.districts = [];
    $scope.wards = [];
    $scope.submitted = false;

    $scope.filteredUsers = []
    function loadUsers() {
        $http.get('http://localhost:8080/api/v1/auth/users').then(function (response) {
            $scope.users = response.data;
            $scope.filteredUsers = $scope.users
            // Không cần gọi lại DataTable ở đây
        }, function (error) {
            console.error("Error loading users:", error);
        });
    }
    $scope.applyFilters = function () {
        const search = $scope.searchText?.toLowerCase() || '';
        const roleFilter = $scope.selectedRole;
        const statusFilter = $scope.selectedStatus;
        const provinceFilter = $scope.selectedProvince;

        $scope.filteredUsers = $scope.users.filter(user => {
            const matchSearch =
                user.firstname?.toLowerCase().includes(search) ||
                user.lastname?.toLowerCase().includes(search) ||
                user.email?.toLowerCase().includes(search) ||
                user.phone?.toLowerCase().includes(search) ||
                user.province?.toLowerCase().includes(search);

            const matchRole = !roleFilter || user.role?.id == roleFilter;
            const matchStatus = statusFilter === '' || user.isActive == (statusFilter === 'active');
            const matchProvince = !provinceFilter || user.province == provinceFilter;

            return matchSearch && matchRole && matchStatus && matchProvince;
        });
    };

    // Load roles
    $scope.loadRoles = function () {
        $http.get('http://localhost:8080/api/v1/auth/role')
            .then(function (response) {
                $scope.roles = response.data;

                // Đảm bảo AngularJS cập nhật binding
                if (!$scope.$$phase) {
                    $scope.$applyAsync(); // Kích hoạt digest cycle nếu chưa có
                }

                console.log("Roles reloaded:", $scope.roles);
            }, function (error) {
                console.error('Error loading roles:', error);
            });
    };

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
                phone: $scope.newUser.phone,
                status:$scope.newUser.isActive
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
                }).then(() => {
                    window.location.href = 'Employee.html';
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
    //view user
    $scope.viewUser = function (user) {
        $scope.selectedUser = user;

        // Hiển thị modal bootstrap (nếu không dùng data-bs-toggle)
        const modalElement = document.getElementById('viewModal');
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();
    };






    // save role 
    $scope.role = {
        roleName: '',
        description: ''
    };

    $scope.submitForm = function () {
        $http.post('http://localhost:8080/api/v1/auth/role', {
            roleName: $scope.role.roleName,
            description: $scope.role.description
        }).then(function (response) {
            // Reset form
            Swal.fire({
                icon: 'success',
                title: 'User added successfully!',
                showConfirmButton: false,
                timer: 2000
            }).then(() => {
                $scope.loadRoles();
            });

        }, function (error) {
            alert('Thêm role thất bại!');
            console.error(error);
        });
    };


    // Load dữ liệu ban đầu
    loadUsers();
    $scope.loadRoles();

});
