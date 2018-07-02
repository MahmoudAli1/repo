'use strict';

angular.module('app.statistics').directive('totalDeliverySpeedAndDriverEvalBarChart', function () {
    return {
        restrict: 'A',
        scope: {
            statistics: "="
        },
        link: function (scope, element, attributes) {

            var barOptions = {
                //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
                scaleBeginAtZero : true,
                //Boolean - Whether grid lines are shown across the chart
                scaleShowGridLines : true,
                //String - Colour of the grid lines
                scaleGridLineColor : "rgba(0,0,0,.05)",
                //Number - Width of the grid lines
                scaleGridLineWidth : 1,
                //Boolean - If there is a stroke on each bar
                barShowStroke : true,
                //Number - Pixel width of the bar stroke
                barStrokeWidth : 1,
                //Number - Spacing between each of the X value sets
                barValueSpacing : 5,
                //Number - Spacing between data sets within X values
                barDatasetSpacing : 1,
                //Boolean - Re-draw chart on page resize
                responsive: true,
                //String - A legend template
                legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
            }


            //chart object
            var chart;
            //getting evaluation arrays
            var deliverySpeedEvaluation;
            var driverEvaluation;

            scope.$watch('statistics', function(){
                if(scope.statistics !== undefined){
                    
                    deliverySpeedEvaluation = scope.statistics.deliverySpeedEvaluation;
                    driverEvaluation = scope.statistics.driverEvaluation;
                    populateChart();
                }
            });
            
            function populateChart(){
                var barData = {
                    labels: ["5-Star", "4-Star", "3-Star", "2-Star", "1-Star"],
                    datasets: [
                        {
                            label: "Delevery Speed Evaluation",
                            fillColor: "rgba(151,205,170,0.7)",
                            strokeColor: "rgba(151,205,170,1)",
                            highlightFill: "rgba(151,205,170,0.95)",
                            highlightStroke: "rgba(151,205,170,1)",
                            data: [deliverySpeedEvaluation['5'],deliverySpeedEvaluation['4'],deliverySpeedEvaluation['3'],deliverySpeedEvaluation['2'],deliverySpeedEvaluation['1']]
                        },
                        {
                            label: "Driver Evaluation",
                            fillColor: "rgba(151,187,205,0.7)",
                            strokeColor: "rgba(151,187,205,1)",
                            highlightFill: "rgba(151,187,205,0.95)",
                            highlightStroke: "rgba(151,187,205,1)",
                            data: [driverEvaluation['5'], driverEvaluation['4'], driverEvaluation['3'], driverEvaluation['2'], driverEvaluation['1']]
                        }
                    ],
                    options:{
                        legend:{
                            display: true,
                            position: 'bottom',
                            fullWidth:true,
                            labels:{
                                boxWidth:30 //Width legend colorbox
                            }
                        }
                    }
                };

                var ctx = element[0].getContext("2d");
                element[0].width = element[0].width;
                //destroy chart when exists to avoid duplicates
                if(chart !== undefined){
                    chart.destroy();
                }
                chart = new Chart(ctx).Bar(barData, barOptions);
            }

            
        }
    }
});