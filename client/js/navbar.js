Template.navbar.events({
	'submit #sendApiKey': function (evt, tmpl) {
		evt.preventDefault();
		var apiK = $("#apiKey").val().trim();
		Meteor.call("SaveApiKey", apiK, function (err,res) {
			if (err) {
				console.log(err.reason);
			} else {
				alert("Api Key saved");
			}
		})
	},
});