// Grid dimensions
var size_per_level = [4,6,8,10];

var $pane = $("#card_container");

var gsize = 4;

var ccoun = 0;

var cblog = function(message) {
	$("#my_log_div").prepend(" cb: " + message + " ");
};

var card = function(dim) {
	return ("<div class='column grid_" + dim + "'></div>");
};

precalculate = function(level) {
	gsize = size_per_level[level-1];
	ccoun = gsize * gsize / 2;
};

build_board = function(level, is_empty) {
	precalculate(level);
	for (var i=1; i <= gsize; i++) {
		row = "<div class='row'>";
		for (var j=1; j<=gsize; j++) {	
			image_id = "image_" + ((i)+"_"+(j));
			row = placement(row, image_id, is_empty);
		};
		$pane.append(row + "</div>");
	};
};

placement = function(row, image_id, is_empty) {
	var content = [];
	content[0] = "<div id='dvv_" + image_id + "' class='column grid_1'>";
	content[1] = "<ul class='hover_block'><li id='li_" + image_id + "' class='hover_action'>";
	content[2] = "<a id='" + image_id + "' class='user_photo'  href='#' src=''>";
	content[3] = "<img id='qm_li_" + image_id + "' class='questionMark' alt='UWP' src='res/";
	content[4] = (is_empty==true) ? "card_back.png" : "question_mark_48.jpg";
	content[5] = "'>";
	content[6] = "</a></li></ul></div>";
	row = row + content.join('');
	if(gsize < 10) {
		row = row + card(10-gsize);
	}
	return row;
};