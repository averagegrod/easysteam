<?php
	$apikey = ''; // put your API key here 
		switch ($_POST['request']){
		case "getPlayerSummaries":
		$response = file_get_contents('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' . $apikey . '&steamids=' . $_POST["steamID"]);
		break;
		case "getOwnedGames":
		$response = file_get_contents('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' . $apikey . '&steamid=' . $_POST["steamID"]  . '&format=json&include_appinfo=1');
		break;
		case "getPlayerAchievements":
		$response = file_get_contents('http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=' . $_POST["appID"] . '&key=' . $apikey . '&steamid=' . $_POST["steamID"]);
		break;
		case "getSchema":
		$response = file_get_contents('http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?appid=' . $_POST["appID"] . '&key=' . $apikey);
		break;
}
	echo $response;
?>