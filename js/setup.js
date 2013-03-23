// if(!/(&|\?)username=/.test(window.location.search)){
//   var newSearch = window.location.search;
//   if(newSearch !== '' & newSearch !== '?'){
//     newSearch += '&';
//   }
//   newSearch += 'username=' + (prompt('What is your name?') || 'anonymous');
//   window.location.search = newSearch;
// }

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

	function postMessage (message){
		$.ajax(url, {
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(message),
		dataType: 'JSON',
		success: function(){
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
	
	$("#button").on('click', function(e){
		e.preventDefault();
		$('.first').empty();
		username = $("input[name=username]").val();
		text = $("textarea").val();
		roomname = $("input[name=roomname]").val();
		message = {'username': username,'text': text,'roomname': roomname};
		postMessage(message);
	});
	
	$("#main").on('click', '.post', function(){
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
});