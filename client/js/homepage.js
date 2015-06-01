Template.homepage.created = function () {
	this.wakaUserSub = null;
	this.todayreports = null;
	this.rangereports = null;
	this.daterange = new ReactiveVar('Today');
	this.todaySelected = new ReactiveVar(true);
};

Template.homepage.rendered = function () {
	var self = this;
	this.wakaUserSub = Meteor.subscribe('wakausers');
	this.todayreports = Meteor.subscribe('todayreports');

	$("#daterange").daterangepicker({
		format: "YYYY-MM-DD",
		ranges: {
			'Today': [moment(), moment()],
			'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
			'Last 7 Days': [moment().subtract(6, 'days'), moment()],
			'Last 30 Days': [moment().subtract(29, 'days'), moment()],
			'This Month': [moment().startOf('month'), moment().endOf('month')],
			'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
		}
	},
	function (start, end, label) {
		if (label === 'Custom Range') {
			self.daterange.set(start.format("MMM-DD-YYYY") + " to " + end.format("MMM-DD-YYYY"));
		} else {
			self.daterange.set(label)
		}

		if (label !== 'Today') {
			if (self.todayreports) self.todayreports.stop();
			self.rangereports = Meteor.subscribe("dailyreports", new Date(start), new Date(end))
			self.todaySelected.set(false)
		} else {
			if (self.rangereports) self.rangereports.stop();
			self.todayreports = Meteor.subscribe('todayreports');
			self.todaySelected.set(true)
		}
	});

	Meteor.call("FetchReportsToday", function (err, res) {
		if (err) console.log(err.reason);
	});
}

Template.homepage.events({
	'click .delete-user': function (evt) {
		var id = $(evt.target).parent().attr('id');
		id = new Meteor.Collection.ObjectID(id);
		Meteor.call("DeleteKey", id, function (err, res) {
			if (err) toastr.error(err.reason);
			else toastr.success("Deleted!");
		});
	}
});

Template.homepage.helpers({
	WakaUsers: function () {
		return Keys.find();
	},
	Today: function () {
		return moment().format("MMMM - DD - YYYY");
	},
	GetWakaTime: function (owner) {
		if (Template.instance().todaySelected.get()) {
			var today = TodayReports.findOne({ owner: owner });
			if (!today)	return { data: { grand_total: {	text: "NO DATA :*(" } } };
			return today;
		}
		var daily = DailyReports.find({ owner: owner }).fetch(),
		totalsecs = 0,
		hours = 0,
		minutes = 0,
		data = {
			grand_total: {}
		};
		if (!daily.length) return { data: { grand_total: {	text: "NO DATA :*(" } } };

		_.each(daily, function (elem) {
			totalsecs += elem.data.grand_total.total_seconds;
		});
		hours = parseInt(totalsecs / 3600);
		minutes = parseInt((totalsecs % 3600) / 60);
		data.grand_total.text = (hours ? (hours + " hours") : "") + " " + minutes + " minutes";
		return { data: data };
	},
	DateRange: function () {
		return Template.instance().daterange.get();
	},
});