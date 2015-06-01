Meteor.methods({
	AddKey: function (owner, apikey) {
		if (!Meteor.userId()) return;
		var keyDoc = Keys.findOne({ $or: [{key: apikey}, {owner: owner}] });
		if (keyDoc && keyDoc.owner === owner) {
			throw new Meteor.Error('key_dup', 'Error: name already taken');
		} else if (keyDoc && keyDoc.apikey === apikey) {
			throw new Meteor.Error('key_dup', 'Error: api key already taken');
		}

		Keys.insert({
			key: apikey,
			key_base62: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(apikey)),
			timestamp: new Date(),
			owner: owner,
			owner_email: null,
			isActivated: true,
			viewers: [],
		}, cb);
	},
	DeleteKey: function (id) {
		if (!Meteor.userId()) {
			throw new Meteor.Error("NoAuth", "User not authorized to perform action");
		}
		Keys.update({ _id: id }, { $set: { isActivated: false } }, cb);
	}
});

function cb(err, res) {
	if (err) {
		console.log(err.reason);
	}
}


Meteor.publish("wakausers", function () {
	return Keys.find({ isActivated: true });
});

Meteor.publish("todayreports", function () {
	return TodayReports.find();
})

Meteor.publish('dailyreports', function (start, end) {
	return DailyReports.find({ datePtr: { $gte: start, $lt: end } });
})