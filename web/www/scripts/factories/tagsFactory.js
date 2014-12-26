App.factory('Tags', function(RESTService, $rootScope, localStorageService, $q, $timeout){
    var tags = localStorageService.get('tags');
    var cacheTimestamp = undefined;
    return {
        get: function () {
            if (checkCacheRefresh(cacheTimestamp)){
                    cacheTimestamp = moment();
                    RESTService.post(ENDPOINTS_DOMAIN + '/_ah/api/netegreek/v1/message/get_tags', '')
                    .success(function(data){
                        if (!RESTService.hasErrors(data)){
                            tags = JSON.parse(data.data);
                            console.log('New Tags: ', tags);
                            localStorageService.set('tags', tags);
                            $rootScope.$broadcast('tags:updated');
                        }
                        else{
                            console.log('ERR');
                        }
                    })
                    .error(function(data) {
                        console.log('Error: ' , data);
                    });
            }
            return tags;
        },
        set: function (_tags) {
            tags = _tags;
        },
        check: function(){
            if (tags == null){
                this.get();
                return false;
            }
            return true;
        }
    };
});