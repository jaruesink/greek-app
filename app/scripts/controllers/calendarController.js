App.controller('calendarController', ['Session', '$scope', 'RESTService', '$rootScope', '$location', 'localStorageService', 'Events', 'Directory',
    function(Session, $scope, RESTService, $rootScope, $location, localStorageService, Events, Directory) {
        Events.get();
        Directory.get();
        $scope.session = Session;
        $scope.dataLoaded = false;
        $scope.directory = Directory.directory;
        $scope.events = Events.events;
        $scope.$watchCollection('[directoryLoaded, eventsLoaded]', function() {
            if ($scope.directoryLoaded && $scope.eventsLoaded) {
                $scope.dataLoaded = true;
            }
        });
        if (Events.check()) {
            getEvents();
        }
        $scope.change = function() {
            if ($scope.selectedTab == 0) {
                $scope.present = true;
            } else {
                $scope.present = false;
            }
        };

        $scope.$on('events:updated', function() {
            $scope.events = Events.events;
            getEvents();
        });

        if (Directory.check()) {
            $scope.directoryLoaded = true;
        }

        $scope.$on('directory:updated', function() {
            $scope.directory = Directory.directory;
            $scope.directoryLoaded = true;
        });

        $scope.$watch('selectedTab', function() {
            console.log('I see tab change!');
            if ($scope.selectedTab == 0) {
                $scope.order = 'time_start';
            } else {
                $scope.order = '-time_start';
            }
        });

        //send the organization and user date from registration pages
        function getEvents() {
            $scope.eventSource = [];
            for (var i = 0; i < $scope.events.length; i++) {
                $scope.eventSource.push({
                    title: $scope.events[i].title,
                    startTime: new Date(momentInTimezone($scope.events[i].time_start)),
                    endTime: new Date(momentInTimezone($scope.events[i].time_end)),
                    key: $scope.events[i].key
                });
            }
            $scope.eventsLoaded = true;
        }
        

        $scope.getNameFromKey = function(key) {
            if ($scope.directory.members) {
                for (var i = 0; i < $scope.directory.members.length; i++) {
                    if ($scope.directory.members[i].key == key) {
                        return $scope.directory.members[i].first_name + ' ' + $scope.directory.members[i].last_name;
                    }
                }
            }
            return 'Unknown';
        };

        $scope.showDate = function(start, end) {
            var mStart = momentInTimezone(start);
            var mEnd = momentInTimezone(end);
            if (mStart.diff(moment()) < 0 && mEnd.diff(moment()) > 0) {
                return 'Happening Now';
            }
            else {
                return mStart.calendar();
            }
        };

        $scope.goToEvent = function(event) {
            $location.path('app/events/' + event);
        };

        $scope.$watch('search', function() {
            if ($scope.current) {
                $scope.current.currentPage = 0;
                if ($scope.search) {
                    $scope.present = undefined;
                } else {
                    $scope.present = true;
                }
            }
        })
        
    }
]);