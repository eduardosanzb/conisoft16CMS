angular.module('starter.controllers', [])

.controller('UploadCtrl', function($scope,$ionicModal, ionicDatePicker, Speakers, Conferences,FirebaseUrl) {
  $scope.type="Speaker"
  $scope.speakers = Speakers.all();

  $scope.event = {};
  $scope.speaker = {};
  $scope.typeSelected = function(type){
    console.log(type);
    $scope.type = type;
  }

  $scope.createConference = function(){
    console.log($scope.event);
    //set the object in firebase
    var newConference = Conferences.cleanRef().push();
    var conferenceId = newConference.key();
    Conferences.cleanRef().child('en').child(conferenceId).set($scope.event);
    Conferences.cleanRef().child('es').child(conferenceId).set($scope.event);

    var ref = new Firebase(FirebaseUrl + "speakers/");
    
    angular.forEach($scope.event.speakers, function(value,key) {
      ref.child('en').child(key).child('conferences').child(conferenceId).set(true);
      ref.child('es').child(key).child('conferences').child(conferenceId).set(true);
    });

    $scope.event = {};
  }

  $scope.createSpeaker = function(){
    var speakerEn = {
      name:$scope.speaker.name,
      description:$scope.speaker.descriptionEN
      //,
      //picture:$scope.uploader
    }
    var speakerEs = {
      name:$scope.speaker.name,
      description:$scope.speaker.descriptionES
      //,
      //picture:$scope.uploader
    }

    var ref = new Firebase(FirebaseUrl + "speakers/");
    var newSpeaker = ref.push();
    var speakerId = newSpeaker.key();

    console.log(speakerEs);
    ref.child('en').child(speakerId).set(speakerEn);
    ref.child('es').child(speakerId).set(speakerEs);
    $scope.speaker = {};
  }


  var ipObj1 = {
      callback: function (val) {  //Mandatory
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        $scope.showDate = new Date(val);
        $scope.date = val;
      },
      disabledDates: [],
      from: new Date(2016, 03, 27), //Optional
      to: new Date(2016, 04, 28), //Optional
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
      disableWeekdays: [1],       //Optional
      closeOnSelect: false,       //Optional
      templateType: 'popup'       //Optional
    };

    $scope.openDatePicker = function(){
      ionicDatePicker.openDatePicker(ipObj1);
    };

    $scope.startingTime = {
      inputEpochTime: ((new Date()).setTime(28800000)),  //Optional
      step: 10,  //Optional
      format: 24,  //Optional
      titleLabel: '24-hour Format',  //Optional
      setLabel: 'Set',  //Optional
      closeLabel: 'Close',  //Optional
      setButtonType: 'button-positive',  //Optional
      closeButtonType: 'button-stable',  //Optional
      callback: function (val) {    //Mandatory
        setStartingTime(val);
      }
    };
    $scope.finishTime = {
      inputEpochTime: ((new Date()).setTime(28800000)),  //Optional
      step: 10,  //Optional
      format: 24,  //Optional
      titleLabel: '24-hour Format',  //Optional
      setLabel: 'Set',  //Optional
      closeLabel: 'Close',  //Optional
      setButtonType: 'button-positive',  //Optional
      closeButtonType: 'button-stable',  //Optional
      callback: function (val) {    //Mandatory
        setFinishTime(val);
      }
    };

    function setStartingTime(val) {
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        var selectedTime = new Date(val * 1000);
        console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
        $scope.event.startTime = val;
      }
    }

    function setFinishTime(val) {
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        var selectedTime = new Date(val * 1000);
        console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
        $scope.event.finishTime = val;
      }
    }

   $ionicModal.fromTemplateUrl("templates/speakers.html",{
      scope:$scope,
      animation:'slide-in-up'
   }).then(function(modal){
    $scope.speakerModal = modal;
   });
   $scope.openSpeakersModal = function(){
    $scope.speakerModal.show();
   }
   $scope.closeSpeakersModal = function(){
    $scope.speakerModal.hide();
   }








})

.controller('ScanCtrl', function($scope) {
   var theDate = new Date();
   theDate.setTime(30600* 1000)
  console.log(theDate.getUTCHours());
})

.controller('AccountCtrl', function($scope,Conferences) {
  console.log(Conferences.getSpeakers("-KDmpSOdK64Yi9CMWNYY"));
});
