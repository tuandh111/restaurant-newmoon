// $(document).ready(function () {
//     $('#example').DataTable({
//         paging: true,
//         searching: true,
//         ordering: true,
//         lengthChange: true,
//         pageLength: 5,
//         lengthMenu: [5, 10, 25, 50],
//         responsive: true
//     });
// });

app.controller('RoleController', function ($scope, $http,API_BASE_URL) {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    console.log(JSON.parse(userData).role.roleName)
    if (!token || !userData) {
        $window.location.href = 'index.html'; // Redirect nếu chưa đăng nhập
        return;
    }

    $scope.currentUser = JSON.parse(userData);
    $scope.userRole = $scope.currentUser.role.roleName.toLowerCase();
    $scope.canAccess = function (department) {
        return $scope.userRole === 'admin' || $scope.userRole === department;
    };


    $scope.logout = function () {
        Swal.fire({
            title: 'Logging out...',
            didOpen: () => {
                Swal.showLoading();
            },
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false
        });

        setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            $window.location.href = 'index.html';
        }, 1200); // Đợi 1.2 giây rồi chuyển trang cho mượt
    };
    $scope.role = {
        roleName: '',
        description: ''
    };

    $scope.submitForm = function () {
        if (!$scope.role.roleName) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Role Name',
                text: 'Please enter a role name.'
            });
            return;
        }

        $http.post(API_BASE_URL + '/role', {
            roleName: $scope.role.roleName,
            description: $scope.role.description
        }).then(function (response) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Role added successfully!'
            });
            console.log(response.data);
            $scope.role = {};
            $scope.loadRoles();
        }, function (error) {
            Swal.fire({
                icon: 'error',
                title: 'Failed!',
                text: 'Failed to add role.'
            });
            console.error(error);
        });
    };

    $scope.loadRoles = function () {
        $http.get(API_BASE_URL + '/role')
            .then(function (response) {
                $scope.roles = response.data;
            }, function (error) {
                console.error('Error loading roles:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to load roles.'
                });
            });
    };

    $scope.loadRoles();

    $scope.deleteRole = function (id) {
        Swal.fire({
            title: 'Are you sure?',
            text: "This role will be permanently deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        }).then((result) => {
            if (result.isConfirmed) {
                $http.delete(API_BASE_URL + '/role/' + id)
                    .then(function (response) {
                        Swal.fire(
                            'Deleted!',
                            'The role has been deleted successfully.',
                            'success'
                        );
                        $scope.loadRoles();
                    })
                    .catch(function (error) {
                        Swal.fire(
                            'Error!',
                            'Failed to delete the role. Please try again.',
                            'error'
                        );
                    });
            } else {
                Swal.fire(
                    'Cancelled',
                    'The role was not deleted.',
                    'info'
                );
            }
        });
    };

    $scope.selectedRole = {};

    $scope.viewRole = function (role) {
        $scope.selectedRole = angular.copy(role);
    };

    $scope.editedRole = {};

    $scope.editRole = function (role) {
        $scope.editedRole = angular.copy(role);
    };

    $scope.saveEdit = function () {
        $http.put(API_BASE_URL + '/role/' + $scope.editedRole.roleId, $scope.editedRole)
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Role updated successfully!'
                });
                $('#editModal').modal('hide');
                $scope.loadRoles();
            })
            .catch(function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Update failed!',
                    text: 'Failed to update role. Please try again.'
                });
                console.error('Update failed:', error);
            });
    };

    $scope.permissions = {
        add_user: false,
        edit_user: false,
        delete_user: false,
        view_user: true,
        approve_employee: false,
        export_employee: false
    };

    $scope.clearPermissions = function () {
        for (var key in $scope.permissions) {
            if ($scope.permissions.hasOwnProperty(key)) {
                $scope.permissions[key] = false;
            }
        }
        Swal.fire({
            icon: 'info',
            title: 'Permissions cleared!',
            text: 'All permissions have been reset.'
        });
    };
});
