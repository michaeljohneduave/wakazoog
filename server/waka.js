Meteor.methods({
	"SaveApiKey": function (apikey) {
		if (!Meteor.userId()) return;
		Meteor.users.update({ _id: Meteor.userId() }, { $set: { wakaApiKey: apikey } });
	}
})