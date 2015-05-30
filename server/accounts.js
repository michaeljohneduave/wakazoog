Accounts.onCreateUser(function (options, user) {
	if (Meteor.users.find().count() < 1) {
		user.isAdmin = true;
	} else { 
		user.isAdmin = false;
	}
	user.wakaApiKey = null;
	return user;
});

Accounts.config({
	restrictCreationByEmailDomain: 'zoogtech.com'
})