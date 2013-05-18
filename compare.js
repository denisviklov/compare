Compares = new Meteor.Collection("compares")

if (Meteor.isClient) {

    Meteor.startup(function(){
                filepicker.setKey("AFjwxOmtYSISM553OZc3Az");
    });

  Template.base.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    },
  });

  Template.msgForm.events({
    'click #open-form': function(event) {
      event.preventDefault();
      $('#send-form').toggle();
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
