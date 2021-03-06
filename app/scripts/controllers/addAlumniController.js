App.controller('addAlumniController', ['$scope', 'RESTService', '$rootScope', 'localStorageService',
    function($scope, RESTService, $rootScope, localStorageService) {

        $scope.finished_loading = true;
       var formObject = document.getElementById('uploadAlumni');
        if (formObject) {
            formObject.addEventListener('change', readSingleFile, false);
        }
        var filecontents;
        $scope.adds = [];
        //initialize a filecontents variable
        var filecontents;

        //this method will get the data from the form and add it to the newmemberList object
        $.fn.serializeObject = function() {
            var o = {};
            var a = this.serializeArray();

            $.each(a, function() {
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        };

        //remove someone from list before adding everyone
        $scope.deleteAdd = function(add) {
            var index = $scope.adds.indexOf(add);
            $scope.adds.splice(index, 1);
        }

        //ng-click for the form to add one member at a time        
        $scope.addAlumnus = function(isValid) {
            if (isValid) {
                $scope.adds = $scope.adds.concat($scope.input);
                $scope.input = {};
                $scope.addalumnusForm.$setPristine();
            } else {
                $scope.submitted = true;
            }
        }

        $scope.submitAlumni = function() {
            var data_tosend = {
                users: $scope.adds
            };
            RESTService.post(ENDPOINTS_DOMAIN + '/_ah/api/auth/v1/add_alumni', data_tosend)
                .success(function(data) {
                    if (!RESTService.hasErrors(data)) {
                        $scope.adds = [];
                    } else {
                        console.log('ERROR: ', data);
                    }
                })
                .error(function(data) {
                    console.log('Error: ', data);
                });
        }

        //this function sets up a filereader to read the CSV
        function readSingleFile(evt) {
            //Retrieve the first (and only!) File from the FileList object
            var f = evt.target.files[0];
            if (f) {
                var r = new FileReader();
                r.onload = function(e) {
                    filecontents = e.target.result;
                }
                r.readAsText(f);

            } else {
                alert("Failed to load file");
            }
        }

        //reads the file as it's added into the file input
        //this function takes the CSV, converts it to JSON and outputs it

        $scope.addAlumni = function() {

            //check to see if file is being read
            if (filecontents === null) {
                //do nothing
                alert('you have not selected a file');
            } else {
                //converts CSV file to array of usable objects
                var listCSV = Papa.parse(filecontents).data;
                console.log(listCSV);
                var columnNames = listCSV[0];
                var newMembersList = [];
                for (var i = 1; i < listCSV.length; i++){
                    var newMember = {};
                    for (var j = 0; j < columnNames.length; j++){
                        newMember[columnNames[j]] = listCSV[i][j];
                    }
                    newMembersList.push(newMember);
                }
                checkEmail = function(email) {
                    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return re.test(email);
                }
                var new_item_list = [];
                for (var i = 0; i < newMembersList.length; i++) {
                    var item = newMembersList[i];
                    var new_item = {};
                    if (item['First']) {
                        new_item.first_name = item['First'];
                    }
                    if (item['Last']) {
                        new_item.last_name = item['Last'];
                    }
                    if (item['Pledge Year']) {
                        new_item.pledge_class_year = item['Pledge Year'];
                    }
                    if (item['Pledge Semester']) {
                        new_item.pledge_class_semester = item['Pledge Semester'];
                    }
                    if (item['Email']) {
                        new_item.email = item['Email'];
                    }
                    if (!new_item.email || !new_item.first_name || !new_item.last_name || !new_item.pledge_class_year || !new_item.pledge_class_semester) {
                        continue;
                    }
                    if (!checkEmail(new_item.email)) {
                        $scope.memberSkippedNotifier = true; //shows warning that not all members added correctly
                        continue;
                    }
                    new_item_list.push(new_item);
                }
                $scope.adds = $scope.adds.concat(new_item_list);
                $('#uploadMembers').wrap('<form>').parent('form').trigger('reset');
                $('#uploadMembers').unwrap();
                $('#uploadMembers').trigger('change');
                filecontents = null;
            }
        }

    }
])
