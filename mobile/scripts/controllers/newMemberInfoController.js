    App.controller('newmemberinfoController', function($scope, RESTService, $http, $rootScope, $stateParams, $location, AUTH_EVENTS){
        routeChange();
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
        $scope.loading = true;
        $scope.user_is_taken = false;
        $scope.waiting_for_response = false;
        $http.post(ENDPOINTS_DOMAIN + '/_ah/api/netegreek/v1/auth/new_user', JSON.stringify({token:$stateParams.key}))
            .success(function(data){
                if (!RESTService.hasErrors(data))
                {
                    $scope.loading = false;
                }
                else{
                    console.log('ERROR: ',data);
                    $location.path('login');
                }
            })
            .error(function(data) {
                $location.path('login');
                console.log('Error: ' , data);
            });
        $scope.$watch('item.user_name', function() {
            if ($scope.user_name){
                $scope.item.user_name = $scope.item.user_name.replace(/\s+/g,'');
            }
            $scope.unavailable = false;
            $scope.available = false;
        });
        $scope.checkUserName = function(user){
        $http.post(ENDPOINTS_DOMAIN + '/_ah/api/netegreek/v1/user/check_username',{data:JSON.stringify(user)})
                .success(function(data){
                    if (!RESTService.hasErrors(data))
                    {
                        $scope.available = true;
                        $scope.unavailable = false;
                    }
                    else{
                        console.log('ERROR: ',data);
                        $scope.available = false;
                        $scope.unavailable = true;}  
                });
        }
        
        $scope.createAccount = function(isValid){
            if(isValid){
                $scope.working = 'pending';
                $scope.waiting_for_response = true;
                var to_send = {user_name: $scope.item.user_name.toLowerCase(), password: $scope.item.password}
                $http.post(ENDPOINTS_DOMAIN + '/_ah/api/netegreek/v1/auth/register_credentials', {data:JSON.stringify(to_send), token:$stateParams.key})
                .success(function(data){
                    if (!RESTService.hasErrors(data))
                    {
                        var ret_data = JSON.parse(data.data);
                        Session.create(to_send.user_name, ret_data.token, ret_data.me);
                        $location.path("app/accountinfo");
                    }
                    else
                    {
                        $scope.working = 'broken';
                        if(data.error == "INVALID_USERNAME")
                        {
                            $scope.unavailable = true;
                            $scope.available = false;
                        }
                        console.log('ERROR: ', data);
                    } 
                })
                .error(function(data) {
                    $scope.working = 'broken';
                    console.log('Error: ' , data);
                });
                    //now logged in
                $scope.waiting_for_response = false;
            }
            else{
                $scope.submitted = true;
            }
        }
    });