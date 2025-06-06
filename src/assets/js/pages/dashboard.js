/**
 * Theme: Raydar- Responsive Bootstrap 5 Admin Dashboard
 * Author: Techzaa
 * Module/App: Dashboard
 */

//
// Conversions
// 
var options = {
    chart: {
        height: 240,
        type: 'donut',
    }, 
    series: [44.25, 52.68, 45.98],
    legend: {
        show: false
    },
    stroke: {
        width: 0
    },
    plotOptions: {
        pie: {
            donut: {
                size: '70%',
                labels: {
                    show: false,
                    total: {
                        showAlways: true,
                        show: true
                    }
                }
            }
        }
    },
    labels: ["Direct", "Affilliate", "Sponsored"],
    colors: ["#1e84c4", "#ed5565", "#7dcc93"],
    dataLabels: {
        enabled: false
    },
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            }
        }
    }],
    fill: {
        type: 'gradient'
    }
}
var chart = new ApexCharts(
    document.querySelector("#conversions"),
    options
);
chart.render();


//
//Sales Report -chart
//
var options = {
    series: [{
            name: "Revenue",
            type: "bar",
            data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
        },
        {
            name: "Visits",
            type: "area",
            data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35],
        },
        {
            name: "Orders",
            type: "area",
            data: [12, 16, 11, 22, 28, 25, 15, 29, 35, 45, 42, 48],
        }
    ],
    chart: {
        height: 327,
        type: "line",
        toolbar: {
            show: false,
        },
    },
    stroke: {
        dashArray: [0, 0, 2],
        width: [0, 2, 2],
        curve: 'smooth'
    },
    fill: {
        opacity: [1, 1, 1],
        type: ['solid','gradient','gradient'],
        gradient: {
            type: "vertical",
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90]
        },
    },
    markers: {
        size: [0, 0],
        strokeWidth: 2,
        hover: {
            size: 4,
        },
    },
    xaxis: {
        categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        axisTicks: {
            show: false,
        },
        axisBorder: {
            show: false,
        },
    },
    yaxis: {
        min: 0,
        axisBorder: {
            show: false,
        }
    },
    grid: {
        show: true,
        strokeDashArray: 3,
        xaxis: {
            lines: {
                show: false,
            },
        },
        yaxis: {
            lines: {
                show: true,
            },
        },
        padding: {
            top: 0,
            right: -2,
            bottom: 0,
            left: 10,
        },
    },
    legend: {
        show: true,
        horizontalAlign: "center",
        offsetX: 0,
        offsetY: 5,
        markers: {
            width: 9,
            height: 9,
            radius: 6,
        },
        itemMargin: {
            horizontal: 10,
            vertical: 0,
        },
    },
    plotOptions: {
        bar: {
            columnWidth: "30%",
            barHeight: "70%",
            borderRadius: 3,
        },
    },
    colors: ["#4697ce", "#7dcc93","#f0934e"],
    tooltip: {
        shared: true,
        y: [{
                formatter: function (y) {
                    if (typeof y !== "undefined") {
                        return y.toFixed(1) + "k";
                    }
                    return y;
                },
            },
            {
                formatter: function (y) {
                    if (typeof y !== "undefined") {
                        return y.toFixed(1) + "k";
                    }
                    return y;
                },
            },
        ],
    },
}

var chart = new ApexCharts(
    document.querySelector("#dash-performance-chart"),
    options
);

chart.render();