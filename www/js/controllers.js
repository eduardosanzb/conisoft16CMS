angular.module('starter.controllers', [])

.controller('UploadCtrl', function($scope, $ionicModal, ionicDatePicker, Speakers, Conferences, FirebaseUrl, $ionicPopup, Reviews, $ionicActionSheet, $cordovaCamera) {
    $scope.type = "Speaker"
    $scope.speakers = Speakers.all();

    $scope.event = {};
    $scope.speaker = {};
    $scope.typeSelected = function(type) {
        console.log(type);
        $scope.type = type;
    }

    var onComplete = function(error) {
        if (error) {
            $ionicPopup.confirm({
                title: 'Could created',
                content: error
            });
        } else {
            $ionicPopup.confirm({
                title: 'Success',
                content: 'Yei'
            }).then(function(res) {
                if (res) {
                    $scope.event = {}
                    $scope.showDate = null;
                    $scope.speaker = {};
                }
            });
        }
    };

    /*IMAGE HANDLING*/
    console.log($cordovaCamera)
    
    
    
    

    
    /*IMAGE HANDLING END*/

    $scope.createConference = function() {
        console.log($scope.event);
        //set the object in firebase
        var newConference = Conferences.cleanRef().push();
        var conferenceId = newConference.key();

        var conferenceEn = {
          date: $scope.event.date,
          description:$scope.event.descriptionEN,
          finishTime:$scope.event.finishTime,
          location:$scope.event.location,
          moderator:$scope.event.moderator,
          name:$scope.event.name,
          speakers:$scope.event.speakers,
          startTime:$scope.event.startTime,
          topic:$scope.event.topic
        }

        var conferenceEs = {
          date: $scope.event.date,
          description:$scope.event.descriptionES,
          finishTime:$scope.event.finishTime,
          location:$scope.event.location,
          moderator:$scope.event.moderator,
          name:$scope.event.name,
          speakers:$scope.event.speakers,
          startTime:$scope.event.startTime,
          topic:$scope.event.topic
        }
        Conferences.cleanRef().child('en').child(conferenceId).set(conferenceEn);
        Conferences.cleanRef().child('es').child(conferenceId).set(conferenceEs, onComplete);
        Reviews.ref().child(conferenceId).set({});

        var ref = new Firebase(FirebaseUrl + "speakers/");

        angular.forEach($scope.event.speakers, function(value, key) {
            ref.child('en').child(key).child('conferences').child(conferenceId).set(true);
            ref.child('es').child(key).child('conferences').child(conferenceId).set(true);
        });
    }


    $scope.createSpeaker = function() {
        console.log($scope.speaker.picture);
        var speakerEn = {
            name: $scope.speaker.name,
            description: $scope.speaker.descriptionEN,
            picture:$scope.speaker.picture.base64
        }
        var speakerEs = {
            name: $scope.speaker.name,
            description: $scope.speaker.descriptionES,
            picture:$scope.speaker.picture.base64
        }

        var ref = new Firebase(FirebaseUrl + "speakers/");
        var newSpeaker = ref.push();
        var speakerId = newSpeaker.key();

        console.log(speakerEs);
        ref.child('en').child(speakerId).set(speakerEn);
        ref.child('es').child(speakerId).set(speakerEs, onComplete);
        $scope.speaker = {};
    }


    var ipObj1 = {
        callback: function(val) { //Mandatory
            console.log('Return value from the datepicker popup is : ' + val, new Date(val));
            $scope.showDate = new Date(val);
            $scope.event.date = val;
        },
        disabledDates: [],
        from: new Date(2016, 03, 27), //Optional
        to: new Date(2016, 04, 28), //Optional
        inputDate: new Date(), //Optional
        mondayFirst: true, //Optional
        disableWeekdays: [1], //Optional
        closeOnSelect: false, //Optional
        templateType: 'popup' //Optional
    };

    $scope.openDatePicker = function() {
        ionicDatePicker.openDatePicker(ipObj1);
    };

    $scope.startingTime = {
        inputEpochTime: ((new Date()).setTime(28800000)), //Optional
        step: 10, //Optional
        format: 24, //Optional
        titleLabel: '24-hour Format', //Optional
        setLabel: 'Set', //Optional
        closeLabel: 'Close', //Optional
        setButtonType: 'button-positive', //Optional
        closeButtonType: 'button-stable', //Optional
        callback: function(val) { //Mandatory
            setStartingTime(val);
        }
    };
    $scope.finishTime = {
        inputEpochTime: ((new Date()).setTime(28800000)), //Optional
        step: 10, //Optional
        format: 24, //Optional
        titleLabel: '24-hour Format', //Optional
        setLabel: 'Set', //Optional
        closeLabel: 'Close', //Optional
        setButtonType: 'button-positive', //Optional
        closeButtonType: 'button-stable', //Optional
        callback: function(val) { //Mandatory
            setFinishTime(val);
        }
    };

    function setStartingTime(val) {
        if (typeof(val) === 'undefined') {
            console.log('Time not selected');
        } else {
            var selectedTime = new Date(val * 1000);
            console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
            $scope.event.startTime = selectedTime.getUTCHours();
        }
    }

    function setFinishTime(val) {
        if (typeof(val) === 'undefined') {
            console.log('Time not selected');
        } else {
            var selectedTime = new Date(val * 1000);
            console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
            $scope.event.finishTime = selectedTime.getUTCHours();
        }
    }

    $ionicModal.fromTemplateUrl("templates/speakers.html", {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.speakerModal = modal;
    });
    $scope.openSpeakersModal = function() {
        $scope.speakerModal.show();
    }
    $scope.closeSpeakersModal = function() {
        $scope.speakerModal.hide();
    }

})

