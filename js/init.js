$(document).ready(function(){
    var element = document.getElementById('example-clock-container');
    element.innerHTML = '<header id="clock-time"></header>';
    var timer = new ProgressBar.Circle(element, {
        duration: 500,
        trailColor: "white",
        color: "#d68f87",
        strokeWidth: 3
    });
    var textElement = document.getElementById('clock-time');

    timer.animate(0, function() {
        textElement.innerHTML = 'Loading...';
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var userDate = new Date();
            var times = SunCalc.getTimes(userDate, position.coords.latitude, position.coords.longitude);
            //updateAdditionalInfo(times);
            setInterval(function(){
                if (userDate > times.sunset) {
                    times = SunCalc.getTimes(userDate, position.coords.latitude, position.coords.longitude);
                    //updateAdditionalInfo(times);
                }
                calculateTimeLeft(times, userDate, timer);
                userDate = new Date();
            }, 1000);

        });
    }
    else {
        console.log('fail!');
    }
});

function calculateTimeLeft(times, userDate, timer) {
    var timeString;
    var timeStart = userDate;
    var timeEnd = times.sunset;
    if (userDate < times.sunrise){
        timeStart = times.sunrise;
    }

    var milliseconds = timeEnd - timeStart;
    if (milliseconds > 0) {
        var hours = Math.floor(milliseconds / 36e5),
            mins = Math.floor((milliseconds % 36e5) / 6e4),
            secs = Math.floor((milliseconds % 6e4) / 1000);
        if (secs<10) {
            secs = "0" + secs;
        }
        if(mins< 10){
            mins = "0" + mins;
        }
        if(hours< 10){
            hours = "0" + hours;
        }
        console.log("sunlight left in day: " + hours + ":" + mins + ":" + secs);
        timeString = hours + ':' +mins + ':' +secs;
    }
    else {
        console.log("sunlight left in day: 0");
        timeString = '00' + ':' + '00' + ':' +'00';

    }
    updateProgressObjects(times.sunrise, times.sunset, userDate, timer, timeString);


};

function updateProgressObjects (sunrise, sunset, currentTime, timer, timeLeft) {
    //create percentage
    var totalTime = sunset-sunrise;
    var timeSpent = currentTime - sunrise;
    if (sunrise > currentTime) timeSpent = totalTime;

    var percentageSpent = timeSpent / totalTime;
    if (percentageSpent > 1) percentageSpent = 1;
    //percentageSpent = 0.74;
    //$('.percentage').html(percentageSpent * 100 + "%");
    var textElement = document.getElementById('clock-time');
    timer.animate(percentageSpent, function() {
        textElement.innerHTML = timeLeft;
    });

}


function getTime(dateObject) {
    var hours = dateObject.getHours();
    var minutes = dateObject.getMinutes();
    var seconds = dateObject.getSeconds();
    var stamp = ' AM'

    if (seconds<10) {
        seconds = "0" + seconds;
    }
    if(minutes< 10){
        minutes = "0" + minutes;
    }
    if (hours > 12) {
        hours = hours - 12;
        stamp = ' PM';
    }
    if(hours< 10){
        hours = "0" + hours;
    }

    return hours + ":" + minutes + ":" + seconds + stamp
};

function updateAdditionalInfo(times){
    $('.sunrise').html('Sunrise: ' + getTime(times.sunrise));
    $('.sunset').html('Sunset: ' + getTime(times.sunset));
    $('.solarNoon').html('Solar Noon: ' + getTime(times.solarNoon));
    $('.dawn').html('Dawn: ' + getTime(times.dawn));
    $('.dusk').html('Dusk: ' + getTime(times.dusk));
    $('.night').html('Night: ' + getTime(times.night));
}




