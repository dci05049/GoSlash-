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



// set some style
ctx.lineWidth = 8;

// calculate small incremental points along the path for player 1 and player 2
var points_player1 = calcWaypoints(player1_vertices);
var points_player2 = calcWaypoints(player2_vertices);



// Returns 1 if the lines intersect, otherwise 0. In addition, if the lines 
// intersect the intersection point may be stored in the floats i_x and i_y.
var i_x; 
var i_y; 

function get_line_intersection(p0_x, p0_y, p1_x, p1_y, 
    p2_x, p2_y, p3_x, p3_y)
{
    var s1_x, s1_y, s2_x, s2_y;
    s1_x = p1_x - p0_x;     s1_y = p1_y - p0_y;
    s2_x = p3_x - p2_x;     s2_y = p3_y - p2_y;

    var s, t;
    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {
        // Collision detected
        i_x = p0_x + (t * s1_x);
        i_y = p0_y + (t * s1_y);
        return 1;
    }

    return 0; // No collision
}

console.log (get_line_intersection(0,0,100,100,30,25,100,100)); 
console.log(i_x, i_y); 




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
	ctx.moveTo(points_player1[t - 1].x, points_player1[t - 1].y);
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
	ctx.moveTo(points_player2[n - 1].x, points_player2[n - 1].y);
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
document.addEventListener("keydown", keyDownTextField, false); 


function keyDownTextField (e) {
	var keyCode = e.keyCode;
	if (keyCode == 65) {
		ctx.beginPath(); 
		for (var k = 0; k < player1_vertices.length; k++) {
		console.log(player1_vertices); 
		ctx.lineTo(player1_vertices[k].x, player1_vertices[k].y);
		// increment "t" to get the next waypoint
			
		}

		ctx.fillStyle = "blue"; 
		ctx.fill(); 
	} else if (keyCode == 69) {
		ctx.beginPath(); 
		for (var vert2 = 0; vert2 < player1_vertices.length; vert2++) { 
		ctx.lineTo(player2_vertices[vert2].x, player2_vertices[vert2].y);
		// increment "t" to get the next waypoint
			
		}
		ctx.fillStyle = "red"; 
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





