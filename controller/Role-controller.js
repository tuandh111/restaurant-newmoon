app.controller('RoleController', function ($scope, $http, $window, API_BASE_URL) {
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
    $scope.role = {
        roleName: '',
        description: ''
    };
    $scope.filterRole = function (role) {
        if (!$scope.searchText) return true;

        const keyword = $scope.searchText.toLowerCase();

        return (
            role.roleName?.toLowerCase().includes(keyword) ||
            role.description?.toLowerCase().includes(keyword) ||
            (role.deleted ? 'đã xoá' : 'đang hoạt động').toLowerCase().includes(keyword)
        );
    };
    $scope.getFilteredRoles = function () {
        if (!$scope.searchText) return $scope.roles;

        const keyword = $scope.searchText.toLowerCase();

        return $scope.roles.filter(role =>
            role.roleName?.toLowerCase().includes(keyword) ||
            role.description?.toLowerCase().includes(keyword) ||
            (role.deleted ? 'đã xoá' : 'đang hoạt động').toLowerCase().includes(keyword)
        );
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

    $scope.deleteRole = function (role) {
        const id = role.roleId
        const roleName = role.roleName.toLowerCase();

        // Các role không được phép xóa
        const protectedRoles = ['admin', 'marketing', 'it', 'hr', 'accounting', 'operations'];

        if (protectedRoles.includes(roleName)) {
            $scope.showToast(`❌ "${roleName}" is a system default role and cannot be deleted.`, 'error');
            return;
        }
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
    $scope.isProtectedRole = function (roleName) {
        const protectedRoles = ['admin', 'marketing', 'it', 'hr', 'accounting', 'operations'];
        return protectedRoles.includes(roleName?.toLowerCase());
    };

    $scope.saveEdit = function () {
        const protectedRoles = ['admin', 'marketing', 'it', 'hr', 'accounting', 'operations'];
        const originalRole = $scope.roles.find(r => r.roleId === $scope.editedRole.roleId);

        // Nếu là role mặc định và roleName bị thay đổi
        if (protectedRoles.includes(originalRole.roleName.toLowerCase()) &&
            $scope.editedRole.roleName.toLowerCase() !== originalRole.roleName.toLowerCase()) {
            $scope.showToast('❌ You cannot rename a system default role.', 'error');
            return;
        }
        $http.put(API_BASE_URL + '/role/' + $scope.editedRole.roleId, $scope.editedRole)
            .then(function () {
                $scope.showToast('✅ Role updated successfully!', 'success');
                const modalElement = document.getElementById('editModal');
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) {
                    modalInstance.hide();
                }

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


    // Export to PDF (Không có cột Setting)
    $scope.exportRolesToPDF = function () {
        const filteredRoles = $scope.getFilteredRoles();

        const body = [
            [
                { text: 'STT', bold: true },
                { text: 'Name', bold: true },
                { text: 'Description', bold: true },
                { text: 'Status', bold: true }
            ]
        ];

        filteredRoles.forEach((role, index) => {
            body.push([
                index + 1,
                role.roleName,
                role.description,
                role.deleted ? 'Inactive' : 'Active'
            ]);
        });

        const docDefinition = {
            content: [
                { text: 'Role List', style: 'header' },
                {
                    table: {
                        headerRows: 1,
                        widths: [30, 100, '*', 60],
                        body: body
                    },
                    layout: {
                        fillColor: (rowIndex) => rowIndex === 0 ? '#CCCCCC' : null
                    }
                }
            ],
            styles: {
                header: {
                    fontSize: 16,
                    bold: true,
                    marginBottom: 10
                }
            },
            defaultStyle: {
                fontSize: 9
            },
            pageOrientation: 'landscape'
        };

        pdfMake.createPdf(docDefinition).download('Role_List.pdf');
    };


    // Export to Excel (Không có cột Setting)
    $scope.exportRolesToExcel = function () {
        const filteredRoles = $scope.getFilteredRoles();

        const ws_data = [['STT', 'Name', 'Description', 'Status']];

        filteredRoles.forEach((role, index) => {
            ws_data.push([
                index + 1,
                role.roleName,
                role.description,
                role.deleted ? 'Inactive' : 'Active'
            ]);
        });

        const worksheet = XLSX.utils.aoa_to_sheet(ws_data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Roles');
        XLSX.writeFile(workbook, 'Role_List.xlsx');
    };

    $scope.printRoleTable = function () {
        const filteredRoles = $scope.getFilteredRoles();

        let tableHtml = `
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;

        filteredRoles.forEach((role, index) => {
            tableHtml += `
            <tr>
                <td>${index + 1}</td>
                <td>${role.roleName}</td>
                <td>${role.description}</td>
                <td>${role.deleted ? 'Ngưng hoạt động' : 'Đang hoạt động'}</td>
            </tr>
        `;
        });

        tableHtml += `
            </tbody>
        </table>
    `;

        const win = window.open('', '', 'width=1024,height=768');
        win.document.write(`
        <html>
        <head>
            <title>Role Table</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { padding: 20px; font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #dee2e6; padding: 8px; text-align: left; }
                th { background-color: #f8f9fa; }
            </style>
        </head>
        <body>
            <h3 class="text-center">Role List</h3>
            ${tableHtml}
        </body>
        </html>
    `);
        win.document.close();
        win.print();
    };




});
