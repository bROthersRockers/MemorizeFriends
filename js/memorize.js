var testing_on = false;

/* number of opened cards*/	
var count = 0;

var pick1 = null;
var pick2 = null;

var $tval_fld = $("#time_value");

var $sval_fld = $("#score_value");

var $log_div = $("#my_log_div");

$(function(){
    bootstrap(); 
    build_board(4, true);
    getConnected();
});

var memlog  = function(message, boldd) {
	setTimeout(function(){
		if(boldd!='undefined' && boldd!=null){
			$log_div.prepend(("&nbsp;<b>" + message + "</b>&nbsp;"));
		} else {
			$log_div.prepend(message);
		}
	}, 1000);
};

bootstrap = function(){
	$('.hover_action').click(function(){				
		if(this.getAttribute('click')!= null) return false;
		if(count < 2 ) {
			var tmp = $('#qm_' + $(this).attr("id"));		
			tmp.animate({left:'50px'},{queue:false,duration:500});
			this.setAttribute('click','click');
			if(count ==1){
				pick2 = this;
				if(pickMatch(pick1, pick2)==true) {
					count = 0;
					setTimeout(updatescore,300);
					// setTimeout($sval_fld.flash('255,0,0', 500), 500);
					memlog(" You made a match! ", true);
					return;
				} else {
					setTimeout(closing,1500);
				}
			} else {
				pick1 = this;
			}
			count = count + 1;
		}
		return false;
	});
};	

pickMatch=function(pick1,pick2){
	var p1imgs = $(pick1).find('img');
	var p2imgs = $(pick2).find('img');
	if( p1imgs.length>1 &&  p2imgs.length>1) {
		var p1 = p1imgs[1].getAttribute('title');
		var p2 = p2imgs[1].getAttribute('title');
		if(p1 == p2){
			pick1.setAttribute('class','opened');
			pick2.setAttribute('class','opened');
			return true;
		} else {
			memlog("You missed.");
		}
	}
	return testing_on;
};

updatescore=function(){
	var newVal = parseInt($sval_fld.text()) + 2;
	$sval_fld.text(newVal);
};

closing = function(){
	if(count == 2) {
		count = 0;
		pick1 = null;
		pick2 = null;
		$('.hover_action').not('.opened').each(function(){
			this.removeAttribute('click');
			$(this).find('img').animate({left:'0px'},{queue:false,duration:800});
		});
	}
};

var getlevel = function(){
	return parseInt($("#level_select option:selected").val());
};

load_board = function(){
	level = getlevel();
	build_board(level, false);
	return size_per_level[level-1];
};

button_clicked = function(){
	document.body.setAttribute('enabled', false);
	$("#card_container").html("");
	level = load_board();
	$sval_fld.text(0);	
	bootstrap();
	add_user_pictures(level);
	setTimeout(function(){
		count_down(level);
		document.body.setAttribute('enabled', true);
	}, 2000);
};

var game_on;
var seconds = 30;

function display() { 
  seconds-=1;
  $tval_fld.text(seconds);
  if(seconds > 0) {
  	setTimeout("display()",1000);
  } else {
  	game_on = false;
  	memlog("Time is up!!!", true);
  	flashElement($tval_fld, 4, 0, 800);
  	flashElement($sval_fld, 4, 0, 800);
  	mssg = 'I\'m having fun and getting good at this one! My New Score: '+$sval_fld.text()+' Yeah! ';
  	FB.ui({ method: 'feed', message: mssg });
  }
};

$(function(){
    $("#debug_cb").click(function() {
          $(this).attr('checked', this.checked);
          if(this.checked==true){
        	$log_div.show();  	
          } else {
          	$log_div.hide();
          }
          return true;
    });
});

count_down = function(board_size) {
   seconds = board_size * board_size * 3;
   $tval_fld.text(seconds);
   if(game_on == null || game_on == false){
      display();
      game_on = true;
   }
};