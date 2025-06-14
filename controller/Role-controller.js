app.controller('RoleController', function ($scope, $http, $window, API_BASE_URL) {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
        $window.location.href = 'index.html';
        return;
    }

    $scope.currentUser = JSON.parse(userData);
    $scope.userRole = $scope.currentUser.role.roleName.toLowerCase();

    $scope.canAccess = function (department) {
        return $scope.userRole === 'admin' || $scope.userRole === department;
    };

    // Toastify helper
    $scope.showToast = function (text, type = 'info') {
        let bgColor = '#17a2b8'; // info
        if (type === 'success') bgColor = '#28a745';
        if (type === 'error') bgColor = '#dc3545';
        if (type === 'warning') bgColor = '#ffc107';

        Toastify({
            text: text,
            duration: 3000,
            gravity: "top",
            position: "center",
            style: {
                background: bgColor,
                color: type === 'warning' ? 'black' : 'white',
                fontWeight: 'bold'
            }
        }).showToast();
    };

    $scope.logout = function () {
        $scope.showToast('Logging out...', 'info');
        setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            $window.location.href = 'index.html';
        }, 1200);
    };

    $scope.role = {
        roleName: '',
        description: ''
    };

    $scope.submitForm = function () {
        $scope.userForm.roleName.$setTouched();

        // Nếu input rỗng → báo lỗi
        if (!($scope.role.roleName && $scope.role.roleName.trim())) {
            $scope.showToast('❌ Please enter a role name.', 'error');
            return;
        }


        $http.post(API_BASE_URL + '/role', $scope.role).then(function (response) {
            $scope.showToast('✅ Role added successfully!', 'success');
               $scope.role = {}; // Clear input model

        // ✅ Reset trạng thái của form
        $scope.userForm.$setPristine();
        $scope.userForm.$setUntouched();
            $scope.loadRoles();
        }, function () {
            $scope.showToast('❌ Failed to add role.', 'error');
        });
    };

    $scope.loadRoles = function () {
        $http.get(API_BASE_URL + '/role').then(function (response) {
            $scope.roles = response.data;
        }, function () {
            $scope.showToast('❌ Failed to load roles.', 'error');
        });
    };

    $scope.loadRoles();

    $scope.deleteRole = function (id) {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this role? This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                $http.delete(API_BASE_URL + '/role/' + id).then(function () {
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'The role has been deleted successfully.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    $scope.loadRoles();
                }).catch(function () {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Failed to delete the role. Please try again later.',
                        timer: 2500,
                        showConfirmButton: false
                    });
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    icon: 'info',
                    title: 'Cancelled',
                    text: 'The role was not deleted.',
                    timer: 2000,
                    showConfirmButton: false
                });
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
            .then(function () {
                $scope.showToast('✅ Role updated successfully!', 'success');
                $('#editModal').modal('hide');
                $scope.loadRoles();
            })
            .catch(function () {
                $scope.showToast('❌ Failed to update role.', 'error');
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
        $scope.showToast('ℹ️ All permissions have been reset.', 'info');
    };
});
