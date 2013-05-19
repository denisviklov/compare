Compares = new Meteor.Collection("compares");

if (Meteor.isClient) {

    Meteor.startup(function(){
    //filepicker.setKey("AFjwxOmtYSISM553OZc3Az");
    });

  Template.base.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    },
  });

  Template.main.comps = function(){
    return Compares.find({}, {sort:{'updated': -1}},limit=10);
  };

  Template.main.events({
    'click .section': function(event){
      Meteor.Router.to('/details/'+ event.currentTarget.id);
    },
  });

  var f1_url = '';
  var f2_url = '';
  Template.msgForm.events({
    'click #open-form': function(event) {
      event.preventDefault();
      $('#send-form').toggle();
    },
    'change #type': function(event){
      $('#second-img').toggle();
    },
    'change #file-store': function(event){
      f1_url = '';
      f2_url = '';
      if (event.fpfiles){
        f1_url = event.fpfiles[0].url;
        f2_url = event.fpfiles[1].url;
      }else{
        f1_url = event.fpfile.url;
      }
    },
    'submit form': function(event){
      event.preventDefault();
      event.stopPropagation();
      var title = $(event.target).find('[name=title]').val();
      var body = $(event.target).find('[name=body]').val();
      var category = $(event.target).find('#type :selected').val();
      var user_name = Meteor.user() ? Meteor.user().profile.name : 'anonymous';
      if(title && body && category){
        if(f1_url && f2_url){
          Compares.insert({'subject': true, 'title': title, 'body': body, 'category': category,
            'user_id': Meteor.user._id, 'f1_url': f1_url, 'f2_url': f2_url, 'comments': [], 'a': 0, 'b': 0,
            username: user_name, updated: new Date});
        }
        else if(f1_url){
          Compares.insert({'subject': false, 'title': title, 'body': body, 'category': category,
            'user_id': Meteor.user._id, 'f1_url': f1_url, 'comments': [], 'a': 0, 'b': 0,
            username: user_name, updated: new Date}); 
       }else{
        console.log('Error: You should upload a file');
       }
      }else{
        console.log('Error: Not all fields are filled correct');
      }
    },
  });

  Template.details.helpers({
      currentPost: function() {
      return Compares.findOne(Session.get('currentPostId'));
    }
  });

  Template.details.events({
    'click #voit': function(event){
      console.log(Meteor.user());
      var choose = $(':checked').attr('id');
      if (choose === 'a'){
        Compares.update({_id: Session.get("currentPostId")}, {$inc: {a: 1}, $set:{'updated': new Date}});
      }else{Compares.update({_id: Session.get("currentPostId")}, {$inc: {b: 1}, $set:{'updated': new Date}});}
    },
  });

  Template.commentForm.events({
    'submit form': function(event){
      event.preventDefault();
      event.stopPropagation();
      var user_id = Meteor.user() ? Meteor.user().profile.name : 'anonymous';
      var comment = $(event.target).find('[name=comment]').val();
      if (comment){
        Compares.update({_id: Session.get('currentPostId')}, {$push: {'comments':{'text': comment, 'username': user_id}}, 
          $set:{'updated': new Date}});
      }else{console.log('Error: Need a valid comment for post')}
    },
    'click #open-comment-form': function(event){
      $('#comment-form').toggle();
    },
  });

var turn_button = function(status){
  if(status){$('#open-form').show();}
  else{$('#open-form').hide();}
};

  Meteor.Router.add({
    '/': {to: 'main', and: function(){turn_button(true);}},
    '/details/:_id': {
      to: 'details',
      and: function(id) {Session.set('currentPostId', id);
                          turn_button(false);}
      }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
