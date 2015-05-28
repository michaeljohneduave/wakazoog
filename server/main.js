Meteor.startup(function () {
	if (Meteor.users.find().count() < 1) return;
	Meteor.setInterval(function () {
		Meteor.users.find().fetch().forEach(function (e) {
			// if (e.isAdmin) return;
			if (!e.wakaApiKey) return;
			// HTTP.call('GET', 'https://wakatime.com/api/v1/users/current/summaries?start=2015-05-29&end=2015-05-29',
			// 	{ headers: { "Authorization": 'Basic MDBhZWRhYzgtMTM5Ni00MmNlLWFlODYtZmYzN2JmNmIxMTc0' } },
			// 	function (err, res) {
			// 		if (err) console.log(err)
			// 		else console.log(JSON.stringify(res.data));
			// 	}
			// )
		});
	}, 5000)
});