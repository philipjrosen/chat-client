if(!/(&|\?)username=/.test(window.location.search)){
  var newSearch = window.location.search;
  if(newSearch !== '' & newSearch !== '?'){
    newSearch += '&';
  }
  newSearch += 'username=' + (prompt('What is your name?') || 'anonymous');
  window.location.search = newSearch;
}

// Don't worry about this code, it will ensure that your ajax calls are allowed by the browser
$.ajaxPrefilter(function(settings, _, jqXHR) {
  jqXHR.setRequestHeader("X-Parse-Application-Id", "voLazbq9nXuZuos9hsmprUz7JwM2N0asnPnUcI7r");
  jqXHR.setRequestHeader("X-Parse-REST-API-Key", "QC2F43aSAghM97XidJw8Qiy1NXlpL5LR45rhAVAf");
});

$(document).ready(function(){
	var url = 'https://api.parse.com/1/classes/bigchat';
	var index = 0;
	var friends = [];
	var rooms = [];
	var this_room_msgs = [];
	//GET THE MESSAGES ON LOAD
	getMessagesOnLoad();

	function getMessagesOnLoad (){
		$.ajax(url,{
		contentType: 'application/json',
		success: function(data){
			_.each(data.results,function(elem){
				rooms.push(elem.roomname);
				var html = buildHTML(elem.username, elem.text, elem.roomname);
				$('#main div:first').prepend(html); 
			});
			rooms = _.uniq(rooms);
			_.each(rooms,function(val){buildSelect(val)});

			//NOT WORKING(IN FOR LOOP:
			// if(_.contains(friends,uname)){
			// 	$('[data-username ='+uname+']').addClass('bold');
			// }
		}
		});
	}

	function getRoomMessages (rname){
		contentType: 'application/json',
		$.ajax(url,{
			success: function(data) {
				//if the message matchs the roomname push it into an array
			this_room_msgs = _.filter(data.results, function(elem){return rname === elem.roomname; });	
			_.each(this_room_msgs,function(elem){
				var html = buildHTML(elem.username, elem.text, elem.roomname);
				$('#main div:first').prepend(html); 
			});
			}
		});
	}

	// function getRoomMessages (rname){
	// 	$.ajax(url,{
	// 	contentType: 'application/json',
	// 		success: function(data) {
	// 			var rm_msgs = [];
	// 			var HTML = [];
	// 			rm_msgs = _.filter(data.results, function(elem){return rname === elem.roomname; });
	// 			for (var i = 0; i < rm_msgs.length; i++) {
	// 				//console.log("rm_msgs["+i+"].roomname:" + rm_msgs[i].roomname);
	// 				if(!rm_msgs[i].roomname){rm_msgs[i].roomname = "Main"};
	// 				HTML.push(buildHTML(rm_msgs[i].username, rm_msgs[i].text, rm_msgs[i].roomname));
	// 			}	
	// 			for (var i = 0; i < HTML.length; i++) {
	// 				$('#main div:first').after(HTML[i]);
	// 			}	
	// 		}
	// 	});
	// }

	function postMessage (message){
		$.ajax(url, {
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(message),
		dataType: 'JSON',
		success: function(){
			//$('#main').empty();
			getMessagesOnLoad();
		}
		});
	};
	
	function buildHTML (uname,txt,rname){
		var html = '<div class="post" data-username="'+uname+'"><p class="username">username: ' + uname+ '</p>' +
			'<p class="message">messsage: ' + txt + '</p>' +
			'<p class="roomname">room: ' + rname + '</p></div>';
		return html;
	}

	function buildSelect (rname) {
		var options = '<option value="'+rname+'">'+rname+'</option>';
		$('select option:first').after(options); 
	}
	
	
	var username = "";
	var text = "";
	var roomname= "";
	var message = {};
	var rooms = [];
	
	$("#button").on('click', function(e){
		e.preventDefault();
		username = $("input[name=username]").val();
		text = $("textarea").val();
		roomname = $("input[name=roomname]").val();
		message = {'username': username,'text': text,'roomname': roomname};
		postMessage(message);
	});
	
	$("#main").on('click', '.first', function(){
		var friend = $(this).data("username");
		$('[data-username ='+friend+']').addClass('bold');
		friends.push(friend);
	});

	$('select').change(function(e){
		e.preventDefault();
		$('.first').empty();
		var chatroom = $(this).val();
		getRoomMessages(chatroom);
	});

	









	// var createRoom = function(roomname) {
	// 	if(!roomname || _.contains(rooms,roomname)) {return;}
	// 	else {
	// 		var html	

	// 	}
	// }

	// $(document).on('click', '.username', function(){
 //    var name = $(this).data('username');
 //    $("div[data-username='"+name+"']").addClass('bold');
 //    friends.push(name);
 //  });

});


// function injectHTML (data){
	// 	for(var i = 0; i < data.results.length; i++) {
	// 		var uname = data.results[i].username;
	// 		var txt = data.results[i].text;
	// 		var rname = data.results[i].roomname; 
	// 		var html = '<div class="'+rname+'" data-username="'+uname+'"><p class="username">username: ' + uname+ '</p>' +
	// 		'<p class="message">messsage: ' + txt + '</p>' +
	// 		'<p class="roomname">room: ' + rname + '</p></div>';
	// 		$('#main div:first').after(html);
	// 		if(_.contains(friends,uname)){
	// 			$('[data-username ='+uname+']').addClass('bold');
	// 		}
	// 	}
	// }


	// var html = '<div class="post" data-username="'+uname+'"><p class="username">username: ' + uname+ '</p>' +
				// '<p class="message">messsage: ' + txt + '</p>' +
				// '<p class="roomname">room: ' + rname + '</p></div>';

	// var room_messages = _.filter(data.results, function(elem){ 
	// 	return rname === elem.roomname; });
	// 	console.log(room_messages);
// for(var i = 0; i<HTML.length; i++){
				// 	console.log("HTML: " +HTML[i]);
				// }
			// HTML = _.map(rm_msgs,function(elem, index, room) {return buildHTML(rm_msgs.username, rm_msgs.text, rm_msgs.roomname); });
			// for (var i = 0; i<=HTML.length;i++){console.log(HTML[i])};
			// _.each(HTML, function (val) {$('#main div:first').after(HTML); });

// for(var i = 0; i < res.length; i++) {
			// 	var html = buildHTML(res[i].username, res[i].text, res[i].roomname);
			// 	$('#main div:first').after(html); 
			// }