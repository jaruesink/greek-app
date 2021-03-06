App.controller('newPollController', ['$scope', 'RESTService', '$rootScope', 'Tags',
    function($scope, RESTService, $rootScope, Tags) {
        Tags.get();
        $scope.tags = Tags.tags;
        $scope.deletePollTip = {
            "title": "Delete Question"
        }
        $scope.poll = {}
        $scope.poll.questions = [];
        $scope.addQuestion = function() {
            $scope.poll.questions.push({
                worded_question: '',
                type: '',
                choices: []
            });
        }
        $scope.removeQuestion = function(idx) {
            $scope.poll.questions.splice(idx, 1);
        }

        $scope.addChoice = function(question, choice) {

            if (choice && question.choices.indexOf(choice) == -1) {
                question.choices.push(choice);
            }
            question.temp_choice = undefined;
        }
        $scope.removeChoice = function(question, idx) {
            question.choices.splice(idx, 1);
        }
        $scope.createPoll = function(isValid) {
            var poll = $scope.poll;
            poll.tags = getCheckedTags($scope.tags);
            var to_send = JSON.parse(JSON.stringify(poll));
            //            to_send.time_start = momentUTCTime(poll.date_start + " " + poll.time_start).format('MM/DD/YYYY hh:mm a');
            //            to_send.time_end = momentUTCTime(poll.date_end + " " + poll.time_end).format('MM/DD/YYYY hh:mm a');
            if (isValid) {
                RESTService.post(ENDPOINTS_DOMAIN + '/_ah/api/poll/v1/create', to_send)
                    .success(function(data) {
                        if (!RESTService.hasErrors(data)) {
                            window.location.assign('#/app/polls/' + JSON.parse(data.data).key);
                        } else {
                            console.log('ERR');
                        }
                    })
                    .error(function(data) {
                        console.log('Error: ', data);
                    });
            }
        }
    }
]);