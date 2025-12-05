
$(document).ready(function() {
	var length = [".52", ".53"];
	var initialLength = length.length;
	var i;
	var j = 1;
	var mGood, mBad;            // selectors for the 2 foods
	var count = 0;
	var l = 1;
	var head_pos = "heade";
	var prev;
	var prev_tail;
	var tail_pos = "tailDown";
	var changing = [];
	var updated;
	var prevup;
	var upt = [];
	var snakeBody;
	var prevbody;
	var snakeTurn;
	var snakeTurnarr = [];

	// image pools
	var badImgs = ["./css/img/orange.png", "./css/img/media.png", "./css/img/y.png"];
	var goodImgs = ["./css/img/linux.png", "./css/img/vlc.png", "./css/img/firefox.png"];

	function randCellNotOnSnake() {
		var cell;
		do {
			cell = "." + Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10);
		} while (length.includes(cell) || cell === mGood || cell === mBad);
		return cell;
	}

	function placeFoodElements() {
		// place good food
		mGood = randCellNotOnSnake();
		var gi = goodImgs[Math.floor(Math.random() * goodImgs.length)];
		$(mGood).addClass("foodGood").html('<img class="food-img" src="' + gi + '" />');

		// place bad food (ensure different)
		mBad = randCellNotOnSnake();
		var bi = badImgs[Math.floor(Math.random() * badImgs.length)];
		$(mBad).addClass("foodBad").html('<img class="food-img" src="' + bi + '" />');
	}

	function clearFood(cell) {
		$(cell).removeClass("foodGood foodBad").empty();
	}

	function makeFood() {
		// remove previous if existing
		if (mGood) clearFood(mGood);
		if (mBad) clearFood(mBad);
		placeFoodElements();
	}

	$(document).keydown(function(e) {
		if (j == 1) { makeFood(); }

		var key = e.which; prevbody = snakeBody;
		if (key == 37 && l != "r" && l != "left") {
			$(".hideThis").hide();
			if (l == "u") { snakeTurn = "turn_rightdown"; snakeTurnarr.push("turn_rightdown"); } else if (l == "d") { snakeTurn = "turn_rightup"; snakeTurnarr.push("turn_rightup"); }
			l = "left"; head_pos = "headLeft"; tail_pos = "tailLeft"; $(j).removeClass(prev); changing.push(length[length.length - 1]); upt.push("tailLeft"); snakeBody = "side"; $(j).addClass(snakeTurn);
		}
		else if (key == 38 && l != "d" && l != "u") {
			$(".hideThis").hide();
			if (l == "left") { snakeTurn = "turn_leftup"; snakeTurnarr.push("turn_leftup"); } else if (l == "r") { snakeTurn = "turn_rightup"; snakeTurnarr.push("turn_rightup"); }
			l = "u"; head_pos = "headUp"; tail_pos = "tailUp"; $(j).removeClass(prev); changing.push(length[length.length - 1]); upt.push("tailUp"); snakeBody = "upward"; $(j).addClass(snakeTurn);
		}
		else if (key == 39 && l != "left" && l != "r") {
			$(".hideThis").hide();
			if (l == "u") { snakeTurn = "turn_leftdown"; snakeTurnarr.push("turn_leftdown"); } else if (l == "d") { snakeTurn = "turn_leftup"; snakeTurnarr.push("turn_leftup"); }
			l = "r"; head_pos = "headRight"; tail_pos = "tailRight"; $(j).removeClass(prev); changing.push(length[length.length - 1]); upt.push("tailRight"); snakeBody = "side"; $(j).addClass(snakeTurn);
		}
		else if (key == 40 && l != "u" && l != "d") {
			$(".hideThis").hide();
			if (l == "left") { snakeTurn = "turn_leftdown"; snakeTurnarr.push("turn_leftdown"); } else if (l == "r") { snakeTurn = "turn_rightdown"; snakeTurnarr.push("turn_rightdown"); }
			l = "d"; head_pos = "headDown"; tail_pos = "tailDown"; $(j).removeClass(prev); changing.push(length[length.length - 1]); upt.push("tailDown"); snakeBody = "upward"; $(j).addClass(snakeTurn);
		}

		if (l == "r" || l == "left") {
			i = length[length.length - 1];
			i = i.slice(2, 3);
		}
		if (l == "u" || l == "d") {
			i = length[length.length - 1];
			i = i.slice(1, 2);
			i = Number(i);
		}
		IncDec(l);
		clearTimeout(count);
		move();
	});

	function IncDec(q) {
		switch (q) {
			case "u": i--; break
			case "r": i++; break;
			case "left": i--; break;
			case "d": i++; break;
		}
	}

	function trimming() {
		if (l == "r" || l == "left") { j = j.slice(0, 2); j = j + i; }

		if (l == "u" || l == "d") { j = j.slice(2, 3); j = "." + i + j; }
	}

	function checkCondition() {
		if (i > 9)
			i = 0;
		if (i < 0)
			i = 9;
	}

	function move() {
		clearTimeout(count);
		checkCondition();
		j = length.shift();
		$(j).removeClass(prevbody);
		$(j).removeClass(snakeBody);
		$(j).addClass("leave");

		var qw = length[length.length - 1];
		$(qw).removeClass(head_pos);
		$(j).removeClass(tail_pos);
		$(j).removeClass(updated);
		$(j).removeClass(prev_tail);

		j = length[length.length - 1];
		trimming();
		$(j).removeClass(head_pos);

		clearTimeout(count);
		if (length.includes(j) && l != 1) { alert("Game Over !! Your Score is - " + (length.length - 1) + " !!"); location.reload(); }
		length.push(j); $(j).addClass(snakeBody); $(j).removeClass("leave");
		$(j).removeClass("foodColor");
		$(j).removeClass(head_pos);

		// --- FOOD HANDLING: if new head equals a food ---
		if (j == mGood) {
			// good food: grow (the original logic already grows by pushing an extra copy)
			IncDec(l); checkCondition(); trimming();
			length.push(j);
			$(j).addClass(snakeBody);
			$(j).removeClass(head_pos);
			$(j).removeClass("leave");
			clearFood(mGood);
			// respawn both so new positions available
			makeFood();
			$("#scoreCardPrint").text((length.length - initialLength));
		}
		else if (j == mBad) {
			// bad food: shorten by removing one tail segment (if possible)
			clearFood(mBad);

			// remove one extra tail immediately (we already removed one at start of move)
			var removed = length.shift();
			if (removed) {
				// remove visuals on the removed cell
				$(removed).removeClass("upward side headLeft headRight headUp headDown tailLeft tailRight tailUp tailDown snakeBody leave");
				$(removed).empty();
			}

			// update score display
			$("#scoreCardPrint").text(Math.max(0, (length.length - initialLength)));

			// if snake too short => game over
			if (length.length < initialLength) {
				alert("Game Over !! Your Score is - " + (Math.max(0, (length.length - initialLength))) + " !!");
				location.reload();
				return;
			}

			// respawn both foods
			makeFood();
		}

		IncDec(l);

		prev = head_pos;
		prev_tail = tail_pos;

		var qw = length[length.length - 1];
		$(qw).addClass(head_pos);

		qw = length[0];

		$(qw).removeClass(snakeTurnarr[0]);

		if (qw == changing[0]) {
			updated = upt[0];
			changing.shift();
			snakeTurnarr.shift();
			upt.shift();
		}
		$(qw).addClass(updated);

		$(qw).removeClass("side");
		$(qw).removeClass("upward");

		count = setTimeout(move, 220);
	}

	// make sure that when page loads any previous cells are cleared of food imgs
	$(".col-md-1").each(function() { $(this).empty(); });

});

