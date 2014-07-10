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
	var player = new EasySteam(steamID);
	clear();

	player.getPlayerSummaries(displayPlayerData);
	player.getOwnedGames(displayGameData);
	//player.getPlayerAchievements(player.currentAppID);

});

function update(message){
	$('#update').html(message);
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
	//autoHeight:true,
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


function clear(){
	//slide1
	$("#avatar, #stats, #recent").empty();
	
	//slide 2
	$("#holder").jPages("destroy");
	$("#holder, #pizza, #my-cool-chart").empty();

	//slide 3
	$("#games").empty();
}

function clearAchievements(){
	$("#achievements").empty();
}

function displayPlayerData(player){
	$('#avatar').append("<img src=\"" + player.avatar + "\">");
	$('#avatar').append("<h1>" + player.personaname);
}

function displayGameData(player){
	var $gamesHeading = $("<h3>");

	$('#stats').append("Total games:" + player.games.length + " games!<br />");
	$('#stats').append("Total Played games:" + player.played.length + " games!<br />");
	$('#stats').append("Total Unplayed games:" + player.unplayed.length + " games!<br />");
	$('#stats').append("Total Play time:" + player.totalPlayTime + "mins<br />");
	player.displayTime = calculatePlayTime(player.totalPlayTime);
	$('#stats').append(player.displayTime.days + " days, " + player.displayTime.hours + " hours, " + player.displayTime.minutes + " minutes");
	

	player.played.forEach(function(game){
		var source = "http://media.steampowered.com/steamcommunity/public/images/apps/" + game.appid + "/"+ game.img_logo_url + ".jpg";
		var $game = $("<img>", {src:source, class:"game" });
		$('#pizza').append("<li data-value=\"" + game.playtime_forever / player.totalPlayTime * 10 + "\">" + game.name + "</li>");
		if(game.has_community_visible_stats){
			var $link = $("<a>", {appID:game.appid});
			$('#games').append($link);
			$link.append($game);
			$link.click(function(){
				clearAchievements();
				player.getPlayerAchievements(game.appid, displayAchievements);
				$("#owl-demo").trigger('owl.next');
				window.scrollTo(0,0);
			});
		}
	});

	player.recent.forEach(function(game){
		recentDisplayTime = calculatePlayTime(game.playtime_2weeks);
		$('#recent').append("<div class=\"recentGame\">");
		$('.recentGame').last().append("<img src=\"" + "http://media.steampowered.com/steamcommunity/public/images/apps/" + game.appid + "/"+ game.img_logo_url + ".jpg\">");
		$('.recentGame').last().append("<span class=\"recentTitle\">" + game.name + "</span>" + recentDisplayTime.hours + "hours: " + recentDisplayTime.minutes + " mins");
	});

	Pizza.init();
	$("#holder").jPages({
		containerID: "pizza",
		perPage: 20
	});


	$('#games').prepend($gamesHeading);
	($gamesHeading).html("Played Games with Achievements");
}

function displayAchievements(player){
	console.log(player);
	
	player.playerAchievements.forEach(function(achievement){
		var $image = $("<img>", {id:achievement.apiname ,class:"achievement"});
		$('#achievements').append($image);
		if(achievement.achieved){
			$image.addClass("achieved");
		}
	});

	player.gameAchievements.forEach(function(achievement){
		imgage = $('#' + achievement.name);
		if(imgage.hasClass("achieved")){
			imgage.attr("src", achievement.icon);
		}else{
			imgage.attr("src", achievement.icongray);
		}
	});
}


Pizza.init();
$("#holder").jPages({
	containerID: "pizza",
	perPage: 20
});


$( document ).ajaxError(function() {
	console.log( "Triggered ajaxError handler." );
});