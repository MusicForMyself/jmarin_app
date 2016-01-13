var app = {
    app_context: this,
    initialize: function() {
        this.bindEvents(), $.ajaxSetup({
            async: !1
        }), app.registerPartials(), this.ls = window.localStorage;
        var e = JSON.parse(this.ls.getItem("museo_log_info"));
        if (window.user = e ? e.user_login : "", window.user_id = e ? e.user_id : "", window.user_role = e ? e.user_role : "", window.apiRH = (new requestHandlerAPI).construct(app), apiRH.has_token()) {
            var n = apiRH.has_valid_token();
            if (n) {
                $(this).data("id");
                console.log("You okay, now you can start making calls");
                var a = window.is_home;
                return void(a && window.location.assign("feed.html?filter_feed=all"))
            }
            return void console.log("Your token is not valid anymore (or has not been activated yet)")
        }
        console.log(JSON.stringify(apiRH.getRequest("robots", null))), console.log(apiRH.request_token().get_request_token())
    },
    registerPartials: function() {
        var e = ["header", "footer"];
        e.forEach(function(e) {
            $.ajax({
                url: "views/partials/" + e + ".hbs",
                success: function(n) {
                    void 0 === Handlebars.templates && (Handlebars.templates = {}), Handlebars.templates[e] = Handlebars.compile(n)
                }
            })
        })
    },
    registerTemplate: function(e) {
        $.ajax({
            url: "views/" + e + ".hbs",
            success: function(n) {
                void 0 === Handlebars.templates && (Handlebars.templates = {}), Handlebars.templates[e] = Handlebars.compile(n)
            }
        })
    },
    bindEvents: function() {
        document.addEventListener("deviceready", app.onDeviceReady, !1), document.addEventListener("mobileinit", app.onDMobileInit, !1)
    },
    openNativeAppWindow: function(data) {
        window.open(data, '_system')
    },
    onDeviceReady: function() {
        app.receivedEvent("deviceready")
    },
    onMobileInit: function() {
        app.receivedEvent("mobileinit")
    },
    receivedEvent: function(e) {
        "deviceready" == e && "undefined" != typeof navigator.splashscreen && navigator.splashscreen.hide()
    },
    getUrlVars: function() {
        var e = {};
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(n, a, o) {
            e[a] = o
        });
        return e
    },
    getFormData: function(e) {
        return $(e).serializeJSON()
    },
    isObjEmpty: function(e) {
        if (null == e) return !0;
        if (e.length > 0) return !1;
        if (0 === e.length) return !0;
        for (var n in e)
            if (hasOwnProperty.call(e, n)) return !1;
        return !0
    },
    render_header: function() {
        var e = Handlebars.templates.header();
        $(".main").prepend(e)
    },
    render_footer: function() {
        var e = Handlebars.templates.footer();
        $(".main").append(e)
    },
    render_home_content: function() {
        var e = {};
        e.nolang = !0;
        var n = app.getUrlVars();

        if (n.lang && "" != n.lang) {
            this.ls.setItem("devicelang", n.lang);
            var a = "lang_" + n.lang;
            e[a] = !0, e.nolang = !1
        }else if(this.ls.getItem("devicelang") != ""){

            n.lang = this.ls.getItem("devicelang");
            var a = "lang_" + n.lang;
            e[a] = !0, e.nolang = !1
        }
        
        $.getJSON(api_base_url + "content/home/", function(r) {
           
        }).fail(function(r) {
            ;
        }).done(function(r) {
           console.log( "JSON: " + r.gallery[0]);
           e['slider-1'] = r.gallery[0];
           e['slider-2'] = r.gallery[1];
           e['slider-3'] = r.gallery[2];
        })

        console.log(e)
        var o = $("#home_screen_template").html(),
        t = Handlebars.compile(o);
        $("#home_container").html(t(e)), n.lang && "" != n.lang && app.render_header()
    },
    render_semblanza: function(e, n) {
        $.getJSON(api_base_url + "commons/semblanza/?devicelang=" + this.ls.getItem('devicelang'), function(e) {
            var n = $("#semblanza_screen_template").html(),
                a = Handlebars.compile(n);
            $(".feed_container").html(a(e))
        }).fail(function(e) {
            console.log(e)
        }).done(function(e) {
            app.render_header(), app.render_footer()
        })
    },
    render_marin_hashtag: function(e, n) {
        $.getJSON(api_base_url + "content/hashtag/", function(e) {
            var n = {
                pool: e
            };
            console.log(n);
            var a = $("#marin_hashtag_template").html(),
                o = Handlebars.compile(a);
            $(".feed_container").html(o(n))
        }).fail(function(e) {
            console.log(e)
        }).done(function(e) {
            app.render_header(), app.render_footer()
        })
    },
    render_upload_fromgallery: function() {
        $.getJSON(api_base_url + "content/hashtag/", function(e) {
            console.log(e);
            var n = $("#marin_hashtag_template").html(),
                a = Handlebars.compile(n);
            $(".feed_container").html(a(e))
        }).fail(function(e) {
            console.log(e)
        }).done(function(e) {

            app.render_header(), app.render_footer()
        })
    },

    upload_file_choice: function(){
        apiRH.fileupload_choice()
    },

    get_expos_feed: function(e) {
         var lang = this.ls.getItem('devicelang');
        $.getJSON(api_base_url + "expos/feed/" + e + "?devicelang=" + this.ls.getItem('devicelang'), function(e) {

            console.log(e);

            var n = $("#expos_feed_template").html(),
                a = Handlebars.compile(n);
            $(".feed_container").html(a(e))
        }).fail(function(e) {
            console.log(e)
        }).done(function(e) {
            app.render_header(), app.render_footer()
        })
    },

    get_expo_detail: function(e) {
        $.getJSON(api_base_url + "expos/detail/" + e + "?devicelang=" + this.ls.getItem('devicelang'), function(e) {
            console.log(e);
            var n = $("#expos_single_template").html(),
                a = Handlebars.compile(n);
            $(".single_container").html(a(e))
        }).fail(function(e) {
            console.log(e)
        }).done(function(e) {
            app.render_header(), app.render_footer()
        })
    },

    schedule_expo: function(t, e, n, di, df) {

    // prep some variables

    var fi = di.split(".");
    var ff= df.split(".");

    var startDate = new Date(fi[2],fi[1],fi[0],0,0,0,0,0); 
    var endDate = new Date(ff[2],ff[1],ff[0],0,0,0,0,0);


        window.plugins.calendar.createEventInteractively(t, e, n, startDate, endDate, app.successCalendar, app.errorCalendar)
    },

    successCalendar: function() {
        return !0
    },
    errorCalendar: function() {
        return !1
    },
    get_search_results: function(e, n) {
        $.getJSON(api_base_url + "user/" + user + "/search/" + e + "/" + n, function(e) {
            var a = $("#search_entry_template").html(),
                o = Handlebars.compile(a);
            return console.log(e), $(".feed_container").append(o(e.data)).trigger("create"), $("#load_more_results").length > 0 && $("#load_more_results").remove(), 0 == e.data ? void $(".feed_container").append("<a class='load_more' data-role='none'>No hay resultados para tu búsqueda</a>") : e.data.results.length < 10 ? void $(".feed_container").append("<a class='load_more' data-role='none'>No hay más resultados</a>") : void $(".feed_container").append("<a class='load_more' id='load_more_results' data-role='none' data-page='" + n + "'><i class='fa fa-refresh'></i> Cargar más</a>")
        })
    },
    get_file_from_device: function(e, n) {
        apiRH.getFileFromDevice(e, n)
    },
    showLoader: function() {
        $("#spinner").show()
    },
    hideLoader: function() {
        $("#spinner").hide()
    },
    toast: function(e, n) {
        try {
            n ? window.plugins.toast.showLongBottom(e) : window.plugins.toast.showLongCenter(e)
        } catch (a) {
            console.log("Toasting error: " + JSON.stringify(a)), alert(e)
        }
    }
};

