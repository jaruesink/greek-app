App.factory('Chatter', ['RESTService', '$rootScope', 'localStorageService', '$q', '$mdToast',
    function(RESTService, $rootScope, localStorageService, $q, $mdToast) {

        var chatter = {};
        chatter.hasLoaded = false;
        chatter.data = {};
        var meta = {feedLoaded: false, importantLoaded: false};

        //for loops
        var i;
        var j;

        var load_data = localStorageService.get('chatter');
        if (load_data) {
            chatter.data.feed = load_data.chatter;
            chatter.data.important = load_data.important_chatter;
        }

        function getChattersByKey(key){
            var chatters = [];
            for (i = 0; i < chatter.data.feed.length; i++){
                if (chatter.data.feed[i].key == key){
                    chatters.push(chatter.data.feed[i]);
                    break;
                }
            }
            for (i = 0; i < chatter.data.important.length; i++){
                if (chatter.data.important[i].key == key){
                    chatters.push(chatter.data.important[i]);
                    break;
                }
            }
            return chatters;
        }

        function updateChatter(chat){
            var has_changed = false;
            for (i = 0; i < chatter.data.feed.length; i++){
                if (chatter.data.feed[i].key == chat.key){
                    chatter.data.feed[i] = chat;
                    has_changed = true;
                    break;
                }
            }
            for (i = 0; i < chatter.data.important.length; i++){
                if (chatter.data.important[i].key == chat.key){
                    chatter.data.important[i] = chat;
                    has_changed = true;
                    break;
                }
            }
        }

        chatter.get = function() {
            if (meta.feedLoaded) {
                return;
            }
            meta.feedLoaded = true;
            RESTService.post(ENDPOINTS_DOMAIN + '/_ah/api/chatter/v1/get', {"important": false})
                .success(function(data) {
                    if (!RESTService.hasErrors(data)) {
                        var load_data = JSON.parse(data.data);
                        chatter.data.feed = load_data;
                        $rootScope.$broadcast('chatter:updated');
                        meta.feedLoaded = true;
                    } else {
                        console.log('Err', data);
                    }
                })
                .error(function(data) {
                    console.log('Error: ', data);
                });
        };

        chatter.destroy = function(){
            chatter.data = {};
            localStorageService.remove('chatter');
            chatter.hasLoaded = false;
            meta = {feedLoaded: false, importantLoaded: false};
        }

        chatter.getImportant = function() {
            if (meta.importantLoaded) {
                return;
            }
            meta.importantLoaded = true;
            RESTService.post(ENDPOINTS_DOMAIN + '/_ah/api/chatter/v1/get', {"important": true})
                .success(function(data) {
                    if (!RESTService.hasErrors(data)) {
                        var load_data = JSON.parse(data.data);
                        chatter.data.important = load_data;
                        $rootScope.$broadcast('importantChatter:updated');
                    } else {
                        console.log('Err', data);
                    }
                })
                .error(function(data) {
                    console.log('Error: ', data);
                });
        };

        chatter.getComments = function(chatter){
             RESTService.post(ENDPOINTS_DOMAIN + '/_ah/api/chatter/v1/comments/get', {key: chatter.key})
                .success(function(data) {
                    if (!RESTService.hasErrors(data)) {
                        var load_data = JSON.parse(data.data);
                        chatter.comments = load_data;
                        updateChatter(chatter);
                    } else {
                        console.log('Err', data);
                    }
                })
                .error(function(data) {
                    console.log('Error: ', data);
                });
        };

        chatter.create = function(content, important, notify){
            RESTService.post(ENDPOINTS_DOMAIN + '/_ah/api/chatter/v1/post', {content:content, important:important, notify:notify})
            .success(function(data) {
                    if (!RESTService.hasErrors(data)) {
                        var newChat = JSON.parse(data.data);
                        if (getChattersByKey(newChat.key).length > 0){
                            return;
                        }
                        if (important){
                            chatter.data.important.push(newChat);
                        }
                        chatter.data.feed.unshift(newChat);
                    } else {
                        console.log('Err', data);
                    }
                })
                .error(function(data) {
                    console.log('Error: ', data);
                });
        };

        chatter.like = function(chat){
            if (chat.like){
                chat.like = false;
                chat.likes --;
            }
            else{
                chat.like = true;
                chat.likes ++;
            }
            RESTService.post(ENDPOINTS_DOMAIN + '/_ah/api/chatter/v1/like', {key:chat.key})
            .success(function(data){
                if (!RESTService.hasErrors(data)) {
                    var loaded = JSON.parse(data.data);
                    chat.following = loaded.following;
                        for (i = 0; i < chatter.data.feed.length; i++){
                           if (chat.key == chatter.data.feed[i].key){
                                chatter.data.feed[i] = chat;
                            }
                        }
                        for (i = 0; i < chatter.data.important.length; i++){
                            if (chat.key == chatter.data.important[i].key){
                                chatter.data.important[i] = chat;
                            }
                        }

                } else {
                    console.log('Err', data);
                }
            })
            .error(function(data){
                console.log('Error: ', data);
            });
        };

        chatter.comment = function(chat, content){
            RESTService.post(ENDPOINTS_DOMAIN + '/_ah/api/chatter/v1/comment/post', {key:chat.key, content:content})
            .success(function(data){
                if (!RESTService.hasErrors(data)) {
                        var loaded = JSON.parse(data.data);
                        chat.comments.push(loaded.comment);
                        chat.following = loaded.following;
                    } else {
                        console.log('Err', data);
                    }
            })
            .error(function(data){
                console.log('Error: ', data);
            });
        };

        chatter.saveComment = function(comment, content){
            RESTService.post(ENDPOINTS_DOMAIN + '/_ah/api/chatter/v1/comment/edit', {key:comment.key, content:content})
            .success(function(data){
                if (!RESTService.hasErrors(data)) {
                        load_data = JSON.parse(data.data);
                        comment.edited = load_data.edited;
                    } else {
                        console.log('Err', data);
                    }
            })
            .error(function(data){
                console.log('Error: ', data);
            });
        };

        chatter.likeComment = function(comment){
            if (comment.like){
                comment.like = false;
                comment.likes--;
            }
            else{
                comment.likes++;
                comment.like = true;
            }
            RESTService.post(ENDPOINTS_DOMAIN + '/_ah/api/chatter/v1/comment/like', {key:comment.key})
            .success(function(data){
                if (!RESTService.hasErrors(data)) {
                   } else {
                       console.log('Err', data);
                   }
           })
           .error(function(data){
               console.log('Error: ', data);
           });
        };

        chatter.deleteComment = function(comment, chat){
            for (var i = 0; i < this.data.feed.length; i++){
                if (this.data.feed[i].key == chat.key){
                    var this_chatter = this.data.feed[i];
                    for (j = 0; j < this_chatter.comments.length; j++){
                        if (comment.key == this_chatter.comments[j].key){
                            this_chatter.comments.splice(j, 1);
                        }
                    }
                }
            }
            for (i = 0; i < this.data.important.length; i++){
                    if (this.data.important[i].key == chat.key){
                        var this_chatter = this.data.important[i];
                        for (j = 0; j < this_chatter.comments.length; j++){
                            if (comment.key == this_chatter.comments[j].key){
                                this_chatter.comments.splice(j, 1);
                            }
                        }
                    }
            }
           RESTService.post(ENDPOINTS_DOMAIN + '/_ah/api/chatter/v1/comment/delete', {key:comment.key})
           .success(function(data){
               if (!RESTService.hasErrors(data)) {
                   } else {
                       console.log('Err', data);
                   }
           })
           .error(function(data){
               console.log('Error: ', data);
           });
        };

        chatter.makeImportant = function(chat, notify){
            chat.important = !chat.important;
            RESTService.post(ENDPOINTS_DOMAIN + '/_ah/api/chatter/v1/important', {key:chat.key, notify:notify})
            .success(function(data){
                if (!RESTService.hasErrors(data)) {
                    if (chat.important){
                        chatter.data.important.push(chat);
                    }else{
                        for (i = 0; i < chatter.data.important.length; i++){
                            if (chatter.data.important[i].key == chat.key){
                                chatter.data.important.splice(i, 1);
                                break;
                            }
                        }
                    }
                } else {
                    console.log('Err', data);
                }
            })
            .error(function(data){
                console.log('Error: ', data);
            });
        };

        chatter.delete = function(chat){
            RESTService.post(ENDPOINTS_DOMAIN + '/_ah/api/chatter/v1/delete', {key:chat.key})
            .success(function(data) {
                    if (!RESTService.hasErrors(data)) {
                        for (i = 0; i < chatter.data.feed.length; i++){
                            if (chat.key == chatter.data.feed[i].key){
                                chatter.data.feed.splice(i, 1);
                            }
                        }
                        for (i = 0; i < chatter.data.important.length; i++){
                            if (chat.key == chatter.data.important[i].key){
                                chatter.data.important.splice(i, 1);
                            }
                        }
                    } else {
                        console.log('Err', data);
                    }
                })
                .error(function(data) {
                    console.log('Error: ', data);
                });
        };

        chatter.edit = function(chat, content){
            RESTService.post(ENDPOINTS_DOMAIN + '/_ah/api/chatter/v1/edit', {key:chat.key, content:content})
            .success(function(data) {
                    if (!RESTService.hasErrors(data)) {
                        var load_data = JSON.parse(data.data);
                        chat.edited = load_data.edited;
                        for (i = 0; i < chatter.data.feed.length; i++){
                            if (chat.key == chatter.data.feed[i].key){
                                chatter.data.feed[i] = content;
                            }
                        }
                        for (i = 0; i < chatter.data.important.length; i++){
                            if (chat.key == chatter.data.important[i].key){
                                chatter.data.important[i].content = content;
                            }
                        }
                    } else {
                        console.log('Err', data);
                    }
                })
                .error(function(data) {
                    console.log('Error: ', data);
                });
        };

        chatter.mute = function(chat){
            if (chat.following){
                chat.following = false;
            }
            else{
                chat.following = true;
            }
            RESTService.post(ENDPOINTS_DOMAIN + '/_ah/api/chatter/v1/mute', {key:chat.key})
            .success(function(data){
                if (!RESTService.hasErrors(data)) {
                        for (i = 0; i < chatter.data.feed.length; i++){
                           if (chat.key == chatter.data.feed[i].key){
                                chatter.data.feed[i] = chat;
                            }
                        }
                        for (i = 0; i < chatter.data.important.length; i++){
                            if (chat.key == chatter.data.important[i].key){
                                chatter.data.important[i] = chat;
                            }
                        }
                } else {
                    console.log('Err', data);
                }
            })
            .error(function(data){
                console.log('Error: ', data);
            });
        };

        chatter.updateLikes = function(data){
            var key = data.key;
            var chatters = getChattersByKey(key);
            for(var i = 0; i < chatters.length; i++){
                chatters[i].likes = data.data.likes;
            }
        };

        chatter.updateNewChatter = function(chat){
            if (getChattersByKey(chat.key).length === 0){
                this.data.feed.push(chat);
                if (chat.important){
                    this.data.important.push(chat);
                }
            }
        };

        return chatter;
    }
]);