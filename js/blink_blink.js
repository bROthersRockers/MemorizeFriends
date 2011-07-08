function flashModule(module_id, color) {
	var highlight = $("#module" + module_id + " .highlight");
	highlight.css({
		backgroundColor: color,
		opacity: 0
	});
	flashElement(highlight, 3, 0, 800);
};

function flashElement(element, repeat, count, duration) {
	element.animate({
		opacity: 0.2
	}, duration / 2, function() {
		element.animate({
			opacity: 0.9
		}, duration / 2, function() {
			count++;
			if(count < repeat)
				flashElement(element, repeat, count, duration);
		});
	});
};


function showAgain(element, duration) {
	element.animate({ opacity: 0.9 }, duration / 2, function() {
		
	});
};

jQuery.fn.flash = function(color, duration)
{
    var current = this.css( 'color' );
    this.animate( { color: 'rgb(' + color + ')' }, duration / 2 );
    this.animate( { color: current }, duration / 2 );
}
//Then use the above function as: