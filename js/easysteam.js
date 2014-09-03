function EasySteam(steamID){
	this.steamID = steamID;
	this.personaname = '';
	this.avatar = '';
	this.totalPlayTime = 0;
	this.gameCount = 0;
	this.games = 0;
	this.unplayed = [];
	this.played = [];
	this.recent = [];
	this.currentAppID = 440; //  CHANGE THIS! PULLS TF2 TO FILL DATA FOR NOW
	this.currentAppName = '';
	this.playerAchievements = [];
	this.gameAchievements = [];
	this.achieved = [];

}

EasySteam.prototype.getOwnedGames = function(callback){
	var that = this;
	postOptions = { steamID:that.steamID, request:'getOwnedGames' };
	$.post( "connect.php", postOptions, 'json')
	//Do something success-ish
	.success(function(data){
		data = JSON.parse(data);
		that.gameCount = data.response.game_count;
		that.games = data.response.games;
		that.games.forEach(function(game){
			that.totalPlayTime += game.playtime_forever;
			that.played.push(game);
			if(game.playtime_forever === 0){
				that.unplayed.push(game);
				that.played.pop();
			}
			if(game.playtime_2weeks){
				that.recent.push(game);
			}
		});
		callback(that);
	})
	.fail(function() {
		nanobar.go(100);
		console.log("Error:" + data);
	});
};

EasySteam.prototype.getPlayerSummaries = function(callback){
	var that = this;
	postOptions = { steamID:that.steamID, request:'getPlayerSummaries' };
	$.post( "connect.php", postOptions, 'json')
	//Do something success-ish
	.success(function(data){
		data = JSON.parse(data);
		//console.log(data);
		//console.log(data.response);
		//console.log(data.response.players);
		playerData = data.response.players[0];
		that.personaname = playerData.personaname;
		that.avatar = playerData.avatarfull;
		callback(that);
	})
	.fail(function() {
		nanobar.go(100);
		console.log("Error:" + data);
	});
};

EasySteam.prototype.getPlayerAchievements = function(appID, callback){
	var that = this;
	that.currentAppID = appID;
	postOptions = { steamID:that.steamID, appID:that.currentAppID, request:'getPlayerAchievements' };
	$.post( "connect.php", postOptions, 'json')
	//Do something success-ish
	.success(function(data){
		data = JSON.parse(data);
		that.currentAppName = data.playerstats.gameName;
		that.playerAchievements = data.playerstats.achievements;
		that.playerAchievements.forEach(function(achievement){
			if(achievement.achieved){
				that.achieved.push(achievement);
			}
		//that.getSchema(that.currentAppID);
	});
		that.getSchema(callback);
	})
	.fail(function() {
		nanobar.go(100);
		console.log("Error:" + data);
	});
};

EasySteam.prototype.getSchema = function(callback){
	var that = this;
	postOptions = { steamID:that.steamID, appID:that.currentAppID, request:'getSchema' };
	$.post( "connect.php", postOptions, 'json')
	//Do something success-ish
	.success(function(data){
		data = JSON.parse(data);
		that.gameAchievements = data.game.availableGameStats.achievements;
		callback(that);
	})
	.fail(function() {
		nanobar.go(100);
		console.log("Error:" + data);
	});
};