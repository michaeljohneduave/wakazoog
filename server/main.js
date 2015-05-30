var day = 24 * 60 * 60 * 1000;

Meteor.startup(function () {

	Meteor.setInterval(function () {
		fetchTodaysReport();
	}, 1000 * 60 * 15);

	Meteor.setInterval(function () {
		var now = new Date();
		if (now.getHours() === 17) {
			fetchDailyReport();
		}
	}, 10000);

});


function fetchTodaysReport() {
	Keys.find().fetch().forEach(function (e) {
		if (!e.key) return;
		HTTP.call('GET', 'https://wakatime.com/api/v1/users/current/summaries',
			{ 
				headers: { "Authorization": 'Basic ' + e.key_base62 },
				params: { 
					start: moment().format("YYYY-MM-DD"),
					end: moment().format("YYYY-MM-DD"),
				}
			},
			function (err, res) {
				if (err) {
				} else  {
					var d = res.data.data[0];
					TodayReports.upsert({ owner: e.owner }, { $set: { data: d, timestamp: new Date() } }, cb);
				}
			}
		)
	});
}

function fetchDailyReport() {
	Keys.find().fetch().forEach(function (e) {
		if (!e.key) return;
		var yest = moment().subtract(1, 'days').format("YYYY-MM-DD");
		HTTP.call('GET', 'https://wakatime.com/api/v1/users/current/summaries',
			{ 
				headers: { "Authorization": 'Basic ' + e.key_base62 },
				params: { 
					start: yest,
					end: yest,
				}
			},
			function (err, res) {
				if (err) {
				} else  {
					var d = res.data.data[0];
					DailyReports.insert({
						owner: e.owner,
						data: d,
						datePtr: new Date(d.range.start * 1000)
					}, cb)
				}
			}
		)
	});
}

function cb (err, res) {
	if (err) {
		console.log(err);
	}
}