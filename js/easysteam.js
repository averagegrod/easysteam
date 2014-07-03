var nanobarOptions = {
	bg: '#acf',
	id: 'mynano'
};

var nanobar = new Nanobar( nanobarOptions );


$('form input').keydown(function(event){
			/*if(event.keyCode == 13) {
				event.preventDefault();
				var steamID = $('#steamID').val()
				
				setPlayer(steamID);


				return false;
			}*/
		});

$('#submit').click(function(){
	var steamID = $('#steamID').val();
	updateAllData(steamID);
});

function update(message){
	$('#update').html(message);
}

function updateAllData(steamID){
	requestData(steamID, 'getOwnedGames', {});
	requestData(steamID, 'getPlayerSummaries', {});
	getAchievments();
}

function requestData(steamID, request, options){
	nanobar.go(10);
	update('Fetching account data.');
	if(options['appID']){ 
		postOptions = { steamID:steamID, appID:options['appID'], request:request };
	}else{
		postOptions = { steamID:steamID, request:request };
	}
	$.post( "connect.php", postOptions, 'json')
	//Do something success-ish
	.done(function(data){
		data = JSON.parse(data);
		switch (request) {
			case 'getPlayerSummaries':
			update('Player Data Received.');
			setPlayerData(data);
			break;
			case 'getOwnedGames':
			update('Game Data Received.');
			setGameData(data);
			break;
			case 'getPlayerAchievements':
			console.log(data);
			break;
		}
	});
}

function setPlayerData(data){
	update('Figuring out who you are.');
	nanobar.go(15);
	player = {};
	playerData = data.response.players[0];
	player.personaname = playerData.personaname;
	player.avatar = playerData.avatarfull;
	$('#avatar').append("<img src=\"" + player.avatar + "\">");
	$('#avatar').append("<h1>" + player.personaname);

}

function setGameData(data){
	update('Counting up your games');
	nanobar.go(20);
	player = {};
	player.totalPlayTime = 0;
	player.gameCount = data.response.game_count;
	player.games = data.response.games;
	player.unplayed = [];
	player.played = [];
	player.recent = [];

	player.games.forEach(function(game){
		player.totalPlayTime += game.playtime_forever;
		player.played.push(game);
		if(game.playtime_forever === 0){
			player.unplayed.push(game);
			player.played.pop();
		}
		if(game.playtime_2weeks){
			recentDisplayTime = calculatePlayTime(game.playtime_2weeks);
			player.recent.push(game);
			$('#recent').append("<div class=\"recentGame\">");
			$('.recentGame').last().append("<img src=\"" + "http://media.steampowered.com/steamcommunity/public/images/apps/" + game.appid + "/"+ game.img_logo_url + ".jpg\">")
			$('.recentGame').last().append("<span class=\"recentTitle\">" + game.name + "</span>" + recentDisplayTime.hours + "hours: " + recentDisplayTime.minutes + " mins");
		}
	});

	player.played.forEach(function(game){
		$('#pizza').append("<li data-value=\"" + game.playtime_forever / player.totalPlayTime * 10 + "\">" + game.name + "</li>");
		
	});
	$('#stats').append("Total games:" + player.games.length + " games!<br />");
	$('#stats').append("Total Played games:" + player.played.length + " games!<br />");
	$('#stats').append("Total Unplayed games:" + player.unplayed.length + " games!<br />");
	$('#stats').append("Total Play time:" + player.totalPlayTime + "mins<br />");
	player.displayTime = calculatePlayTime(player.totalPlayTime);
	$('#stats').append(player.displayTime.days + " days, " + player.displayTime.hours + " hours, " + player.displayTime.minutes + " minutes");

	Pizza.init();
	$("#holder").jPages({
		containerID: "pizza",
		perPage: 20
	});
}

function calculatePlayTime(minutes){
	time = {};
	time.hours = Math.floor(minutes/60);
	time.days = Math.floor(time.hours/24);
	time.minutes = minutes % 60;
	if(time.days >0){
		time.hours %= time.days;
	}
	return(time);
}

$("#owl-demo").owlCarousel({
	slideSpeed: 300,
	paginationSpeed: 400,
	singleItem:true,
	afterInit: function(elem){
		$(".next").click(function(){
			$("#owl-demo").trigger('owl.next');
		});
		$(".prev").click(function(){
			$("#owl-demo").trigger('owl.prev');
		});
		$(".play").click(function(){
			$("#owl-demo").trigger('owl.play',1000); //owl.play event accept autoPlay speed as second parameter
		});
		$(".stop").click(function(){
			$("#owl-demo").trigger('owl.stop');
		});

	}

	// "singleItem:true" is a shortcut for:
	// items : 1, 
	// itemsDesktop : false,
	// itemsDesktopSmall : false,
	// itemsTablet: false,
	// itemsMobile : false
});

function getAchievments(){
	var steamID = $('#steamID').val();
	var appID = 440;
	requestData(steamID, 'getPlayerAchievements', {appID:appID});
}




