var is_test = true;

get_user_picture_path = function(user_id){
	return "http://graph.facebook.com/" + user_id + "/picture";
};
	
/* Add user friends as card backgrounds */
add_user_pictures = function(user_id, limit){
	counter = 0;
	$.getJSON("https://graph.facebook.com/"+user_id+"/friendlists?access_token="+get_token(), {}, 
	  	function(data) {
			$.each(data.items, function(i,item){
				counter++;
				image_path = get_user_picture(item.id);
				next_id = "img_" + counter;
				current_css = $("#" + next_id).css(); 
				$("#" + next_id).css(current_css + "background:url('" + image_path + "')");
				/* Check card limit */
  				if(counter==limit) return false;
  			});
  		}
  	);
}

var facebook_token_url = function(){
	return "https://graph.facebook.com/oauth/access_token?" +
    "client_id=" + facebook_app_id_holder() + "&client_secret=" + facebook_app_secret_holder() +
    "&grant_type=client_credentials";
}

var get_token = function(){
    $.getJSON(facebook_token_url, {}, 
	  	function(data) {
			return data;
		}
   );
};

test_facebook_images = function(limit){
  user_id = facebook_user_id_holder();
  add_user_pictures(user_id, limit);
}
