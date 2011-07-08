var is_test = true;
/*
 * Main Facebook Configuration
 */
var logged = 0;

var user_id = 'me()';

var fbid = '145355405525928';

FB.init({
	appId : fbid,
	status : true,
	cookie : true,
	xfbml : true
});

var uid = FB.getSession().uid;

/*
 * Main Facebook Helpers
 */
function fblog(message) {
	$("#my_log_div").prepend(" fb: "+ message + "<br/> ")
};

function getLogged() {
	var isl = 0;
	if(FB.getLoginStatus()==null) {
		fblog("Authentication in progress...");
		FB.login( function(response) {
			isl = (response.session? 1 : 0);
		});
	} else {
		isl = 1;
	}
	return isl;
};

function loadMyProfile() {
	FB.api('/me', function(user) {
		if(user != null) {
			fblog("Loading profile information...");
			var image = document.getElementById('profile_image');
			image.src = 'http://graph.facebook.com/' + user.id + '/picture';
			var name = document.getElementById('nickname');
			name.innerHTML = user.name
		}
	});
};

function getConnected() {
	logged = getLogged();
	if(logged == 1) {
		fblog("Sucessfully logged in.");
		loadMyProfile();
	} else {
		logged = 0;
		/*$("#login_fb_holder").append('<fb:login-button show-faces="false" width="100" max-rows="5"></fb:login-button>');*/
		fblog("<b>Not logged in!</b>");
	}
};

/*
 * Main Facebook Functions
 */
function invite() {
	FB.ui({
		method: 'apprequests',
		message: 'You should learn more about this awesome Memorize Friends game.',
		data: 'tracking information for the user'
	});
};

function postMessage() {
	FB.ui({
		method: 'feed',
		name: 'Facebook Dialogs',
		link: 'http://developers.facebook.com/docs/reference/dialogs/',
		picture: 'http://fbrell.com/f8.jpg',
		caption: 'Reference Documentation',
		description: 'Dialogs provide a simple, consistent interface for applications to interface with users.',
		message: 'Facebook Dialogs are easy!'
	}, function(response) {
		if (response && response.post_id) {
			alert('Post was published.');
		} else {
			alert('Post was not published.');
		}
	});
};

/*
 * Common helpers
 */

function demoPost() {
	var body = 'Reading Connect JS documentation';
	FB.api('/me/feed', 'post', {
		message: body
	}, function(response) {
		if (!response || response.error) {
			alert('Error occured');
		} else {
			alert('Post ID: ' + response.id);
		}
	});
};

var imgkey = function(xcord, ycord) {
	return ["image_",xcord,"_",ycord].join('');
};

var rndm = function(limit) {
	return rnxy(1, limit);
};

function rnxy(minVal,maxVal,floatVal) {
	var randVal = minVal+(Math.random()*(maxVal-minVal));
	return (typeof floatVal=='undefined') ? Math.round(randVal) : randVal.toFixed(floatVal);
};

function canin(array, inst) {
	return (array.indexOf(inst)=='undefined' || array.indexOf(inst)==null || array.indexOf(inst)<0);
};

function imgtag(uid, image_path) {
	return ('<img class="user_photo" src="'+image_path+'" title="'+uid+'"/>');
};

/* Add user friends as card backgrounds.
 *
 * Task description
 *
 * There can be 16,  36,  64,  or  100 cards on  the board. Each
 * picture is placed  on two  cards. User may  have less or more
 * friends then needed for some level. If user have less friends
 * then needed for selected leve, user is  automaticly  switched
 * to appropriate level. Is  most cases user have  more  friends
 * then  needed, and 8,18,32 or 50 friends  picures is needed to
 * be able to play.
 *
 * First 4 helpers
 */
function add_user_pictures(limit) {
	var qry = FB.Data.query('SELECT uid, name, pic_square FROM user WHERE uid={0} OR uid IN (SELECT uid2 FROM friend WHERE uid1={1})', uid, uid);
	qry.wait(function(rows) {
		process_qfriends(rows, limit);
	});
	fblog("Waiting for row data...");
	$.blockUI({ css: { 
        border: 'none', 
        padding: '15px', 
        backgroundColor: '#000', 
        '-webkit-border-radius': '10px', 
        '-moz-border-radius': '10px', 
        opacity: .5, 
        color: '#fff' 
    } });
};

function process_qfriends(friends, limit) {
	fblog("Processing friends ...");
	var max_pict = (limit*limit/2);
	var selected_friends = new Array();
	var counter = 500000;
	while((selected_friends.length <= max_pict) && (counter>0)) {
		counter -= 1;
		var rnfriend = rnxy(2, friends.length-1);
		if(canin(selected_friends, friends[rnfriend])) {
			selected_friends.push(friends[rnfriend]);
		}
	}
	if(counter==0){
		fblog('ERROR!!! Timeout received.');	
	}
	fblog('Randomly selected ' + max_pict + ' friends from list');

	var s1 =  $.shuffle(selected_friends);
	var s2 =  $.shuffle(s1);
        for(var c=0; c <= 5; c++){
                s1 = $.shuffle(s1);
                s2 = $.shuffle(s2);
        }
	selected_friends = $.shuffle(s2.concat(s1));

	for (var i=1; i <= limit; i++) {
		for (var j=1; j <= limit; j++) {
			img = selected_friends.pop();
			$("#"+imgkey(i,j)).append(imgtag(img.uid, img.pic_square));
		}
	}
	fblog('Randomly placed ' + (2*max_pict) + ' images on the board.');
	$.unblockUI();
};


/*
 * jQuery shuffle
 *
 * Copyright (c) 2008 Ca-Phun Ung <caphun at yelotofu dot com>
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://yelotofu.com/labs/jquery/snippets/shuffle/
 *
 * Shuffles an array or the children of a element container.
 * This uses the Fisher-Yates shuffle algorithm <http://jsfromhell.com/array/shuffle [v1.0]>
 */
 (function($){
	$.fn.shuffle = function() {
		return this.each(function(){
			var items = $(this).children().clone(true);
			return (items.length) ? $(this).html($.shuffle(items)) : this;
		});
	}
	$.shuffle = function(arr) {
		for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
		return arr;
	}
})(jQuery);
