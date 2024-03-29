Gangnam.Views.VotesQuestion = Backbone.View.extend({
	
	template: JST['votes/question'],
	
	events: {
		'click #upvote' : 'upVote',
		'click #downvote' : 'downVote'
	},
	
	initialize: function(options) {
		this.attr = options.attr;
		this.question = this.attr.questions.where({id: options.question.get('id')})[0];

		this.attr.votes.on('change', this.render, this);
		this.attr.votes.on('add', this.render, this);
		this.attr.users.on('reset', this.render, this);
	},
	
	render: function() {
		this.user = this.attr.users.where({id: this.attr.current_user.get('id')})[0];
		$(this.el).html(this.template({
			score: this.getScore()
		}));
		return this;
	},
	
	getScore: function() {
		var votes = this.attr.votes.where({question_id: this.question.get('id'), fact_id: null, comment_id: null});
		var sum = 0;
		
		for (i = 0; i < votes.length; i++) {
			sum = sum + votes[i].get('value');
		}
		
		return sum;
	},
	
	upVote: function(event) {
		var vote;
		var ids = {issue: this.question.get('issue_id'), question: this.question.get('id'), fact: null, comment: null};
		
		if (this.user.userConditions(this.attr.user_privileges, this.attr.privileges.where({id: 1})[0])) {
			vote = this.attr.votes.addOrUpdate(this.user, ids, 1, this.attr.achievements, this.attr.user_achievements);
			this.question.updateScore(this.attr.votes);
		} else {
			if (!this.user.signedInUser()) {
				var view = new Gangnam.Views.PopupsSignin({
					attr: this.attr,
					user: this.user
				});
				$('.popup').html(view.render().el);
			} else {
				var view = new Gangnam.Views.PopupsNeedPrivilege({
					attr: this.attr,
					user: this.user,
					privilege: this.attr.privileges.where({id: 1})[0]
				});
				$('.popup').html(view.render().el);
			}
		}
	},
	
	downVote: function(event) {
		var vote;
		var ids = {issue: this.question.get('issue_id'), question: this.question.get('id'), fact: null, comment: null};
		
		if (this.user.userConditions(this.attr.user_privileges, this.attr.privileges.where({id: 2})[0])) {
			vote = this.attr.votes.addOrUpdate(this.user, ids, -1, this.attr.achievements, this.attr.user_achievements);
			this.question.updateScore(this.attr.votes);
		} else {
			if (!this.user.signedInUser()) {
				var view = new Gangnam.Views.PopupsSignin({
					attr: this.attr,
					user: this.user
				});
				$('.popup').html(view.render().el);
			} else {
				var view = new Gangnam.Views.PopupsNeedPrivilege({
					attr: this.attr,
					user: this.user,
					privilege: this.attr.privileges.where({id: 2})[0]
				});
				$('.popup').html(view.render().el);
			}
		}
	},
	
	onClose: function() {
		this.attr.votes.unbind("add", this.render);
		this.attr.votes.unbind("change", this.render);
		this.attr.users.unbind("reset", this.render);
	}
});