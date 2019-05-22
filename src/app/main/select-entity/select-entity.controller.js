(function () {
    'use strict';
    angular.module('app.select-entity').controller('SelectEntityController', SelectEntityController);
    /** @ngInject */
    function SelectEntityController($document, $scope, $timeout, ref, mainFactory, $mdDialog, $state, data, store) {
        // Define variables
        var vm = this;
        vm.user = {};
        data.toolbar = {
            title: 'Management'
        };
        vm.limitAmount = 0;
        // Instant functions
        var firstTime = true;
        vm.search = '';
        firebase.auth().onAuthStateChanged(function (user) {
            $timeout(function () {
                if (user) {
                    vm.userId = user.uid;
                    console.log('userId', user.uid);
                    ref.user.onSnapshot(function (doc) {
                        if (doc.exists) {
                            var user = doc.data();
                            // user.exploitant = false;
                            if (user.exploitant) vm.user = user;
                            if (firstTime) {
                                // vm.getYourEntities();
                                if (user.exploitant) vm.getAllEntities();
                                if (!user.exploitant) vm.getYourEntities();
                            }
                            console.log('vm.user', vm.user);
                        }
                    });
                }
                else {
                    $state.go('app.login');
                    $timeout(function () {
                        vm.user = undefined;
                    });
                }
            })
        });
        // Called functions
        vm.getAllEntities = function () {
            ref.db.collection('communities').orderBy('name').onSnapshot(function (communitiesSnapshot) {
                vm.communities = {};
                communitiesSnapshot.forEach(function(doc) {
                    var community = doc.data();
                    var communityId = doc.id;
                    vm.communities[communityId] = {};
                    vm.communities[communityId].id = communityId;
                    vm.communities[communityId].organisations = {};
                    vm.communities[communityId].worthShowing = true;
                    vm.communities[communityId].clickable = true;
                    vm.communities[communityId].communityData = community;
                    vm.searchUpdate();
                    ref.db.collection('communities').doc(communityId).collection('organisations').orderBy('name').onSnapshot(function (organisationsSnapshot) {
                        organisationsSnapshot.forEach(function(doc) {
                            var organisation = doc.data();
                            var organisationId = doc.id;
                            vm.communities[communityId].organisations[organisationId] = {};
                            vm.communities[communityId].organisations[organisationId].id = organisationId;
                            vm.communities[communityId].organisations[organisationId].worthShowing = true;
                            vm.communities[communityId].organisations[organisationId].organisationData = organisation;
                            vm.searchUpdate();
                        });
                    })
                });
            })
        }
        vm.getYourEntities = function () {
            ref.user.collection('communities').onSnapshot(function (communitiesSnapshot) {
                vm.communities = {};
                communitiesSnapshot.forEach(function(doc) {
                    var community = doc.data();
                    var communityId = doc.id;
                    // console.log('community', community);
                    vm.communities[communityId] = {};
                    vm.communities[communityId].id = communityId;
                    vm.communities[communityId].organisations = {};
                    community.ref.onSnapshot(function (doc) {
                        if (doc.exists) {
                            var communityData = doc.data();
                            vm.communities[communityId].communityData = communityData;
                        }
                        vm.searchUpdate();
                    });
                    community.ref.collection('users').doc(vm.userId).onSnapshot(function (doc) {
                        if (doc.exists) {
                            var communityUserData = doc.data();
                            // console.log("communityUserData", communityUserData);
                            // if (_.isEmpty(communityUserData.access) == false) {
                            //     //DISABLED UNTILL ONLY SELECTING A COMMUNITY IS ADDED
                            //     vm.communities[communityId].worthShowing = true;
                            //     vm.communities[communityId].clickable = true;
                            // }
                            $timeout(function () {
                                vm.communities[communityId].userData = communityUserData;
                            });
                            _.forEach(community.organisations, function (organisation, organisationId) {
                                vm.communities[communityId].organisations[organisationId] = {};
                                organisation.ref.onSnapshot(function (doc) {
                                    if (doc.exists) {
                                        var organisationData = doc.data();
                                        vm.communities[communityId].organisations[organisationId].organisationData = organisationData;
                                    }
                                    vm.searchUpdate();
                                });
                                organisation.ref.collection('users').doc(vm.userId).onSnapshot(function (doc) {
                                    if (doc.exists) {
                                        var organisationUserData = doc.data();
                                        // if (_.isEmpty(organisationUserData.access) == false) {
                                        //     vm.communities[communityId].worthShowing = true;
                                        // }
                                        console.log(_.chain(organisationUserData).get('access').get('readUserRegistration').value());
                                        if (_.chain(organisationUserData).get('access').get('readUserRegistration').value()) {
                                            vm.communities[communityId].worthShowing = true;
                                            vm.communities[communityId].organisations[organisationId].worthShowing = true;
                                        }
                                        else {
                                            vm.communities[communityId].organisations[organisationId].worthShowing = false;
                                        }
                                        vm.communities[communityId].organisations[organisationId].userData = organisationUserData;
                                    }
                                    vm.searchUpdate();
                                });
                            });
                            console.log('vm.communities', vm.communities);
                        }
                    });
                });
            });
        }
        vm.selectEntity = function (communityId, organisationId) {
            mainFactory.selectCommunity(communityId);
            if (organisationId) mainFactory.selectOrganisation(organisationId);
            if (!organisationId) mainFactory.deselectOrganisation();
            if (organisationId) store.set('currentlyEditing', 'organisation');
            if (!organisationId) store.set('currentlyEditing', 'community');
            $state.go('app.management');
        }

        vm.editCommunity = function (ev, communityId) {
            console.log('itemId', communityId);
            $mdDialog.show({
                controller: 'ManageCommunityDialogController'
                , controllerAs: 'vm'
                , templateUrl: 'app/main/management/dialogs/manage-community/manage-community-dialog.html'
                , parent: angular.element($document.body)
                , targetEvent: ev
                , clickOutsideToClose: false
                , locals: {
                    ItemId: communityId
                    // , Tags: Tags
                    , event: ev
                    // , Organisation: Organisation
                    , User: vm.user
                }
            });
        }

        vm.editOrganisation = function (ev, community, organisationId) {
            console.log('community', community);
            console.log('itemId', organisationId);
            $mdDialog.show({
                controller: 'ManageOrganisationDialogController'
                , controllerAs: 'vm'
                , templateUrl: 'app/main/management/dialogs/manage-organisation/manage-organisation-dialog.html'
                , parent: angular.element($document.body)
                , targetEvent: ev
                , clickOutsideToClose: false
                , locals: {
                    ItemId: organisationId
                    , Community: community
                    // , Tags: tags
                    , event: ev
                    // , Organisation: Organisation
                    , User: vm.user
                }
            });
        }

        var timeout;
        vm.searchUpdate = function () {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                var search = angular.copy(vm.search).toLowerCase();
                if (search !== '') console.log('searching for', vm.search);
                $timeout(function () {
                    vm.limitAmount = 0;
                    vm.filteredCommunities = _.filter(vm.communities, function (community) {
                        // console.log('community', community);
                        // console.log(community.communityData.name.toLowerCase().indexOf(search) !== -1)
                        try {
                            var showCommunity = false;
                            var foundCommunity = false;
                            if (_.chain(community).get('communityData').get('name').value().toLowerCase().indexOf(search) !== -1) {
                                showCommunity =  true;
                                foundCommunity = true;
                            }
                            _.forEach(community.organisations, function(organisation) {
                                if (_.chain(organisation).get('organisationData').value()) {
                                    // console.log('organisation', organisation.organisationData.name);
                                    // console.log(organisation.organisationData.name.toLowerCase().indexOf(search) !== -1)
                                    organisation.shouldBeShown = true;
                                    if (organisation.organisationData.name.toLowerCase().indexOf(search) !== -1) {
                                        showCommunity = true;
                                    }
                                    else if (!foundCommunity) {
                                        organisation.shouldBeShown = false;
                                    }
                                }
                            });
                            return showCommunity;
        
                        }
                        catch (ex) {
                            console.error(ex);
                            return false;
                        }
                    });

                    // _.forEach(vm.filteredCommunities, function (community) {
                    //     _.forEach(community.organisations) {}
                    // })
                    // console.log('vm.filteredCommunities', vm.filteredCommunities);
                    vm.showMore();
                });
            }, 200);
        }
        
        vm.showMore = function () {
            vm.limitAmount = vm.limitAmount + 10;
            if (_.size(vm.filteredCommunities) <= vm.limitAmount) {
                vm.maxLimitReached = true;
            } else {
                vm.maxLimitReached = false;
            }
        }
    }
})();