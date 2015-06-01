Template.navbar.created = function () {
	this.addkeyres = new ReactiveVar(null);

};

Template.navbar.events({
	'submit #sendApiKey': function (evt, tmpl) {
		evt.preventDefault();
		var apiK = $("#apiKey").val().trim(),
		owner = $("#owner").val().trim();
		Meteor.call("AddKey", owner, apiK, function (err,res) {
			if (err) {
				toastr.error(err.reason);
			} else {

				$("#apiKey").val("");
				$("#owner").val("");

				toastr.success("Success!");
			}
		});
	},
});

Template.navbar.helpers({
})