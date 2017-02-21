(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
        },
        timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };
}());


//change the text_box for the player turn; 
setInterval(function () {
	if (player1) {
		var get_elementplayer = document.getElementById("player_turn"); 
		get_elementplayer.innerHTML = "PLAYER 1 TURN"; 
		get_elementplayer.style.color = "blue"; 
	}else {
		var get_elementplayer = document.getElementById("player_turn"); 
		get_elementplayer.innerHTML = "PLAYER 2 TURN "; 
		get_elementplayer.style.color = "red"; 
	}
}, 1000/60)


var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.lineCap = "round";

var player1 = true; 
var player2 = false; 

// variable to hold how many frames have elapsed in the animation
// t for checking how  many frames elapsed in player1 j for player2
var t = 1;
var n = 1; 

// define the path to plot for player 1
var player1_vertices = [];
player1_vertices.push({
    x: 0,
    y: 0
});

// define the path to plot for player 2
var player2_vertices = [];
player2_vertices.push({
    x: canvas.width,
    y: canvas.height
});

console.log(player2_vertices); 

// draw the complete line
ctx.lineWidth = 1;

// set some style
ctx.lineWidth = 5;

// calculate small incremental points along the path for player 1 and player 2
var points_player1 = calcWaypoints(player1_vertices);
var points_player2 = calcWaypoints(player2_vertices);

// calc waypoints traveling along vertices
function calcWaypoints(vertices) {
    var waypoints = [];
    for (var i = 1; i < vertices.length; i++) {
        var pt0 = vertices[i - 1];
        var pt1 = vertices[i];
        var dx = pt1.x - pt0.x;
        var dy = pt1.y - pt0.y;
        for (var j = 1; j <= 100; j++) {
            var x = pt0.x + dx * j / 100;
            var y = pt0.y + dy * j / 100;
            waypoints.push({
                x: x,
                y: y
            });
        }
    }
	console.log(waypoints); 
    return (waypoints);
}


// animate line for player1 when they play (line color blue for player1) 
function animate_player1() {
	ctx.strokeStyle = "blue";
    if (t < points_player1.length - 1) {
        var myreq = requestAnimationFrame(animate_player1);
    } else {
		//when the line animation finishes, it's player2 turn
		player2 = true; 
		player1 = false; 
	}

    // draw a line segment from the last waypoint
    // to the current waypoint
	ctx.beginPath(); 
    ctx.lineTo(points_player1[t].x, points_player1[t].y);
    ctx.stroke();
    // increment "t" to get the next waypoint
    t++;
	
	console.log(t); 
}

// animate line for player1 when they play (line color red for player2) 
function animate_player2() {
	ctx.strokeStyle = "red";
    if (n < points_player2.length - 1) {
        var myreq_player2 = requestAnimationFrame(animate_player2);
    } else {
		player1 = true; 
		player2 = false; 
	}

    // draw a line segment from the last waypoint
    // to the current waypoint
   
	ctx.beginPath(); 
    ctx.lineTo(points_player2[n].x, points_player2[n].y);
    ctx.stroke();
    // increment "t" to get the next waypoint
    n++;

	console.log(n); 
}



function getMousepos(canvas, evt) {
	var rect = canvas.getBoundingClientRect(); 
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top 
	}
}


// for testing purpuse click 'a' == 65 to color in the area 
document.addEventListener("keydown", keyDownTextField, false)


function keyDownTextField (e) {
	var keyCode = e.keyCode; 
	if (keyCode == 65) {
		ctx.fillstyle = "lightgrey"; 
		ctx.fill(); 
	}
}


canvas.addEventListener('click', function (evt) {
	
	if (player1) {
		var mousePos = getMousepos(canvas, evt);
		player1_vertices.push({
			x: mousePos.x,
			y: mousePos.y 
		});
		points_player1 = calcWaypoints(player1_vertices); 
		
		// extend the line from start to finish with animation
		animate_player1();
	} else {
		var mousePos = getMousepos(canvas, evt);
		player2_vertices.push({
			x: mousePos.x,
			y: mousePos.y 
		});
		points_player2 = calcWaypoints(player2_vertices); 
		console.log(points_player2);
		// extend the line from start to finish with animation
		animate_player2();
	}
	
}, false); 





