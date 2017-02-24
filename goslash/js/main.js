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


function Game () {
	
	var player1 = true;
	var player2 = false; 
	var t = 1;//animation frame for player 1
	var n = 1;// animation frame for player 2
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	ctx.lineCap = "round";
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
	// set some style
	ctx.lineWidth = 8;
	// calculate small incremental points along the path for player 1 and player 2
	var points_player1 = calcWaypoints(player1_vertices);
	var points_player2 = calcWaypoints(player2_vertices);
	
	
	// keep track of all the intersection points of each player's line 
	var current_vert; 
	var play1_lst_interpoints = []; 
	var play2_lst_interpoints = []; 
 	
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

	
	// input start x y coodrinate of first point of each 
	// line and the end point of each line and produces the intersection point in [x,y], returns 0 if there is no collision. 
	function get_line_intersection(p0_x, p0_y, p1_x, p1_y, 
		p2_x, p2_y, p3_x, p3_y) {
		
		var inter_points = {
			inter_x: null,
			inter_y: null 
		}
		
		var s1_x, s1_y, s2_x, s2_y;
		s1_x = p1_x - p0_x;     
		s1_y = p1_y - p0_y;
		s2_x = p3_x - p2_x; 
		s2_y = p3_y - p2_y;

		var s, t;
		s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
		t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

		if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
		{
			// Collision detected
			inter_points.inter_x = p0_x + (t * s1_x);
			inter_points.inter_y = p0_y + (t * s1_y);
			return inter_points; 
		}

		return 0; // No collision
	}


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
		
		var poi = {
			inter_x: null,
			inter_y: null 
		}
		// draw a line segment from the last waypoint
		// to the current waypoint
		for (var vert = 0; vert < player1_vertices.length - 2; ++vert) {
			poi = get_line_intersection(current_vert.x, current_vert.y, points_player1[t-1].x, points_player1[t-1].y, 
			player1_vertices[vert].x, player1_vertices[vert].y, player1_vertices[vert+1].x, player1_vertices[vert+1].y);
		}
		
		if (poi.inter_x != null && poi.inter_y != null 
		&& poi.inter_x != play1_lst_interpoints[play1_lst_interpoints.length - 1].x) {
			play1_lst_interpoints.push({
				x: poi.x,
				y: poi.y 
			});
		};
		
		ctx.beginPath(); 
		ctx.moveTo(points_player1[t - 1].x, points_player1[t - 1].y);
		ctx.lineTo(points_player1[t].x, points_player1[t].y);
		ctx.stroke();
		// increment "t" to get the next waypoint
		t++;
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
			for (var k = 0; k < play1_lst_interpoints.length; k++) {
			ctx.lineTo(play1_lst_interpoints[k].x, play1_lst_interpoints[k].y);
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
			
			current_vert = points_player1[t - 1]; 
			console.log('current vert player 1' , current_vert); 
			//pass in the last point of the line drawn from player1 so that we can detect many intersections and draw area. 
			animate_player1();
		} else {
			var mousePos = getMousepos(canvas, evt);
			player2_vertices.push({
				x: mousePos.x,
				y: mousePos.y 
			});
			points_player2 = calcWaypoints(player2_vertices); 
			
			// extend the line from start to finish with animation
			
			current_vert = points_player2[n - 1]; 
			console.log('current vert player 2: ' , current_vert);
			
			animate_player2();
		}
		
	}, false); 

}


document.addEventListener('DOMContentLoaded', function () {
    this.game = new Game();
    //this.game.ai(1);
});


