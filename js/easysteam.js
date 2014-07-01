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
	requestData(steamID, 'getOwnedGames');
	requestData(steamID, 'getPlayerSummaries');
}

function requestData(steamID, request){
	nanobar.go(10);
	update('Fetching account data.');
	$.post( "connect.php", { steamID:steamID, request:request }, 'json')
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
	$('#name').append(player.personaname);
	$('#avatar').append("<img src=\"" + player.avatar + "\">");
}

function setGameData(data){
	update('Counting up your games');
	nanobar.go(20);
	player = {};
	player.totalPlayTime = 0;
	player.gameCount = data.response.game_count;
	player.games = data.response.games;
	console.log(player.games.length);
	player.unplayed = [];
	player.played = [];

	player.games.forEach(function(game){
		player.totalPlayTime += game.playtime_forever;
		player.played.push(game);
		if(game.playtime_forever === 0){
			player.unplayed.push(game);
			player.played.pop();
		}
		$('#resultList').append("<li>" + game.name +  " " + game.playtime_forever + "</li>");
	});

	player.played.forEach(function(game){
		$('#pizza').append("<li data-value=\"" + game.playtime_forever / player.totalPlayTime * 10 + "\">" + game.name + "</li>");
		
	});
	$('#result').before("Total Unplayed games:" + player.unplayed.length + " games!</ br>");
	$('#result').before("Total Played games:" + player.played.length + " games!</ br>");
	$('#result').before("Total Play time:" + player.totalPlayTime + "mins");
	//paginate(player.played.length);
	Pizza.init();
	$("#holder").jPages({
		containerID: "pizza",
		perPage: 20
	});
}

function paginate(games){
	pages = Math.floor(games/20);
	console.log(pages);
	for(i=0; i<pages; i++){
		$('.pagination').append("<li><a href=\"\">" + i+1 + "</a></li>");

	}
	/*$('.pagination').prepend("<li class=\"arrow unavailable\"><a href=\"\">&laquo;</a></li>");
	$('.pagination').append("<li class=\"arrow\"><a href=\"\">&raquo;</a></li>");*/
}

						

$("#owl-demo").owlCarousel({
	navigation : true, // Show next and prev buttons
	slideSpeed : 300,
	paginationSpeed : 400,
	singleItem:true

	// "singleItem:true" is a shortcut for:
	// items : 1, 
	// itemsDesktop : false,
	// itemsDesktopSmall : false,
	// itemsTablet: false,
	// itemsMobile : false
});

$("#owl2").owlCarousel({
	navigation : true, // Show next and prev buttons
	slideSpeed : 300,
	paginationSpeed : 400,
	singleItem:true

	// "singleItem:true" is a shortcut for:
	// items : 1, 
	// itemsDesktop : false,
	// itemsDesktopSmall : false,
	// itemsTablet: false,
	// itemsMobile : false
});

