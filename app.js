var app = angular.module("myApp", ["ngRoute"]);
app.constant('API_BASE_URL', 'https://api.newmoon.vn/api/v1/auth');

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

