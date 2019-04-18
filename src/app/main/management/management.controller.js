(function () {
    'use strict';
    angular.module('app.management').controller('ManagementController', ManagementController);
    /** @ngInject */
    function ManagementController($document, $mdDialog, $mdSidenav, $timeout, ref, $state, $scope, $filter, store, data) {
        var vm = this;
        var $translate = $filter('translate');
        // Data
        //        vm.tasks = Tasks.data;
        //        vm.tags = Tags.data;
        // Instant functions
        var userSnapshot;
        var communitySnapshot;
        var organisationSnapshot;
        var tagsSnapshot;
        var communityTagsSnapshot;
        var organisationMessagesSnapshot;
        var orgUsersSnapshot;
        var comUsersSnapshot;
        vm.currentlyEditing = store.get('currentlyEditing');
        console.log('currentlyEditing', vm.currentlyEditing);
        if (!vm.currentlyEditing) $state.go('app.select-entity');
        vm.limitAmount = 0;
        vm.search = '';
        // vm.rights = {};
        vm.access = {}
        firebase.auth().onAuthStateChanged(function (user) {
            $timeout(function () {
                if (user) {
                    vm.userId = user.uid;
                    userSnapshot = ref.user.onSnapshot(function (doc) {
                        console.log('userSnapshot', doc.data());
                        if (doc.exists) {
                            var user = doc.data();
                            //user.credits = Number(Math.round(user.credits+'e2')+'e-2').toFixed(2);
                            $timeout(function () {
                                vm.user = user;
                                //console.log('vm.user', vm.user);
                            });
                            ref.community.collection('users').doc(vm.userId).onSnapshot(function (doc) {
                                // vm.rights.community = doc.data().rights;
                                if (doc.data()) vm.access.community = doc.data().access;
                                if (user.exploitant) vm.access.community = {
                                    editRights: true
                                    , readRights: true
                                    , editTags: true
                                    , readTags: true
                                }
                                // console.log('vm.access', vm.access);
                                if (vm.currentlyEditing == 'community') {
                                    $timeout(function () {
                                        if (vm.access.community.readTags === true) {
                                            vm.selectedType = 'tags';
                                        }
                                        else if (vm.access.community.readRights === true) {
                                            vm.selectedType = 'com-rights';
                                        }
                                        else {
                                            $state.go('app.select-entity');
                                        }
                                        vm.loadingRights = false;
                                    })
                                }
                                if (vm.currentlyEditing == 'organisation') ref.organisation.collection('users').doc(vm.userId).onSnapshot(function (doc) {
                                    // vm.rights.organisation = doc.data().rights;
                                    if (doc.data()) vm.access.organisation = doc.data().access;
                                    if (user.exploitant) vm.access.organisation = {
                                        editRights: true
                                        , readRights: true
                                        , editMessages: true
                                        , readMessages: true
                                    }
                                    // console.log('vm.rights', vm.rights);
                                    // console.log('vm.access', vm.access);
                                    $timeout(function () {
                                        if (vm.access.organisation.readMessages === true) {
                                            vm.selectedType = 'messages';
                                        }
                                        else if (vm.access.community.readTags === true) {
                                            vm.selectedType = 'tags';
                                        }
                                        else if (vm.access.organisation.readRights === true) {
                                            vm.selectedType = 'rights';
                                        }
                                        else {
                                            $state.go('app.select-entity');
                                        }
                                        vm.loadingRights = false;
                                    })
                                });
                            });
                        }
                    });
                    $timeout(function () {
                        communitySnapshot = ref.community.onSnapshot(function (doc) {
                            console.log('communitySnapshot', doc.data());
                            if (doc.exists) {
                                var community = doc.data();
                                //user.credits = Number(Math.round(user.credits+'e2')+'e-2').toFixed(2);
                                $timeout(function () {
                                    vm.community = community;
                                    if (vm.currentlyEditing == 'community') {
                                        data.toolbar = {
                                            title: community.name
                                            , img: community.img
                                        };
                                    }
                                    console.log('vm.community', vm.community);
                                });
                            }
                        });
                        if (vm.currentlyEditing == 'organisation') organisationSnapshot = ref.organisation.onSnapshot(function (doc) {
                            console.log('organisationSnapshot', doc.data());
                            if (doc.exists) {
                                var organisation = doc.data();
                                //user.credits = Number(Math.round(user.credits+'e2')+'e-2').toFixed(2);
                                $timeout(function () {
                                    vm.organisation = organisation;
                                    if (vm.currentlyEditing == 'organisation') {
                                        data.toolbar = {
                                            title: organisation.name
                                            , img: organisation.img
                                        };
                                    }
                                    console.log('vm.organisation', vm.organisation);
                                });
                                ref.organisation.collection('attendance').onSnapshot(function (snapshot) {
                                    vm.attendanceUsers = {};
                                    snapshot.forEach(function (doc) {
                                        var attendance = doc.data();
                                        attendance.id = doc.id;
                                        if (attendance.date) attendance.date = attendance.date.toDate();
                                        vm.attendanceUsers[doc.id] = attendance;
                                    });
                                    console.log('attendanceUsers', vm.attendanceUsers);
                                    updateUsers();
                                })
                            }
                        });

                        function updateUsers() {
                            var users = [];
                            _.forEach(vm.attendanceUsers, function (user, userId) {
                                users.push(user);
                                // console.log('user', user);
                                // if (_.chain(user).get('comData').get('access').value() && _.chain(user).get('data').get('email').value() || _.chain(user).get('orgData').get('access').value() && _.chain(user).get('data').get('email').value()) users.push(user);
                            });
                            $timeout(function () {
                                vm.attendance = users;
                                vm.searchUpdate();
                                // console.log('vm.users', vm.users);
                            });
                        }
                        // var usersData = {};
                        // comUsersSnapshot = ref.community.collection('users').onSnapshot(function (snapshot) {
                        //     vm.usersObj = {};
                        //     //Get stored userData to prevent flickering
                        //     _.forEach(usersData, function (userData, userId) {
                        //         vm.usersObj[userId] = {};
                        //         var name = '';
                        //         if (userData.firstName) name = name + userData.firstName + ' ';
                        //         if (userData.lastName) name = name + userData.lastName + ' ';
                        //         vm.usersObj[userId].name = name;
                        //         vm.usersObj[userId].email = userData.email;
                        //         vm.usersObj[userId].data = userData;
                        //     })
                        //     snapshot.forEach(function (doc) {
                        //         //                                console.log(doc.id, " => ", doc.data());
                        //         if (!_.chain(vm.usersObj).get(doc.id).value()) vm.usersObj[doc.id] = {};
                        //         vm.usersObj[doc.id].id = doc.id;
                        //         vm.usersObj[doc.id].comData = doc.data();
                        //         //tag.ref = ref.db.collection('tags').doc(tag.id);
                        //         if (!_.chain(usersData).get(doc.id).value()) {
                        //             ref.db.collection('users').doc(doc.id).get().then(function (doc) {
                        //                 if (doc.exists) {
                        //                     var userData = doc.data();
                        //                     var name = '';
                        //                     if (userData.firstName) name = name + userData.firstName + ' ';
                        //                     if (userData.lastName) name = name + userData.lastName + ' ';
                        //                     usersData[doc.id] = userData;
                        //                     vm.usersObj[doc.id].name = name;
                        //                     vm.usersObj[doc.id].email = userData.email;
                        //                     vm.usersObj[doc.id].data = userData;
                        //                     updateUsers();
                        //                 }
                        //             });
                        //         }
                        //     });
                        //     if (vm.currentlyEditing == 'organisation') orgUsersSnapshot = ref.organisation.collection('users').onSnapshot(function (snapshot) {
                        //         snapshot.forEach(function (doc) {
                        //             var user = doc.data();
                        //             user.id = doc.id;
                        //             if (_.chain(vm.usersObj).get(doc.id).value()) {
                        //                 vm.usersObj[doc.id].orgData = user;
                        //                 updateUsers();
                        //             }
                        //         });
                        //     });
                        // });
                    }, 50);
                }
                else {
                    $timeout(function () {
                        if (vm.user) {
                            vm.user = undefined;
                            userSnapshot();
                            vm.community = undefined;
                            communitySnapshot();
                            vm.organisation = undefined;
                            organisationSnapshot();
                        }
                    });
                }
            })
        });
        // Tasks will be filtered against these models
        vm.filters = {
            search: {
                name: ''
            }
        };
        vm.msScrollOptions = {
            suppressScrollX: true
        };
        vm.loadingAttendance = true;
        vm.filtersDefaults = angular.copy(vm.filters);
        //////////
        /**
         * Initialize the controller
         */
        function init() {
            angular.forEach(vm.messages, function (task) {
                if (task.startDate) {
                    task.startDate = new Date(task.startDate);
                    task.startDateTimestamp = task.startDate.getTime();
                }
                if (task.dueDate) {
                    task.dueDate = new Date(task.dueDate);
                    task.dueDateTimestamp = task.dueDate.getTime();
                }
            });
        }
        init();
        /**
         * Prevent default
         *
         * @param e
         */
        function preventDefault(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        /**
         * Open new task dialog
         *
         * @param ev
         * @param task
         */
        vm.openEditDialog = function (ev, type, itemId) {
            $mdDialog.show({
                controller: 'TaskDialogController'
                , controllerAs: 'vm'
                , templateUrl: 'app/main/management/dialogs/task/task-dialog.html'
                , parent: angular.element($document.body)
                , targetEvent: ev
                , clickOutsideToClose: false
                , locals: {
                    ItemId: itemId
                    , Messages: vm.messages
                    , Tags: vm.tags
                    , Type: type
                    , event: ev
                    , CopyData: undefined
                    , Organisation: vm.organisation
                    , User: vm.user
                    , Access: vm.access
                }
            });
        }
        vm.openUserDialog = function (ev, type, user) {
            if (_.chain(user).get('id').value() == vm.userId) {
                $scope.showToast('cant_edit_yourself');
            }
            else {
                if (type == 'organisation') {
                    $mdDialog.show({
                        controller: 'OrganisationManagersDialogController'
                        , controllerAs: 'vm'
                        , templateUrl: 'app/main/management/dialogs/org-manager/org-manager-dialog.html'
                        , parent: angular.element($document.body)
                        , targetEvent: ev
                        , clickOutsideToClose: false
                        , locals: {
                            ItemId: _.chain(user).get('id').value()
                            , UserData: user
                            , Messages: vm.messages
                            , Tags: vm.tags
                            , event: ev
                            , YourUserId: vm.userId
                        }
                    });
                } else if (type == 'community') {
                    $mdDialog.show({
                        controller: 'CommunityManagersDialogController'
                        , controllerAs: 'vm'
                        , templateUrl: 'app/main/management/dialogs/com-manager/com-manager-dialog.html'
                        , parent: angular.element($document.body)
                        , targetEvent: ev
                        , clickOutsideToClose: false
                        , locals: {
                            ItemId: _.chain(user).get('id').value()
                            , UserData: user
                            , Messages: vm.messages
                            , Tags: vm.tags
                            , event: ev
                            , YourUserId: vm.userId
                        }
                    });
                }
            }
        }
        var timeout;
        vm.searchUpdate = function (searched) {
            if (searched) vm.limitAmount = 0;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                var search = angular.copy(vm.search).toLowerCase();
                if (search !== '') console.log('searching for', vm.search);
                $timeout(function () {
                    vm.filteredAttendance = _.filter(vm.attendance, function (user) {
                        // console.log('community', community);
                        // console.log(community.communityData.name.toLowerCase().indexOf(search) !== -1)
                        try {
                            if (user.name.toLowerCase().indexOf(search) !== -1) return true;
                            if (user.address.toLowerCase().indexOf(search) !== -1) return true;
                            return false;
        
                        }
                        catch (ex) {
                            console.error(ex);
                            return false;
                        }
                    });
                    vm.loadingAttendance = false;

                    // _.forEach(vm.filteredCommunities, function (community) {
                    //     _.forEach(community.organisations) {}
                    // })
                    // console.log('vm.filteredCommunities', vm.filteredCommunities);
                    // console.log('vm.filteredAttendance', vm.filteredAttendance);
                    vm.showMore();
                });
            }, 200);
        }
        vm.showMore = function () {
            vm.limitAmount = vm.limitAmount + 20;
            checkLimitReached();
            // if (_.size(vm.users) <= vm.limitAmount) {
            //     vm.maxLimitReached = true;
            // } else {
            //     vm.maxLimitReached = false;
            // }
        }
        function checkLimitReached () {
            console.log('vm.loadingAttendance', vm.loadingAttendance);
            console.log('vm.filteredAttendance.length', vm.filteredAttendance.length);
            console.log('vm.limitAmount', vm.limitAmount);
            $timeout(function () {
                if (vm.filteredAttendance.length <= vm.limitAmount) {
                    vm.maxLimitReached = true;
                } else {
                    vm.maxLimitReached = false;
                }
            });
        }
        /**
         * Toggle completed status of the task
         *
         * @param task
         * @param event
         */
        function toggleCompleted(task, event) {
            event.stopPropagation();
            task.completed = !task.completed;
        }
        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId) {
            $mdSidenav(sidenavId).toggle();
        }
        /**
         * Toggles filter with true or false
         *
         * @param filter
         */
        function toggleFilter(filter) {
            vm.filters[filter] = !vm.filters[filter];
            checkFilters();
        }
        /**
         * Toggles filter with true or empty string
         * @param filter
         */
        function toggleFilterWithEmpty(filter) {
            if (vm.filters[filter] === '') {
                vm.filters[filter] = true;
            }
            else {
                vm.filters[filter] = '';
            }
            checkFilters();
        }
        /**
         * Reset filters
         */
        function resetFilters() {
            vm.showAllTasks = true;
            vm.filters = angular.copy(vm.filtersDefaults);
        }
        /**
         * Check filters and mark showAllTasks
         * as true if no filters selected
         */
        function checkFilters() {
            console.log('vm.filters', vm.filters);
            vm.showAll = !!angular.equals(vm.filtersDefaults, vm.filtersFilters);
        }
        /**
         * Filter by startDate
         *
         * @param item
         * @returns {boolean}
         */
        function filterByStartDate(item) {
            if (vm.filters.startDate === true) {
                return item.startDate === new Date();
            }
            return true;
        }
        /**
         * Filter Due Date
         *
         * @param item
         * @returns {boolean}
         */
        function filterByDueDate(item) {
            if (vm.filters.dueDate === true) {
                return !(item.dueDate === null || item.dueDate.length === 0);
            }
            return true;
        }
        /**
         * Toggles tag filter
         *
         * @param tag
         */
        function toggleTagFilter(tag) {
            var i = vm.filters.tags.indexOf(tag);
            if (i > -1) {
                vm.filters.tags.splice(i, 1);
            }
            else {
                vm.filters.tags.push(tag);
            }
            checkFilters();
        }
        /**
         * Returns if tag exists in the tagsFilter
         *
         * @param tag
         * @returns {boolean}
         */
        function isTagFilterExists(tag) {
            return vm.filters.tags.indexOf(tag) > -1;
        }
    }
})();