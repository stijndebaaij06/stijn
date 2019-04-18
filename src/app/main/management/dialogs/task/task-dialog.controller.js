(function () {
    'use strict';
    angular.module('app.management').controller('TaskDialogController', TaskDialogController);
    /** @ngInject */
    function TaskDialogController($mdDialog, ItemId, Messages, Type, Tags, event, CopyData, Organisation, User, Access, ref, $timeout, $filter, $mdToast) {
        var vm = this;
        var $translate = $filter('translate');
        // Data
        vm.type = Type;
        vm.messages = Messages;
        vm.itemId = ItemId;
        vm.newItem = false;
        vm.selectedTags = [];
        vm.tags = Tags;
        vm.user = User;
        vm.access = Access;
        console.log('vm.user', vm.user);
        vm.mentions = [
            {
                label: 'Naam'
            }
            , {
                label: 'Datum'
            }
            , {
                label: 'Dag'
            }
            , {
                label: 'Tijd'
            }
        ];
        console.log('vm.tags', vm.tags);
        vm.message = {};
        vm.hours = [{
            twentyFourHoursClock: '01'
            , pmAmClock: '1 a.m.'
            , value: 1
        }, {
            twentyFourHoursClock: '02'
            , pmAmClock: '2 a.m.'
            , value: 2
        }, {
            twentyFourHoursClock: '03'
            , pmAmClock: '3 a.m.'
            , value: 3
        }, {
            twentyFourHoursClock: '04'
            , pmAmClock: '4 a.m.'
            , value: 4
        }, {
            twentyFourHoursClock: '05'
            , pmAmClock: '5 a.m.'
            , value: 5
        }, {
            twentyFourHoursClock: '06'
            , pmAmClock: '6 a.m.'
            , value: 6
        }, {
            twentyFourHoursClock: '07'
            , pmAmClock: '7 a.m.'
            , value: 7
        }, {
            twentyFourHoursClock: '08'
            , pmAmClock: '8 a.m.'
            , value: 8
        }, {
            twentyFourHoursClock: '09'
            , pmAmClock: '9 a.m.'
            , value: 9
        }, {
            twentyFourHoursClock: '10'
            , pmAmClock: '10 a.m.'
            , value: 10
        }, {
            twentyFourHoursClock: '11'
            , pmAmClock: '11 a.m.'
            , value: 11
        }, {
            twentyFourHoursClock: '12'
            , pmAmClock: '12 noon'
            , value: 12
        }, {
            twentyFourHoursClock: '13'
            , pmAmClock: '1 p.m.'
            , value: 13
        }, {
            twentyFourHoursClock: '14'
            , pmAmClock: '2 p.m.'
            , value: 14
        }, {
            twentyFourHoursClock: '15'
            , pmAmClock: '3 p.m.'
            , value: 15
        }, {
            twentyFourHoursClock: '16'
            , pmAmClock: '4 p.m.'
            , value: 16
        }, {
            twentyFourHoursClock: '17'
            , pmAmClock: '5 p.m.'
            , value: 17
        }, {
            twentyFourHoursClock: '18'
            , pmAmClock: '6 p.m.'
            , value: 18
        }, {
            twentyFourHoursClock: '19'
            , pmAmClock: '7 p.m.'
            , value: 19
        }, {
            twentyFourHoursClock: '20'
            , pmAmClock: '8 p.m.'
            , value: 20
        }, {
            twentyFourHoursClock: '21'
            , pmAmClock: '9 p.m.'
            , value: 21
        }, {
            twentyFourHoursClock: '22'
            , pmAmClock: '10 p.m.'
            , value: 22
        }, {
            twentyFourHoursClock: '23'
            , pmAmClock: '11 p.m.'
            , value: 23
        }, {
            twentyFourHoursClock: '24'
            , pmAmClock: '12 midnight'
            , value: 24
        }];
        vm.minutes = [
            {
                value: 0
                , string: '00'
            }
            , {
                value: 15
                , string: '15'
            }
            , {
                value: 30
                , string: '30'
            }
            , {
                value: 45
                , string: '45'
            }
        ]
        if (vm.type == 'messages') {
            if (!vm.itemId) {
                vm.itemId = ref.organisation.collection("messages").doc().id;
                vm.itemRef = ref.organisation.collection("messages").doc(vm.itemId);
                if (!CopyData) {
                    if (Organisation.defaultTags) {
                        _.forEach(Organisation.defaultTags, function (tagRef) {
                            if (vm.tags[tagRef.id]) {
                                vm.selectedTags.push(vm.tags[tagRef.id]);
                            }
                        });
                    }
                    vm.messageSaveData = {
                        'name': ''
                        , 'message': ''
                        , 'eventDate': new Date()
                        , 'eventHour': 9
                        , 'eventMinute': 0
                        , 'tags': []
                        , 'timeBound': true
                        , 'notificationFromType': 'weeks'
                        , 'notificationFromValue': 1
                        , 'notificationToType': 'hours'
                        , 'notificationToValue': 1
                        , 'questionType': 'yesOrNo'
                        , 'possibleAnswers': {
                            yes: {
                                answer: 'yes'
                                , message: ''
                            }
                            , no: {
                                answer: 'no'
                                , message: ''
                            }
                        }
                        , 'isChecked': false
                    };
                }
                else {
                    console.log('vm.tags', vm.tags);
                    console.log('copyTags', CopyData.tags);
                    _.forEach(CopyData.tags, function (tagRef) {
                        if (vm.tags[tagRef.id]) {
                            vm.selectedTags.push(vm.tags[tagRef.id]);
                        }
                    });
                    vm.messageSaveData = {
                        'name': CopyData.name
                        , 'message': CopyData.message
                        , 'eventDate': CopyData.eventDate
                        , 'eventHour': CopyData.eventHour
                        , 'eventMinute': CopyData.eventMinute
                        , 'tags': []
                        , 'timeBound': CopyData.timeBound
                        , 'notificationFromType': CopyData.notificationFromType
                        , 'notificationFromValue': CopyData.notificationFromValue
                        , 'notificationToType': CopyData.notificationToType
                        , 'notificationToValue': CopyData.notificationToValue
                        , 'questionType': CopyData.questionType
                        , 'possibleAnswers': CopyData.possibleAnswers
                        , 'isChecked': CopyData.isChecked
                    };
                    console.log('vm.messageSaveData', vm.messageSaveData);
                }
                vm.message = vm.messageSaveData;
                vm.message.id = vm.itemId;
                vm.newItem = true;
            }
            else {
                vm.itemRef = ref.organisation.collection("messages").doc(vm.itemId);
                vm.itemRef.get().then(function (doc) {
                    $timeout(function () {
                        var message = doc.data();
                        var messageSaveData = doc.data();
                        message.eventDate = message.eventDate.toDate();
                        //message.notificationDate = message.notificationDate.toDate();
                        message = doc.data();
                        message.id = vm.itemId;
                        message.tagsData = {};
                        messageSaveData.tags = [];
                        messageSaveData.eventDate = message.eventDate.toDate();
                        //messageSaveData.notificationDate = message.notificationDate.toDate();
                        _.forEach(message.tags, function (tagRef) {
                            if (vm.tags[tagRef.id]) {
                                message.tagsData[tagRef.id] = vm.tags[tagRef.id];
                                vm.selectedTags.push(vm.tags[tagRef.id]);
                            }
                        });
                        vm.message = message;
                        vm.messageSaveData = messageSaveData;
                        console.log('vm.selectedTags', vm.selectedTags);
                        console.log('vm.message', vm.message);
                        console.log('vm.messageSaveData', vm.messageSaveData);
                    });
                });
            }
        }
        else if (vm.type == 'tags') {
            if (!vm.itemId) {
                vm.itemId = ref.community.collection("tags").doc().id;
                vm.itemRef = ref.community.collection("tags").doc(vm.itemId);
                vm.tagSaveData = {
                    'name': ''
                    , 'color': 'red'
                };
                vm.tag = vm.tagSaveData;
                vm.tag.id = vm.itemId;
                vm.newItem = true;
            }
            else {
                vm.itemRef = ref.community.collection("tags").doc(vm.itemId);
                vm.itemRef.get().then(function (doc) {
                    $timeout(function () {
                        vm.tag = doc.data();
                        vm.tag.id = vm.itemId;
                        vm.tagSaveData = doc.data();
                        console.log('vm.tag', vm.tag);
                        console.log('vm.tagSaveData', vm.tagSaveData);
                    });
                });
            }
        }
        // Methods
        vm.saveItem = saveItem;
        vm.deleteMessage = deleteMessage;
        vm.closeDialog = closeDialog;
        vm.getMentionText = function (item) {
            // note item.label is sent when the typedText wasn't found
            return '[~<i>' + (item.name || item.label) + '</i>]';
        };
        vm.searchMentions = function (term) {
            var peopleList = [];
            angular.forEach(vm.mentions, function (item) {
                if (item.label.toUpperCase().indexOf(term.toUpperCase()) >= 0) {
                    peopleList.push(item);
                }
            });
            //$scope.people = peopleList;
            //return $q.when(peopleList);
            return peopleList;
        };
        //////////
        /**
         * Save task
         */
        function saveItem() {
            console.log('vm.type', vm.type);
            // Dummy save action
            if (vm.type == 'messages') {
                //Check if user is exploitant to decide whether or not to revert "isChecked" to disabled
                if (!vm.user.exploitant) vm.messageSaveData.isChecked = false;

                //Set tags database ready :D
                _.forEach(vm.selectedTags, function (tag, tagId) {
                    if (tag.type == 'global') tag.ref = ref.db.collection('tags').doc(tag.id);
                    if (tag.type == 'community') tag.ref = ref.community.collection('tags').doc(tag.id);
                    vm.messageSaveData.tags.push(tag.ref);
                });
                //remove <p> in front and back of string
                //                vm.messageSaveData.message = strip(vm.messageSaveData.messageWithHTMLtags);
                //                if (vm.messageSaveData.message.indexOf('<p>') == 0)  {
                //                    vm.messageSaveData.message = vm.messageSaveData.message.substring(3, vm.messageSaveData.message.length - 4);
                //                };
                console.log('vm.messageSaveData.message', vm.messageSaveData.message);
                vm.messageSaveData.eventDate.setHours(vm.messageSaveData.eventHour, vm.messageSaveData.eventMinute, 0, 0);
                var timeBeforeFrom;
                var timeBeforeTo;
                var notificationDate = angular.copy(vm.messageSaveData.eventDate);
                if (vm.messageSaveData.notificationFromType == 'days') {
                    timeBeforeFrom = (24 * 60 * 60 * 1000) * vm.messageSaveData.notificationFromValue;
                }
                else if (vm.messageSaveData.notificationFromType == 'weeks') {
                    timeBeforeFrom = (7 * 24 * 60 * 60 * 1000) * vm.messageSaveData.notificationFromValue;
                }
                else if (vm.messageSaveData.notificationFromType == 'hours') {
                    timeBeforeFrom = (60 * 60 * 1000) * vm.messageSaveData.notificationFromValue;
                }
                vm.messageSaveData.notificationFromDate = new Date(notificationDate.setTime(notificationDate.getTime() - timeBeforeFrom));
                notificationDate = angular.copy(vm.messageSaveData.eventDate);
                if (vm.messageSaveData.notificationToType == 'days') {
                    timeBeforeTo = (24 * 60 * 60 * 1000) * vm.messageSaveData.notificationToValue;
                }
                else if (vm.messageSaveData.notificationToType == 'weeks') {
                    timeBeforeTo = (7 * 24 * 60 * 60 * 1000) * vm.messageSaveData.notificationToValue;
                }
                else if (vm.messageSaveData.notificationToType == 'hours') {
                    timeBeforeTo = (60 * 60 * 1000) * vm.messageSaveData.notificationToValue;
                }
                vm.messageSaveData.notificationToDate = new Date(notificationDate.setTime(notificationDate.getTime() - timeBeforeTo));
                $timeout(function () {
                    if (vm.messageSaveData.notificationFromDate >= vm.messageSaveData.notificationToDate) {
                        //vm.notificationDateError = true;
                        vm.showToast('notification_date_error');
                    }
                    else {
                        //vm.notificationDateError = false;
                        vm.itemRef.set(vm.messageSaveData).then(function () {
                            console.log("Document successfully set!");
                            closeDialog();
                        });
                    }
                    console.log('vm.messageSaveData', vm.messageSaveData);
                    console.log('vm.notificationDateError', vm.notificationDateError);
                });
                console.log('vm.messageSaveData', vm.messageSaveData);
            }
            else if (vm.type == 'tags') {
                console.log('vm.tagSaveData', vm.tagSaveData);
                vm.itemRef.set(vm.tagSaveData).then(function () {
                    console.log("Document successfully set!");
                    closeDialog();
                });
            }
        }
        /**
         * Delete task
         */
        function deleteMessage() {
            var confirm = $mdDialog.confirm().title($translate('delete_confirm')).ariaLabel('Delete Task').ok($translate('delete')).cancel($translate('cancel')).targetEvent(event);
            $mdDialog.show(confirm).then(function () {
                var batch = ref.db.batch();
                vm.itemRef.collection('responses').get().then(function (snapshot) {
                    batch.delete(vm.itemRef);
                    snapshot.forEach(function (doc) {
                        batch.delete(vm.itemRef.collection('responses').doc(doc.id));
                    });
                    batch.commit().then(function () {
                        console.log("Documents successfully deleted!");
                        closeDialog();
                    });
                });
                // Dummy delete action
                //                for (var i = 0; i < vm.tasks.length; i++) {
                //                    if (vm.tasks[i].id === vm.task.id) {
                //                        vm.tasks[i].deleted = true;
                //                        break;
                //                    }
                //                }
            }, function () {
                // Cancel Action
            });
        }
        /**
         * New tag
         *
         * @param chip
         * @returns {{label: *, color: string}}
         */
        //        function newTag(chip) {
        //            var tagColors = ['#388E3C', '#F44336', '#FF9800', '#0091EA', '#9C27B0'];
        //            return {
        //                name: chip
        //                , label: chip
        //                , color: tagColors[Math.floor(Math.random() * (tagColors.length))]
        //            };
        //        }
        vm.querySearch = function (query) {
            var results = _.filter(vm.tags, function (o) {
                if (o.name.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
                    return true;
                }
                else {
                    return false;
                }
            });
            console.log('searchResults', results);
            return results;
        };
        vm.transformChip = function (chip) {
            // If it is an object, it's already a known chip
            if (!angular.isObject(chip)) {
                // Otherwise, create a new one
                var obj = _.find(vm.tags, {
                    'name': chip.toLowerCase()
                });
                if (obj) {
                    chip = obj;
                }
                else {
                    var tagColors = ['#388E3C', '#F44336', '#FF9800', '#0091EA', '#9C27B0'];
                    var newId = ref.db.collection('/tags/').doc().id;
                    chip = {
                        name: chip.toLowerCase()
                        , type: 'new'
                        , id: newId
                        , color: tagColors[Math.floor(Math.random() * (tagColors.length))]
                    }
                }
            }
            console.log('chip', chip);
            return chip;
        }
        vm.showToast = function (msg, duration) {
            //custom function to show a toast with translations
            if (!duration) duration = 4000;
            $mdToast.show($mdToast.simple().textContent($translate(msg)).hideDelay(duration).toastClass('toast'));
        };
        vm.checkParams = function (param) {
            console.log('paramChanged', param);
            $timeout(function () {
                if (param.name && param.name !== '' || param.question && param.question !== '') {
                    console.log('name or question set');
                    vm.paramsNotEmpty = true;
                }
                else {
                    param = {};
                    vm.paramsNotEmpty = false;
                }
            });
        }

        function closeDialog() {
            $mdDialog.hide();
        }
        //        function strip(html)
        //        {
        //            console.log(jQuery('<p>' + html + '</p>').text());
        //            var tmp = document.createElement("DIV");
        //            tmp.innerHTML = html;
        //            return tmp.textContent || tmp.innerText || "";
        //        }
    }
})();