	 /*     _                        _     _           _   
	*    / \   _ __  _ __     ___ | |__ (_) ___  ___| |_ 
	*   / _ \ | '_ \| '_ \   / _ \| '_ \| |/ _ \/ __| __|
	*  / ___ \| |_) | |_) | | (_) | |_) | |  __/ (__| |_ 
	* /_/   \_\ .__/| .__/   \___/|_.__// |\___|\___|\__|
	*         |_|   |_|               |__/               
	*/

	var app = {
		app_context: this,
		// Application Constructor
		initialize: function() {
			this.bindEvents();
			/* IMPORTANT to set requests to be syncronous */
			$.ajaxSetup({
				 async: false
			});
			app.registerPartials();
			// localStorage init
			this.ls 		= window.localStorage;
			var log_info 	= JSON.parse(this.ls.getItem('museo_log_info'));
							window.user 	= (log_info) ? log_info.user_login : '';
							window.user_id 	= (log_info) ? log_info.user_id : '';
							window.user_role = (log_info) ? log_info.user_role : '';

			/* Initialize API request handler */
			window.apiRH = new requestHandlerAPI().construct(app);

			/* Check if has any token */
			if(apiRH.has_token()){
				/* Check if has a valid token */
				var response = apiRH.has_valid_token();
				if(response){
					var data_id = $(this).data('id');
					console.log('You okay, now you can start making calls');
					/* Take the user to it's timeline */
					var is_home = window.is_home;
					if(is_home)
						window.location.assign('feed.html?filter_feed=all');
					return;
				}else{
					/* Token is not valid, user needs to authenticate */
					console.log("Your token is not valid anymore (or has not been activated yet)");
					// window.location.assign('index.html');
					return;
				}
			}
			
			/* DEBUG Executing robots request first of all */
			console.log(JSON.stringify(apiRH.getRequest('robots', null)));
			/* Requesting passive token if no token is previously stored */
			console.log(apiRH.request_token().get_request_token());
			// window.location.assign('index.html');
		},
		registerPartials: function() {
			var template = null;
			/* Add files to be loaded here */
			var filenames = ['header', 'footer'];
			filenames.forEach(function (filename) {
				$.ajax({
		            url : 'views/partials/' + filename + '.hbs',
		            success : function(response) {
			                if (Handlebars.templates === undefined)
			                    Handlebars.templates = {};
			            Handlebars.templates[filename] = Handlebars.compile(response);
		            }
		        });
			});
			
		},
		registerTemplate : function(name) {
		    $.ajax({
	            url : 'views/' + name + '.hbs',
	            success : function(response) {
		                if (Handlebars.templates === undefined)
		                    Handlebars.templates = {};
		            Handlebars.templates[name] = Handlebars.compile(response);
	            }
	        });
	        return;
		},
		bindEvents: function() {
			document.addEventListener('deviceready', app.onDeviceReady, false);
			document.addEventListener('mobileinit', app.onDMobileInit, false);
		},

		// deviceready Event Handler
		onDeviceReady: function() {
			app.receivedEvent('deviceready');

			/*   ___    _         _   _     
			*  / _ \  / \  _   _| |_| |__  
			* | | | |/ _ \| | | | __| '_ \ 
			* | |_| / ___ \ |_| | |_| | | |
			*  \___/_/   \_\__,_|\__|_| |_|
			*/                              
			// try{
			// 	OAuth.initialize('7O8IRe-xiPNc0JrOXSv3rc90RmU');
			// }
			// catch(err){
			// 	// app.toast("Oauth error ocurred");
			// 	console.log('OAuth initialize error: ' + err);
			// }
		},

		// deviceready Event Handler
		onMobileInit: function() {
			app.receivedEvent('mobileinit');
		},
		// Update DOM on a Received Event
		receivedEvent: function(id) {
			if(id == 'deviceready' && typeof navigator.splashscreen != 'undefined'){
				navigator.splashscreen.hide();
			}
		},
		getUrlVars: function() {
			var vars = {};
			var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
				vars[key] = value;
			});
			return vars;
		},
		/* Returns the values in a form as an associative array */
		/* IMPORTANT: Does NOT include password type fields */
		getFormData: function (selector) {
			return $(selector).serializeJSON();
		},
		isObjEmpty: function (obj) {

				if (obj == null) return true;

				if (obj.length > 0)    return false;
				if (obj.length === 0)  return true;

				for (var key in obj) {
					if (hasOwnProperty.call(obj, key)) return false;
				}
				return true;
		},
		render_header : function(){
			var template = Handlebars.templates.header();
			$('.main').prepend( template );
		},
		render_footer : function(){
			var template = Handlebars.templates.footer();
			$('.main').append( template );
		},
		render_home_content : function(){
			var data = {};
			data['nolang'] = true;
			var GET = app.getUrlVars();
			if(GET.lang && GET.lang != ''){
				var langis = 'lang_'+GET.lang;
				data[langis] = true;
				data['nolang'] = false;
			}
			var source   = $("#home_screen_template").html();
			var template = Handlebars.compile(source);
			$('#home_container').html( template(data) );
			if(GET.lang && GET.lang != '')
				app.render_header();
			return;
		},
		render_semblanza : function(offset, filter){

			$.getJSON(api_base_url+'commons/semblanza/' , function(response){
				console.log(response);
				var source   = $("#semblanza_screen_template").html();
				var template = Handlebars.compile(source);
				$('.feed_container').html( template(response) );
			}).fail(function(err){
				console.log(err);
			}).done(function(err){
				app.render_header();
				app.render_footer();
			});
		},
		render_marin_hashtag : function(offset, filter){

			$.getJSON(api_base_url+'content/hashtag/' , function(response){
				console.log(response);
				var source   = $("#marin_hashtag_template").html();
				var template = Handlebars.compile(source);
				$('.feed_container').html( template(response) );
			}).fail(function(err){
				console.log(err);
			}).done(function(err){
				app.render_header();
				app.render_footer();
			});
		},
		render_upload_fromgallery : function(){

			$.getJSON(api_base_url+'content/hashtag/' , function(response){
				console.log(response);
				var source   = $("#marin_hashtag_template").html();
				var template = Handlebars.compile(source);
				$('.feed_container').html( template(response) );
			}).fail(function(err){
				console.log(err);
			}).done(function(err){
				app.render_header();
				app.render_footer();
			});
		},
		get_expos_feed : function(offset){

			$.getJSON(api_base_url+'expos/feed/'+offset , function(response){
				console.log(response);
				var source   = $("#expos_feed_template").html();
				var template = Handlebars.compile(source);
				$('.feed_container').html( template(response) );
			}).fail(function(err){
				console.log(err);
			}).done(function(err){
				app.render_header();
				app.render_footer();
			});
		},
		get_expo_detail : function(expo_id){
			
			$.getJSON(api_base_url+'expos/detail/'+expo_id , function(response){
				console.log(response);
				var source   = $("#expos_single_template").html();
				var template = Handlebars.compile(source);
				$('.single_container').html( template(response) );
			}).fail(function(err){
				console.log(err);
			}).done(function(err){
				app.render_header();
				app.render_footer();
			});
		},
		schedule_expo : function(expo_id){
			
			var response = apiRH.makeRequest('events/schedule/', {event_id: expo_id});
			console.log(response);
		},
		get_search_results: function(search_term, offset){
			$.getJSON( api_base_url+'user/'+user+'/search/'+search_term+'/'+offset , function(response){
				var source   = $("#search_entry_template").html();
				var template = Handlebars.compile(source);
				console.log(response);
				$('.feed_container').append( template(response.data) ).trigger('create');
				/* To do: send block length from the app, change hardcoded 10 */
				if($('#load_more_results').length > 0)
					$('#load_more_results').remove();
				if(response.data == 0){
					$('.feed_container').append( "<a class='load_more' data-role='none'>No hay resultados para tu búsqueda</a>" );
					return;
				}
				if(response.data.results.length < 10){
					$('.feed_container').append( "<a class='load_more' data-role='none'>No hay más resultados</a>" );
					return;
				}
				$('.feed_container').append( "<a class='load_more' id='load_more_results' data-role='none' data-page='"+offset+"'><i class='fa fa-refresh'></i> Cargar más</a>" );
				return;
			});
		},
		get_file_from_device: function(destination, source){
			apiRH.getFileFromDevice(destination, source);		
		},
		showLoader: function(){
			$('#spinner').show();
		},
		hideLoader: function(){
			$('#spinner').hide();
		},
		toast: function(message, bottom){
			try{
				if(!bottom){
					window.plugins.toast.showLongCenter(message);
				}else{
					window.plugins.toast.showLongBottom(message);
				}
			}
			catch(err){
				console.log('Toasting error: ' + JSON.stringify(err));
				alert(message);
			}
			return;
		}
	};

	 /*      _                                       _                        _       
	*   __| | ___   ___ _   _ _ __ ___   ___ _ __ | |_   _ __ ___  __ _  __| |_   _ 
	*  / _` |/ _ \ / __| | | | '_ ` _ \ / _ \ '_ \| __| | '__/ _ \/ _` |/ _` | | | |
	* | (_| | (_) | (__| |_| | | | | | |  __/ | | | |_  | | |  __/ (_| | (_| | |_| |
	*  \__,_|\___/ \___|\__,_|_| |_| |_|\___|_| |_|\__| |_|  \___|\__,_|\__,_|\__, |
	*                                                                         |___/ 
	*/
	jQuery(document).ready(function($) {

		$('body').on('click', '#menu_trigger',function(){
			if(!$(this).hasClass('open')){
				$(this).addClass('open');
				$('#main_menu').slideToggle('fast');
				return;
			}
			$(this).removeClass('open');
			$('#main_menu').fadeOut('fast');
		});
		
		$('body').on('click', '#agendarEvento',function(){
			var evento_id = $(this).data('id');
			console.log(evento_id);
			app.schedule_expo(evento_id);
		});

		

	});