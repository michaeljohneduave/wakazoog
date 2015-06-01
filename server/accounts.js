Accounts.onCreateUser(function (options, user) {
	if (Meteor.users.find().count() < 1) {
		user.accessLevel = 'admin';
	} else { 
		user.accessLevel = 'teamlead';
	}
	user.wakaApiKey = null;
	return user;
});

Accounts.config({
	restrictCreationByEmailDomain: 'zoogtech.com'
})