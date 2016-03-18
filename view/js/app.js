var app = angular.module('starterApp', ['ngMaterial','ngRoute','ngMessages']);

app.factory('socket',function(){
  // This is where our app running.
  var socket = io.connect('http://localhost:3000');
  return socket;
});

app.config(function($routeProvider){
      $routeProvider
          .when('/',{
                templateUrl: 'home.html'
          })
          .when('/create',{
                templateUrl: 'create.html'
          })
          .when('/view',{
                templateUrl: 'view.html'
          });
});

app.controller('pollingController',function($scope, $mdDialog, $http, socket) {

  $scope.pollData = [];
  $scope.formData = {};
  $scope.voteData = {};
  $scope.hiddenrows = [];
  getPollData();
  /**
    * @function
    * @description fetch the polls from RethinkDB and render it in UI.
  */
  function getPollData() {
    $http.get("/polls").success(function(response){
      $scope.pollData = response.data;
    });
  }

  $scope.submitPoll = function(ev) {
   var data = {
     "question" : $scope.formData.pollQuestion,
     "polls" : [{
       "option" : $scope.formData.pollOption1, "vote" : 0
     },{
       "option" : $scope.formData.pollOption2, "vote" : 0
     },{
       "option" : $scope.formData.pollOption3, "vote" : 0
     }]
   };
   var message = {"title" : "", "message" : ""};
   // Calling the API to add new poll.
   $http.post('/polls',data).success(function(response) {
     if(response.responseCode === 200) {
       message.title = "Success !";
       message.message = "Poll is successfully created";
       data["id"] = response.data.generated_keys[0];
       // Updating pollData to update the view, this will automatically update and render the new vote at home page.
       $scope.pollData.push(data);
     } else {
       message.title = "Error !";
       message.message = "There is some error happened creating poll";
     }
     // Upon Error or success, dialogue box will appear with message.
     $mdDialog.show(
       $mdDialog.alert()
         .parent(angular.element(document.querySelector('#popupContainer')))
         .clickOutsideToClose(true)
         .title(message.title)
         .textContent(message.message)
         .ok('Got it!')
         .targetEvent(ev)
     );
   });
 }

  $scope.updateVote = function(index) {
   var data = {
     "id" : $scope.pollData[index].id,
     "option" : $scope.pollData[index].selected
   };
   $http.put("/polls",data).success(function(response) {
     if(response.responseCode === 200) {
       $scope.hiddenrows.push(index);
     } else {
       console.log("error");
     }
   });
 }

 socket.on('changeFeed',function(data) {
    // on any change, we will first iterate through our pollData array.
    // If any id matches, we will then update the vote count.
    // $scope.apply will make the change in HTML screen.
    for(var pollCounter = 0; pollCounter < $scope.pollData.length; pollCounter++) {
      if($scope.pollData[pollCounter].id === data.id) {
        $scope.pollData[pollCounter].polls = data.polls;
        $scope.$apply();
      }
    }
  });

});
