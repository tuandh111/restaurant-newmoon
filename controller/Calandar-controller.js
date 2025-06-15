app.controller('CalendarController', function ($scope, $http, $window, API_BASE_URL,$timeout) {
    // Toastify helper
        $timeout(function () {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    height: 'auto'
    // ❌ Không cần plugins nếu bạn dùng bản bundle (main.min.js)
  });
  calendar.render();
}, 0);

});
