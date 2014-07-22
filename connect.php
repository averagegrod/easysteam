<?php
	$apikey = ''; // put your API key here 
	$steamID = trim($_POST["steamID"]);
	switch ($_POST['request']){
		case "getPlayerSummaries":
		$response = file_get_contents('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' . $apikey . '&steamids=' . $steamID);
		break;
		case "getOwnedGames":
		$response = file_get_contents('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' . $apikey . '&steamid=' . $steamID  . '&format=json&include_appinfo=1');
		break;
		case "getPlayerAchievements":
		$response = file_get_contents('http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=' . $_POST["appID"] . '&key=' . $apikey . '&steamid=' . $steamID);
		break;
		case "getSchema":
		$response = file_get_contents('http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?appid=' . $_POST["appID"] . '&key=' . $apikey);
		break;
	}
	echo $response;

	function steamToCommunity($idString){
		$idString = ($idString - 76561197960265728) / 2;
		return $idString;

	}

	function SteamIDStringToSteamID($idString, $type = 1, $instance = 1) {
		$parts = explode(':', str_replace('STEAM_', '', $idString));

		echo("<pre>parts: " );
		var_dump($parts);
		echo("</pre>");
	// You should check here that $parts is valid

		$universe = (int)$parts[0];
		if ($universe == 0) {
			$universe = 1;
		}

		$steamID2 = ($universe << 56) | ($type << 52) | ($instance << 32) | ((int)$parts[2] << 1) | (int)$parts[1];

		var_dump($universe<<56);
		return $steamID2;
	}

	?>