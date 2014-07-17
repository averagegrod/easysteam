var nanobarOptions = {
	bg: '#acf',
	id: 'mynano'
};

var nanobar = new Nanobar( nanobarOptions );

var owlOptions = {
	slideSpeed: 300,
	paginationSpeed: 400,
	singleItem:true,
	//autoHeight:true,
	afterInit: function(elem){
		
		$(".play").click(function(){
			myOwl.trigger('owl.play',1000); //owl.play event accept autoPlay speed as second parameter
		});
		$(".stop").click(function(){
			myOwl.trigger('owl.stop');
		});
	}
};

var myOwl = $("#steamOwl");
myOwl.owlCarousel(owlOptions);
$(".next").click(function(elem){
	elem.preventDefault();
	myOwl.trigger('owl.next');
	console.log("next");
});
$(".prev").click(function(){
	myOwl.trigger('owl.prev');
});

$('#steamID').keydown(function(e){
	if(e.keyCode == 13){
		init();
	}
});

$('#submit').click(function(){
	init();
});

function init(){
	var steamID = $('#steamID').val();
	var player = new EasySteam(steamID);
	clear();

	loadSlides();
	player.getPlayerSummaries(displayPlayerData);
	player.getOwnedGames(displayGameData);
}


$('#tutorial').click(function(){
	clear();
	loadDemoContent();
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




function clear(){
	$(".owl-item").each(function(){
		myOwl.data('owlCarousel').removeItem();
	});
/*
	//slide1
	$("#avatar, #stats, #recent").empty();
	
	//slide 2
	if($("#holder").length){
		$("#holder").jPages("destroy");
		$("#holder, #pizza, #my-cool-chart").empty();
	}

	//slide 3
	$("#games").empty();*/
}

function clearAchievements(){
	//myOwl.data('owlCarousel').removeItem();
	$('#achievements').empty();
}

function loadSlides(){
	var $slide1 = $('<div>', {class:"item"});
	var $slide2 = $('<div>', {class:"item"});
	var $slide3 = $('<div>', {class:"item"});
	var $slide4 = $('<div>', {class:"item"});
	$slide1.load('owlGuts.html #slide1');
	$slide2.load('owlGuts.html #slide2');
	$slide3.load('owlGuts.html #slide3');
	$slide4.load('owlGuts.html #slide4');

	myOwl.data('owlCarousel').addItem($slide1);
	myOwl.data('owlCarousel').addItem($slide2);
	myOwl.data('owlCarousel').addItem($slide3);
	myOwl.data('owlCarousel').addItem($slide4);
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
	myOwl.data('owlCarousel').goTo(3);
}


Pizza.init();
$("#holder").jPages({
	containerID: "pizza",
	perPage: 20
});


$( document ).ajaxError(function() {
	console.log( "Triggered ajaxError handler." );
});

function loadDemoContent(){
	var $playerSlide = $('<div>', {class:"item"});
	var $playerGameSlide = $('<div>', {class:"item"});
	$playerSlide.load('ignore/demo.html #demoUser');
	
	myOwl.data('owlCarousel').addItem($playerSlide);
	$playerGameSlide.load('ignore/demo.html #demoGame', function(){
		myOwl.data('owlCarousel').addItem($playerGameSlide);
		Pizza.init();
		$("#holder").jPages({
			containerID: "pizza",
			perPage: 20
		});
	});

	

}