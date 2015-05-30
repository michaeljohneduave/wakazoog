Meteor.methods({
	"SaveApiKey": function (owner, apikey) {
		if (!Meteor.userId()) return;
		var keyDoc = Keys.find({ key: apikey }).fetch();
		console.log(keyDoc);
		if (keyDoc.length) {
			throw new Meteor.Error('key_dup', 'Error: api kay already saved');
		}

		Keys.insert({
			key: apikey,
			key_base62: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(apikey)),
			timestamp: new Date(),
			owner: owner,
			owner_email: null,
			viewers: [],
		}, cb);
	},
});

function cb(err, res) {
	if (err) {
		console.log(err.reason);
	}
}


Meteor.publish("wakausers", function () {
	return Keys.find();
});

Meteor.publish("todayreports", function () {
	return TodayReports.find();
})

Meteor.publish('dailyreports', function (start, end) {
	return DailyReports.find({ datePtr: { $gte: start, $lt: end } });
})