.controller('ScanCtrl', function($scope,$http, $cordovaBarcodeScanner, Users, $ionicModal, $ionicLoading, $ionicPopup, References) {


//$cordovaBarcodeScanner.scan().then(function.imageData);
$scope.scanBarcode = function() {
    $ionicLoading.show();
        $cordovaBarcodeScanner.scan().then(function(imageData) {
            //alert(imageData.text); //the id number
            console.log("Barcode Format -> " + imageData.format);
            console.log("Cancelled -> " + imageData.cancelled);
            if (!imageData.cancelled) {
                Users.get(imageData.text).$loaded().then(function(user){
                    //alert(user.name)
                    $scope.user = user;
                    $ionicLoading.hide();
                    $scope.modal.show()
                }).catch(function(error){
                    $ionicLoading.hide()
                    console.log(error)
                     $ionicPopup.confirm({
                            title: 'Sorry',
                            content: 'This user does not exist'
                        }).then(function(res) {
                            if(res)
                                $scope.number = {}
                        });
                });
            }
            
        }, function(error) {
            console.log("An error happened -> " + error);
        });
    };
    $scope.number = {}
$scope.searchByReference = function(reference){
    $ionicLoading.show();
    console.log(reference)
    References.get(reference).$loaded().then(function(data){
        Users.get(data.user).$loaded().then(function(user){
                    $scope.user = user;
                    $ionicLoading.hide();
                    $scope.modal.show()
        }).catch(function(error){
            alert(error)
            console.log(error)
        })
    }).catch(function(error){
         $ionicLoading.hide()
        console.log(error)
         $ionicPopup.confirm({
                title: 'Sorry',
                content: 'This reference does not exist'
            }).then(function(res) {
                if(res)
                    $scope.number = {}
            });
    })
    
}

function cameraCallback(img){
    $ionicLoading.show();
    $scope.user.profilePicture = img;
    $scope.user.$save().then(function(){
        $ionicLoading.hide()
         $ionicPopup.confirm({
                title: 'Success',
                content: 'User saved correctly'
            }).then(function(res) {
                if(res)
                    $scope.modal.hide();
            });
    });
}

function errorCallback(error){
    alert("Upss something went wrong");
    console.log(error);
}
 
var cameraOptions = {
    quality: 50,
    destinationType: 0,
    encodingType: 0,
    saveToPhotoAlbum: false
}
$scope.saveUser = function(){
    navigator.camera.getPicture(cameraCallback, errorCallback, cameraOptions);
}
$scope.values = {
    1:1,
    2:2,
    3:3
}

/*MODALS STUFF*/

$ionicModal.fromTemplateUrl('templates/register-user.html',{
    scope:$scope,
    animation:'slide-in-up'
}).then(function(modal){
    $scope.modal = modal;
});

})

.controller('AccountCtrl', function($scope, Conferences) {
    console.log(Conferences.getSpeakers("-KDmpSOdK64Yi9CMWNYY"));
});