jQuery(document).ready(function(e) {
    e("body").on("click", "#menu_trigger", function() {
        return e(this).hasClass("open") ? (e(this).removeClass("open"), void e("#main_menu").fadeOut("fast")) : (e(this).addClass("open"), void e("#main_menu").fadeIn("fast"))
    }), e("body").on("click", "#uploadFromGallery", function() {
        app.get_file_from_device("hashtag", "gallery")
    }), e("body").on("click", "#uploadFromCamera", function() {
        app.get_file_from_device("hashtag", "camera")
    }), e("body").on("click", ".trigger_gallery", function() {
        var n = e(this);
        e("#gallery_container").fadeIn("fast"), e("#gallery_swap").prop("src", n.data("url")), e("#insert_comment").text(n.data("comment")), e("#insert_description").text(n.data("description"))
    }), e("body").on("click", ".close", function() {
        e(this).parent().fadeOut("fast")
    }), e("body").click("uploadFileStorage", function() {
        app.upload_file_choice()
    })
});

$(document).scroll(function(e) {
    var mmain = $("#main_menu");

    if (!mmain.hasClass('open')) {

        $('#main_menu').removeClass('open');
        $('#main_menu').fadeOut('fast');
        return;
    }
    return;
});

$('body').click("tap", function tapHandler(e) {
    console.log($(e.target).attr('id'));
    var mmain = $("#main_menu");

    if (!mmain.hasClass('open') && $(e.target).attr('id') != 'menu_trigger') {
        $('#main_menu').removeClass('open');
        $('#main_menu').fadeOut('fast');
        return;
    }
});

$(document).scroll(function(e){
    var mmain = $("#main_menu");
    
    if(!mmain.hasClass('open')) {
    	
        $('#main_menu').removeClass('open');
		$('#main_menu').fadeOut('fast');
		return;
    }
    return;
});


$('body').click( "tap", function tapHandler( i ){  
	console.log($(e.target).attr('id'));  
	var mmain = $("#main_menu");
	
	if(!mmain.hasClass('open') && $(e.target).attr('id') != 'menu_trigger') {
		$('#main_menu').removeClass('open');
		$('#main_menu').fadeOut('fast');
		return;
	}
	}
);

