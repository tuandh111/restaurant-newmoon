var app = angular.module("myApp", ["ngRoute"]);
app.constant('API_BASE_URL', 'https://api.newmoon.vn/api/v1/auth');
//app.constant('API_BASE_URL', 'http://localhost:8080/api/v1/auth');

app.factory('ApiService', function ($http, API_BASE_URL) {
    return {
        call: async function (endpoint, method = 'GET', data = null) {
            try {
                const config = {
                    method: method,
                    url: `${API_BASE_URL}${endpoint}`,
                    data: data
                };
                const response = await $http(config);
                return response.data;
            } catch (error) {
                console.error('API error:', error);
                throw error;
            }
        }
    };
});
app.factory('ToastService', function () {
    return {
        show: function (message, type = 'info') {
            const duration = 3000;
            let bgColor = '#17a2b8'; // info
            if (type === 'success') bgColor = '#28a745';
            if (type === 'error') bgColor = '#dc3545';
            if (type === 'warning') bgColor = '#ffc107';

            Toastify({
                text: message,
                duration: duration,
                close: true,
                gravity: "top",
                position: "center",
                style: {
                    background: bgColor,
                    color: type === 'warning' ? 'black' : 'white',
                    fontWeight: 'bold'
                }
            }).showToast();

            return new Promise(resolve => setTimeout(resolve, duration));
        }
    };
});

// Cấu hình routing
app.config(function ($routeProvider) {
    $routeProvider
        // Dashboards
        .when("/", {
            templateUrl: "views/index.html",
            controller: "MainController"
        })
        .when("/Dashboard-analytics", {
            templateUrl: "views/Dashboard-analytics.html",
            controller: "AnalyticsController"
        })
        .when("/Calendar", {
            templateUrl: "views/Calendar.html",
            controller: "CalendarController"
        })
        .when("/Profile", {
            templateUrl: "views/Profile.html",
            controller: "ProfileController"
        })
        // Marketing
        .when("/MarketingCampaigns", {
            templateUrl: "views/MarketingCampaigns.html",
            controller: "MarketingCampaignsController"
        })
        .when("/ContentManager", {
            templateUrl: "views/ContentManager.html",
            controller: "ContentManagerController"
        })
        .when("/SocialMedia", {
            templateUrl: "views/SocialMedia.html",
            controller: "SocialMediaController"
        })

        // Accounting
        .when("/Invoices", {
            templateUrl: "views/Invoices.html",
            controller: "InvoicesController"
        })
        .when("/Payments", {
            templateUrl: "views/Payments.html",
            controller: "PaymentsController"
        })
        .when("/FinancialReports", {
            templateUrl: "views/FinancialReports.html",
            controller: "FinancialReportsController"
        })

        // Operations
        .when("/OperationsDashboard", {
            templateUrl: "views/OperationsDashboard.html",
            controller: "OperationsDashboardController"
        })
        .when("/WarehouseManagement", {
            templateUrl: "views/WarehouseManagement.html",
            controller: "WarehouseManagementController"
        })
        .when("/TaskTracking", {
            templateUrl: "views/TaskTracking.html",
            controller: "TaskTrackingController"
        })

        // Human Resources
        .when("/EmployeeRecords", {
            templateUrl: "views/EmployeeRecords.html",
            controller: "EmployeeRecordsController"
        })
        .when("/Recruitment", {
            templateUrl: "views/Recruitment.html",
            controller: "RecruitmentController"
        })
        .when("/Attendance", {
            templateUrl: "views/Attendance.html",
            controller: "AttendanceController"
        })
        .when("/Employee", {
            templateUrl: "views/Employee.html",
            controller: "EmployeeController"
        })
        .when("/Role", {
            templateUrl: "views/Role.html",
            controller: "RoleController"
        })

        // IT Management
        .when("/SystemMonitoring", {
            templateUrl: "views/SystemMonitoring.html",
            controller: "SystemMonitoringController"
        })
        .when("/SupportTickets", {
            templateUrl: "views/SupportTickets.html",
            controller: "SupportTicketsController"
        })
        .when("/AssetManagement", {
            templateUrl: "views/AssetManagement.html",
            controller: "AssetManagementController"
        })

        // Fallback
        .otherwise({
            redirectTo: "/"
        });
});
function setActive(element) {
    const links = document.querySelectorAll('.sub-nav-link');
    links.forEach(link => link.classList.remove('active'));

    element.classList.add('active');

    // 👉 Lưu vào sessionStorage
    const targetHref = element.getAttribute('href');
    sessionStorage.setItem('activeNav', targetHref);
}

// 👉 Khi load lại trang, khôi phục trạng thái active
window.addEventListener('DOMContentLoaded', function () {
    const saved = sessionStorage.getItem('activeNav');
    if (saved) {
        const target = document.querySelector(`.sub-nav-link[href="${saved}"]`);
        if (target) {
            target.classList.add('active');

            // 👉 Lấy phần sau dấu # (bỏ ! nếu có)
            const id = saved.replace('#!', '').replace('#', '');
            const section = document.getElementById(id);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
});

