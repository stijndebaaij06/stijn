(function () {
    'use strict';
    angular.module('app.management').controller('DetailDialogController', DetailDialogController);
    /** @ngInject */
    function DetailDialogController($mdDialog, ItemId, Messages, Type, Tags, event, Organisation, User, Access, ref, $timeout, $filter, $document) {
        var vm = this;
        var $translate = $filter('translate');
        // Data
        vm.type = Type;
        vm.itemId = ItemId;
        vm.access = Access;
        //        vm.message = {};
        if (vm.type == 'messages') {
            if (vm.itemId) {
                vm.itemRef = ref.organisation.collection("messages").doc(vm.itemId);
                vm.itemRef.get().then(function (doc) {
                    $timeout(function () {
                        var message = doc.data();
                        message.id = vm.itemId;
                        message.eventDate = message.eventDate.toDate();
                        //message.notificationDate = message.notificationDate.toDate();
                        message.notificationFromDate = message.notificationFromDate.toDate();
                        message.notificationToDate = message.notificationToDate.toDate();
                        var tagsData = {};
                        _.forEach(message.tags, function (tagRef, arrayId) {
                            if (Tags[tagRef.id]) tagsData[tagRef.id] = Tags[tagRef.id];
                            //message.tags[arrayId] = undefined;
                        });
                        message.tags = tagsData;
                        vm.message = message;
                        console.log('vm.message', vm.message);
                    });
                });
                vm.responseRef = ref.organisation.collection("messages").doc(vm.itemId).collection('responses');
                vm.responseRef.get().then(function (snapshot) {
                    var responses = {};
                    vm.responses = [];
                    vm.responseYesArray = [];
                    vm.responseNoArray = [];
                    vm.responseOthersArray = [];
                    vm.responseNoResponseArray = [];
                    vm.responseYesCounter = 0;
                    vm.responseNoCounter = 0;
                    vm.responseOthersCounter = 0;
                    vm.responseNoResponseCounter = 0;
                    //console.log('snapshot', snapshot);
                    snapshot.forEach(function (doc) {
                        //                                console.log(doc.id, " => ", doc.data());
                        var response = doc.data();
                        response.id = doc.id;
                        var localId = _.chain(response).get('text').value();
                        if (localId) localId = localId.toLowerCase();
                        // Fetches userRef
                        response.userRef.get().then(function (user) {
                            // Fetches user data based on userRef
                            ref.db.collection("users").doc(response.userRef.id).get().then(function (userDoc) {
                                if (userDoc.exists) {
                                    if (!responses[localId]) {
                                        responses[localId] = response;
                                        responses[localId].users = {}
                                    }
                                    var userData = userDoc.data();
                                    //if (!userData.name) userData.name = $translate('no_known_name');
                                    responses[localId].users[userDoc.id] = userData;
                                    responses[localId].users[userDoc.id].value = userData.name;
                                    $timeout(function () {
                                        if (response.answerType == 'yes') {
                                            vm.responseYesArray.push(response);
                                            vm.responseYesCounter++;
                                        }
                                        else if (response.answerType == 'no') {
                                            vm.responseNoArray.push(response);
                                            vm.responseNoCounter++;
                                        }
                                        else if (response.answerType == 'noresponse') {
                                            vm.responseNoResponseArray.push(response);
                                            vm.responseNoResponseCounter++;
                                        }
                                        else {
                                            vm.responseOthersArray.push(response);
                                            vm.responseOthersCounter++;
                                        }
                                        vm.responses = _.values(responses);
                                    });
                                };
                            })
                        })
                    });
                    $timeout(function () {
                        console.log('vm.responses', vm.responses);
                        console.log('vm.responseYesArray', vm.responseYesArray);
                        console.log('vm.responseNoArray', vm.responseNoArray);
                        console.log('vm.responseOthersArray', vm.responseOthersArray);
                    }, 500);
                });
            }
        }
        // Methods
        vm.edit = function (ev) {
            $mdDialog.show({
                controller: 'TaskDialogController'
                , controllerAs: 'vm'
                , templateUrl: 'app/main/management/dialogs/task/task-dialog.html'
                , parent: angular.element($document.body)
                , targetEvent: ev
                , clickOutsideToClose: false
                , locals: {
                    ItemId: ItemId
                    , Messages: Messages
                    , Tags: Tags
                    , Type: Type
                    , event: ev
                    , CopyData: undefined
                    , Organisation: Organisation
                    , User: User
                    , Access: vm.access
                }
            });
        }
        vm.seeAnswers = function (ev) {
            $mdDialog.show({
                controller: 'AnswerDialogController'
                , controllerAs: 'vm'
                , templateUrl: 'app/main/management/dialogs/answers/answer-dialog.tmpl.html'
                , parent: angular.element($document.body)
                , targetEvent: ev
                , clickOutsideToClose: true
                , locals: {
                    ItemId: ItemId
                    , Messages: Messages
                    , Tags: Tags
                    , Type: Type
                    , event: ev
                }
            });
        }

        vm.createCopy = function (ev) {
            $mdDialog.show({
                controller: 'TaskDialogController'
                , controllerAs: 'vm'
                , templateUrl: 'app/main/management/dialogs/task/task-dialog.html'
                , parent: angular.element($document.body)
                , targetEvent: ev
                , clickOutsideToClose: false
                , locals: {
                    ItemId: undefined
                    , Messages: vm.messages
                    , Tags: Tags
                    , Type: Type
                    , event: ev
                    , CopyData: vm.message
                    , Organisation: Organisation
                    , User: vm.user
                    , Access: vm.access
                }
            });
        }
        vm.closeDialog = function () {
            $mdDialog.hide();
        }
    }
})();