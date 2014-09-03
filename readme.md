<h1>EasySteam!</h1>

Visit [easysteam.me](http://easysteam.me) to try the live demo. Feedback is welcome.

This is my experiment with [Valve's Web API](http://steamcommunity.com/dev). Input your Steam ID and if your profile isn't set to private you can see all kinds of stats about your profile.

Your info will load into 4 slides. Click the arrows at the top or drag the slides left and right to navigate.

First slide: Some general stats about your account including your recently played games.

Second slide: A listing of your played games with a pie graph comparing their played time with your total play time. *NOTE*: The first 20 games are currently filling the graph incorrectly. I'm working on a fix.

Third slide: All of the games you have played that have achievements. Click on an image to load that game's achievements into the fourth slide.

Fourth slide: A listing of your completed achievements and those you still need to track down.

I've got [roadmap](https://github.com/averagegrod/easysteam/wiki/Current-Roadmap) on the wiki and I'm open to help or suggestions. If you have a feature you'd like to see please request it or build it.

Absolutly NOTHING about your account is stored and all of the code is available right here. If you do fork this make sure you add your Steam API key to `connect.php` but make sure that you DO NOT accidentally upload it to GitHub or any other publicly visible location. Also, please ensure that you comply with Valve's [API terms of service](http://steamcommunity.com/dev/apiterms).