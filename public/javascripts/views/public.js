"use strict";
define(['jquery',
	'underscore',
	'backbone',
	'collections',
	'models',
	'libs/text!templates/party-description.html',
	'libs/text!templates/nakki-table.html'],
       function($, _, bb, collections, models, party_tmpl, nakki_tbl_tmpl) {

	   var vent = {};
	   _.extend(vent, bb.Events);

	   var party_description_template = _.template(party_tmpl);
	   var nakki_table_template = _.template(nakki_tbl_tmpl);

	   var party = new models.Party();
	   var nakit = new collections.Nakit();

	   var Party_Viewer = bb.View.extend({
	       initialize: function(){
		   this.render();
	       },
	       
	       render: function(){
		   this.$el.html(party_description_template({party:this.model.toJSON(), editable:false}));
		   return this.$el;
	       },
	   });

	   var Nakki_Table = bb.View.extend({

	       initialize: function() {
	   	   _.bindAll(this,'save');
		   vent.on('assignPerson',this.save)
	   	   this.render();
	       },

	       render: function(){
		   var data = _.groupBy(nakit.toJSON(),'slot');
		   var titles = _.map(_.sortBy(data[0],'type'), function(current){
		       return current.type;
		   });
	   	   this.$el.html(nakki_table_template({types: titles, data: data}));
	       },

	       save: function(assignedPerson){
		   var ids = _.map(this.$('form').serializeArray(), function(el) {
		       return el.value;
		   });
		   
		   _.each(ids, function(current){
		       var model = nakit.get(current);
		       model.save({assign:assignedPerson.get('email')});
		   });
	       }
	   });
	   
	   var Assign_Form = bb.View.extend({
	       events: {'submit': 'save'},

	       initialize: function() {
	       	   _.bindAll(this, 'save');
	       },
	       
	       render: function() {
		   return this.$el;
	       },

	       save: function() {
		   var arr = this.$el.serializeArray();
		   var data = _(arr).reduce(function(acc, field) {
		       acc[field.name] = field.value;
		       return acc;
		   }, {});
		   this.model.save(data);
		   vent.trigger('assignPerson',this.model);
		   return false;
	       }
	   });
	   
	   var initialize = function(options){
	       var rootel = options.el;
	       var partyId = options.partyId;
	       
	       party.fetch({url:'/mock-data/' + partyId + '/details', success:function(){
		   nakit.partyId = party.get('id');

	       	   nakit.fetch({success:function(){
	               new Party_Viewer({el:$('#party-description',rootel), model: party}); 
		       new Nakki_Table({el:$('#nakkiTable',rootel)});

		       var potentialPerson = new models.Person();
		       potentialPerson.partyId = party.get('id');

	               new Assign_Form({el:$('#assign',rootel), model: potentialPerson});
	       	   },error:function(col,resp){
		       alert('wat? : ' + resp);
		   }});
	       }});
	   };

	   return {initialize:initialize};
       });