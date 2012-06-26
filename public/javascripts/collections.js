define(['jquery','backbone','models'],function($, bb, models){

    var Users = bb.Collection.extend({
	model: models.person,
	url: '/mock-data/users.json'
    });

    return {Users:Users};
});