Template.navbar.created = function () {
	this.addkeyres = new ReactiveVar(null);

};

Template.navbar.events({
	'submit #sendApiKey': function (evt, tmpl) {
		evt.preventDefault();
		var apiK = $("#apiKey").val().trim(),
		owner = $("#owner").val().trim();
		Meteor.call("SaveApiKey", owner, apiK, function (err,res) {
			if (err) {
				tmpl.addkeyres.set({ msg: err.reason, class: "danger"});
			} else {
				tmpl.addkeyres.set({ msg: "Success!", class: "success"});

				$("#apiKey").val("");
				$("#owner").val("");
			}
			setTimeout(function () {
				tmpl.addkeyres.set({ msg: "", class: ""});
			}, 3000)
		})
	},
});

Template.navbar.helpers({
	ResultMsg: function () {
		if (Template.instance().addkeyres.get())
			return Template.instance().addkeyres.get();
	},
})