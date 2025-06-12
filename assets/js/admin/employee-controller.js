var app = angular.module('myApp', []);
app.controller('UserController', function ($scope, $http, $timeout) {
    const apiBaseUrl = 'http://localhost:8080/api/v1/auth';
    $scope.users = [];
    $scope.roles = [];
    $scope.newUser = {};
    $scope.provinces = [];
    $scope.districts = [];
    $scope.wards = [];
    $scope.submitted = false;
    $scope.filteredUsers = [];
    $scope.filterRole = null;
    $scope.filteredUsers = [];
    $scope.filteredList = [];
    function loadUsers() {
        $http.get(apiBaseUrl + '/users').then(function (response) {
            $scope.users = response.data;
            $scope.filteredUsers = angular.copy($scope.users);
            $scope.applyFilters();
        }, function (error) {
            console.error("Error loading users:", error);
        });
    }

    $scope.initUsers = function (data) {
        $scope.users = data;
        $scope.filteredUsers = angular.copy(data);
        $scope.filteredList = angular.copy(data);
    };
    $scope.applyFilters = function () {
        const searchText = ($scope.searchText || "").toLowerCase();
        $scope.filteredList = $scope.filteredUsers.filter(function (user) {
            const matchSearch =
                user.role.roleName.toLowerCase().includes(searchText) ||
                user.province.toLowerCase().includes(searchText) ||
                user.district.toLowerCase().includes(searchText) ||
                user.ward.toLowerCase().includes(searchText) ||
                user.lastname.toLowerCase().includes(searchText) ||
                user.firstname.toLowerCase().includes(searchText) ||
                user.email.toLowerCase().includes(searchText) ||
                user.phone.toLowerCase().includes(searchText);
            const matchRole = !$scope.filterRole || user.role.roleId == $scope.filterRole;
            const matchStatus = !$scope.filterStatus || user.status.toString() == $scope.filterStatus;
            const matchProvince = !$scope.filterProvince || user.province.toLowerCase() == $scope.filterProvince.name.toLowerCase();
            const matchDistrict = !$scope.filterDistrict || user.district.toLowerCase() == $scope.filterDistrict.name.toLowerCase();
            const matchWard = !$scope.filterWard || user.ward.toLowerCase() == $scope.filterWard.name.toLowerCase();
            return matchSearch && matchRole && matchStatus && matchProvince && matchDistrict && matchWard;
        });
    };


    // Load roles
    $scope.loadRoles = function () {
        $http.get(apiBaseUrl + '/role')
            .then(function (response) {
                $scope.roles = response.data;
                console.log($scope.roles)
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
                status: $scope.newUser.isActive
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
            $http.post(apiBaseUrl + '/register', payload).then(function (response) {
                Swal.close();
                console.log("ok", response.data.message)
                if (response.data.message === "ErrorEmail") {
                    $scope.emailExists = true;
                    return;
                }

                // Nếu không có lỗi
                $scope.emailExists = false;
                $scope.newUser = {};
                $scope.registerForm.$setPristine();
                $scope.registerForm.$setUntouched();
                $scope.submitted = false;

                Swal.fire({
                    icon: 'success',
                    title: 'User registered successfully!',
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    location.reload();
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
        const modalElement = document.getElementById('viewModal');
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();
    };
    //cập nhật userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
    $scope.selectUser = function (user) {
        $scope.newUser = angular.copy(user);
        $scope.newUser.isActive = user.status;
        if (user.role && user.role.roleId) {
            $scope.newUser.roleId = user.role.roleId;
        }
        $scope.newUser.province = $scope.provinces.find(p => p.name === user.province);
        $scope.onProvinceChange();
        setTimeout(function () {
            $scope.newUser.district = $scope.districts.find(d => d.name === user.district);
            $scope.onDistrictChange();

            setTimeout(function () {
                $scope.newUser.ward = $scope.wards.find(w => w.name === user.ward);

                $scope.$apply();
            }, 100);
        }, 100);
    };
    $scope.updateUser = function () {
        $scope.submitted = true;

        if ($scope.registerForm.$invalid) {
            return;
        }
        const payload = {
            id: $scope.newUser.id,
            email: $scope.newUser.email,
            firstname: $scope.newUser.firstname,
            lastname: $scope.newUser.lastname,
            phone: $scope.newUser.phone,
            province: $scope.newUser.province?.name || $scope.newUser.province || '',
            district: $scope.newUser.district?.name || $scope.newUser.district || '',
            ward: $scope.newUser.ward?.name || $scope.newUser.ward || '',
            roleId: $scope.newUser.roleId || 0,
            status: !!$scope.newUser.status
        };
        $http.post(apiBaseUrl + '/update-user', payload)
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'User updated successfully!',
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    loadUsers();
                    $scope.loadRoles();
                });
            })
            .catch(function (error) {
                console.error('Update failed:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred while updating the user.'
                });
            });
    };
    //cập nhật userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
    //delete userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
    $scope.deleteUser = function (userId) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        }).then((result) => {
            if (result.isConfirmed) {
                $http.delete(apiBaseUrl + '/delete-by-user-id/' + userId)
                    .then(function (response) {
                        Swal.fire(
                            'Deleted!',
                            'The user has been deleted.',
                            'success'
                        );
                        loadUsers();
                        $scope.loadRoles();
                    })
                    .catch(function (error) {
                        Swal.fire(
                            'Error!',
                            'There was an issue deleting the user.',
                            'error'
                        );
                    });
            } else {
                Swal.fire(
                    'Cancelled',
                    'The user was not deleted.',
                    'info'
                );
            }
        });
    };
    //delete userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
    // save role 
    $scope.role = {
        roleName: '',
        description: ''
    };

    //filter
    $scope.onProvinceChangeFilter = function () {
        const provinceCode = $scope.filterProvince?.code;
        $scope.districts = [];
        $scope.filterDistrict = null;
        $scope.wards = [];
        $scope.filterWard = null;
        if (!provinceCode) return;
        $http.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`).then(function (response) {
            console.log("ok rồi nhé", response.data.districts)
            $scope.districts = response.data.districts;
            $scope.newUser.district = null;
            $scope.wards = [];
            $scope.newUser.ward = null;
        });
    };
    // Khi chọn huyện
    $scope.onDistrictChangeFilter = function () {
        const districtCode = $scope.filterDistrict?.code;
        $scope.wards = [];
        $scope.filterWard = null;
        if (!districtCode) return;
        $http.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`).then(function (response) {
            $scope.wards = response.data.wards;
            $scope.newUser.ward = null;
        });
    };




    $scope.resetEmailError = function () {
        $scope.emailExists = false;
    };
    // Load dữ liệu ban đầu
    loadUsers();
    $scope.loadRoles();

});
