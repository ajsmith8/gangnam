Gangnam.Views.IssuesShow = Backbone.View.extend({

	template: JST['issues/show'],
	
	events: {
		'click #back' : 'goBack',
		'click .hover-container' : 'goBack',
		'click #quiz' : 'issueQuiz'
	},
	
	initialize: function(options) {
		this.attr = options.attr;
		this.issue = this.attr.issues.where({id: options.issue.get('id')})[0];
		this.category = options.category;
	},
	
	render: function() {
		var self = this;
		$(this.el).addClass('issue active');
		$(this.el).html(this.template({
			issue: this.issue
		}));
		setTimeout(function() {
			self.renderUserRank();
			for(i = 0; i < 5; i++) {
				self.appendLeaderboard(i);
			}
		}, 0);
		return this;
	},
	
	appendLeaderboard: function(loc) {
		var view = new Gangnam.Views.ReputationsLeaderboard({
			attr: this.attr,
			issue: this.issue,
			loc: loc
		});
		$('#leaderboard').append(view.render().el);
	},
	
	renderUserRank: function() {
		var view = new Gangnam.Views.ReputationsIssue({
			attr: this.attr,
			issue: this.issue
		});
		$(this.el).find('#user_info').html(view.render().el);
	},
	
	goBack: function(event) {
		if ($(event.target).hasClass('quiz') || $(event.target).attr('id') === 'quiz') {
			return;
		}
		if (window.location.hash.slice(1, 9) === 'question') {
			parent.history.back();
		} else {
			Backbone.history.navigate('issues', true);
		}
	},
	
	issueQuiz: function(event) {
		Backbone.history.navigate('quiz' + this.issue.get('id'), true);
	}
});