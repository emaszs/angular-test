var app = angular.module('CRABMonitor', []);

//app.controller('DataController', ['$scope', '$http', function ($scope, $http) {
//
//    $http.get('https://mmascher-mon.cern.ch/crabserver/dev/task?subresource=search&workflow=150709_073704:erupeika_crab_tutorial_May2015_MC_analysis').success(function(data) {
//	$scope.taskName = data.result[0];
//	$scope.data = data;
//	        //$scope.task = JSON.parse(data);
//        //this.task = response.data.result[0];
//        console.log(data.result[0]);
//    })
//}]);

app.controller('TaskSearchController', ['$scope', '$http', function ($scope, $http) {
    $scope.data = {};
    $scope.searchTaskInfo = function () {
        console.log("success");
        // Retrieves task information from the api.
        // In case of error (such as when something wasn't found), null the data and set receivedError to true
        if ($scope.searchPhrase) {
            $http.get('https://mmascher-mon.cern.ch/crabserver/dev/task?subresource=search&workflow=' +
                $scope.searchPhrase).success(function (data) {
                $scope.data = data;
                console.log(data.result[0]);
                $scope.receivedError = false;
                $scope.displayTable = true;
            }).
            error(function () {
                $scope.data = {};
                $scope.receivedError = true;
                $scope.displayTable = false;
            });
            //        $http({
            //            url:'https://mmascher-mon.cern.ch/crabserver/dev/task?subresource=search&workflow='
            //            method: "GET",
            //            params:
            //        })
        }
    }


}]);
