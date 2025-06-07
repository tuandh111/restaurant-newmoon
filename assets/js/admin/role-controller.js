$(document).ready(function () {
    $('#example').DataTable({
        paging: true,
        searching: true,
        ordering: true,
        lengthChange: true, // ✅ Hiển thị combobox chọn số dòng
        pageLength: 5,
        lengthMenu: [5, 10, 25, 50],
        responsive: true
    });
});
var app = angular.module('myApp', []);
app.controller('RoleController', function ($scope, $http) {
    console.log("RoleController")
    $scope.role = {
        roleName: '',
        description: ''
    };

    $scope.submitForm = function () {
        // Gửi POST request đến Spring Boot API
        $http.post('http://localhost:8080/api/v1/auth/role', {
            roleName: $scope.role.roleName,
            description: $scope.role.description
        }).then(function (response) {
            alert('Thêm role thành công!');
            console.log(response.data);
            // Xóa form sau khi thành công
            $scope.role = {};
        }, function (error) {
            alert('Thêm role thất bại!');
            console.error(error);
        });
    };
    $scope.loadRoles = function () {
        $http.get('http://localhost:8080/api/v1/auth/role')
            .then(function (response) {
                $scope.roles = response.data;
            }, function (error) {
                console.error('Error loading roles:', error);
            });
    };

    // Gọi ngay khi controller khởi tạo
    $scope.loadRoles();

    // Hàm xóa (tuỳ chọn)
    $scope.deleteRole = function (id) {
        if (confirm('Are you sure you want to delete this role?')) {
            $http.delete('http://localhost:8080/api/v1/auth/role/' + id)
                .then(function (response) {
                    alert('Deleted successfully!');
                    $scope.loadRoles(); // Refresh lại danh sách
                }, function (error) {
                    alert('Delete failed!');
                });
        }
    };

    $scope.selectedRole = {};

    $scope.viewRole = function (role) {
        $scope.selectedRole = angular.copy(role);
    };



    //edit role
    $scope.editedRole = {}; // Khởi tạo biến

    $scope.editRole = function (role) {
        $scope.editedRole = angular.copy(role); // Gán bản sao để chỉnh sửa
    };

    $scope.saveEdit = function () {
        console.table($scope.editedRole)
        // Gọi API hoặc xử lý cập nhật tại đây
        $http.put('http://localhost:8080/api/v1/auth/role/' + $scope.editedRole.roleId, $scope.editedRole)
            .then(function (response) {
                alert('Updated successfully!');
                $('#editModal').modal('hide'); // Đóng modal (jQuery Bootstrap)
                $scope.loadRoles(); // Reload danh sách (nếu có hàm loadRoles)
            })
            .catch(function (error) {
                console.error('Update failed:', error);
            });
    };



    //clear checkbox
    $scope.permissions = {
        add_user: false,
        edit_user: false,
        delete_user: false,
        view_user: true, // mặc định được check
        approve_employee: false,
        export_employee: false
    };

    $scope.clearPermissions = function () {
        // Reset tất cả về false
        for (var key in $scope.permissions) {
            if ($scope.permissions.hasOwnProperty(key)) {
                $scope.permissions[key] = false;
            }
        }
    };
});