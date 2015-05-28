Accounts.onCreateUser(function (options, user) {
	if (Meteor.users.find().count() < 2) {
		user.isAdmin = true;
	} else { 
		user.isAdmin = false;
	}
	user.wakaApiKey = null;
	return user;
});

Accounts.config({
	sendVerificationEmail: true,
	restrictCreationByEmailDomain: 'zoogtech.com'
})