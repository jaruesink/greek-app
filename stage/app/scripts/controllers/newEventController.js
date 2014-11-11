    App.controller('newEventController', function($scope, $http, $rootScope, Load, $timeout, localStorageService) {
        routeChange();
        Load.then(function(){
            $rootScope.requirePermissions(LEADERSHIP);
            $scope.event = {};
            $scope.event.tag = '';
            $scope.tags = $rootScope.tags;
            $scope.$watch('event.tag', function() {
                if (!$scope.event)
                    $scope.unavailable = false;
                $scope.event.tag = $scope.event.tag.replace(/\s+/g,'');
                $scope.unavailable = false;
                $scope.available = false;
            });
            $http.post(ENDPOINTS_DOMAIN + '/_ah/api/netegreek/v1/message/get_tags', packageForSending(''))
                .success(function(data){
                    if (!checkResponseErrors(data)){
                        $scope.tags = JSON.parse(data.data);
                        $rootScope.tags = JSON.parse(data.data);
                        localStorageService.set('tags', $rootScope.tags);
                    }
                    else{
                        console.log("error: ", data.error)
                    }
                })
                .error(function(data) {
                    console.log('Error: ' , data);
                });

            $scope.addEvent = function(isValid, event){
                if(isValid){
                    $scope.working = 'pending';
                    event.tags = getCheckedTags($scope.tags);
                    var to_send = JSON.parse(JSON.stringify(event));
                    console.log('date start', event.date_start + " " + event.time_start);
                    to_send.time_start = momentUTCTime(event.date_start + " " + event.time_start).format('MM/DD/YYYY hh:mm a');
                    to_send.time_end = momentUTCTime(event.date_end + " " + event.time_end).format('MM/DD/YYYY hh:mm a');
                    console.log(to_send.time_end);
                    $http.post(ENDPOINTS_DOMAIN + '/_ah/api/netegreek/v1/event/create', packageForSending(to_send))
                    .success(function(data){
                        if (!checkResponseErrors(data)){
                            $scope.working = 'done';
                            setTimeout(function(){window.location.assign('#/app/events/'+event.tag);},500);
                        }
                        else{
                            $scope.working = 'broken';
                            console.log('ERROR: ',data);}
                        $scope.loading = false;
                    })
                    .error(function(data) {
                        $scope.working = 'broken';
                        console.log('Error: ' , data);
                        $scope.loading = false;
                    });
                $scope.loading = true;
                $scope.unavailable = false;
                $scope.available = false;
                }
                else{
                    $scope.submitted = true;
                }
            }
            $scope.checkTagAvailability = function(tag){
                
                if (tag == ""){
                    $scope.isEmpty = true;
                }
                else{
                    $scope.checkWorking = 'pending';
                    $scope.unavailable = false;
                    $scope.available = false;
                    $scope.isEmpty = false;
                    console.log('Im about to send', tag);
                    $http.post(ENDPOINTS_DOMAIN + '/_ah/api/netegreek/v1/event/check_tag_availability', packageForSending(tag))
                    .success(function(data){
                        if (!checkResponseErrors(data)){
                            $scope.checkWorking = 'done';
                            $scope.available = true;
                            $scope.unavailable = false;
                        }
                        else{
                            $scope.checkWorking = 'broken';
                            $scope.unavailable = true;
                            $scope.available = false;
                        }
                    })
                    .error(function(data) {
                        $scope.checkWorking = 'broken';
                        console.log('Error: ' , data);
                    });
                }
            }
        });
        $scope.$watch('event.date_start', function(){
            if ($scope.event){
                if ($scope.event.date_start && !$scope.event.date_end){
                    $scope.event.date_end = JSON.parse(JSON.stringify($scope.event.date_start));
                    console.log(moment().add('hours', 1).format('h:[00] A'));
                    
                    $scope.event.time_start = moment().add('hours', 1).format('h:[00] A');
                    $timeout(function(){$('.picker').trigger('change')},200);
                }
            }
        })
        $scope.$watch('event.time_start', function(){
            console.log('I see that change!!!');
            if ($scope.event){
                if ($scope.event.time_start){
                    
                    $scope.event.time_end = moment($scope.event.time_start, 'h:mm A').add('hours', 1).format('h:[00] A');
                    var test = moment($scope.event.time_end, 'h:mm A').diff(moment($scope.event.time_start, 'h:mm A')) < 0;
                    if (test && $scope.event.date_start == $scope.event.date_end){
                        console.log('difference', moment($scope.event.time_end, 'h:mm A').diff(moment($scope.event.time_start, 'h:mm A')) < 0);
                        console.log('time_end', $scope.event.time_end);
                        console.log('time_start', $scope.event.time_start);
                        $scope.event.date_end = moment($scope.event.date_end).add('days', 1).format('MM/DD/YYYY');
                    }
                }
                $timeout(function(){$('.picker').trigger('change')},200);
            }
        })
    });