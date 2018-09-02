var keyInts = [];

function initKey(EVENT_ON, EVENT_OFF, ID, KEY) {
	$(ID).bind(EVENT_ON, function() {
		e = $.Event("keydown", { keyCode: KEY });
		if (keyInts[KEY]) {
			clearTimeout(keyInts[KEY]);
			keyInts[KEY] = null;
		}

		if (isBisty()) {
			curPlayerDirection = Direction.None;
			input.onkeydown(new KeyboardEvent('keydown', { keyCode: KEY }));
		} else if (isPuzzleScript()) {
			if (titleScreen || textMode) {
				if (KEY == 32 || KEY == 88) {
					nextLevel();
				} else {
					keybuffer = [];
					keybuffer.push(KEY);
				}
			} else {
				keybuffer = [];
				if (KEY == 85) {
					//UNDO
					keybuffer.push(KEY);
				} else if (KEY == 69) {
					//RESTART
					keybuffer.push(KEY);
					pushInput("restart");
					DoRestart(e);
					checkKey(e)
					restarting = 1;
					autotick = 0;
					pushInput("tick");
					processInput(-1);
					redraw();
				} else {
					keybuffer.push(KEY);
				}
			}
		}
		$(this).addClass('pressed');
	})
	$(ID).bind(EVENT_OFF, function() {
		e = $.Event("keyup", { keyCode: KEY });

		if (keyInts[KEY]) {
			clearTimeout(keyInts[KEY]);
			keyInts[KEY] = null;
		}

		if (isBisty()) {
			keyInts[KEY] = setTimeout(function() {
				input.onkeyup(new KeyboardEvent('keyup', { keyCode: KEY }));
				keyInts[KEY] = null;
			}, 100);
		} else if (isPuzzleScript()) {
			if (titleScreen || textMode) {} else {
				if (KEY == 85) {
					keybuffer = [];
				}
				keyInts[KEY] = setTimeout(function() {
					checkKey(e);
					keybuffer = [];
				}, 20);
			}
		}
		$(this).removeClass('pressed');
	});
}


function updatePalette() {
	document.querySelector('body').style.setProperty('--color_body', 'rgb(' + palette[curPal()].colors[1] + ')');
	document.querySelector('body').style.setProperty('--color_buttons', 'rgb(' + palette[curPal()].colors[0] + ')');
	document.querySelector('body').style.setProperty('--color_dpad', 'rgb(' + palette[curPal()].colors[2] + ')');
}

function clickCanvas() {
	$('#gameCanvas').mousedown();
}

function isBisty() {
	return (typeof(input) !== 'undefined');
}

function isPuzzleScript() {
	return (typeof(checkKey) !== 'undefined');
}

function init() {
	window.scrollTo(1, 0);
	window.scrollTo(0, 0);
	if (isBisty()) {
		startExportedGame();
		$('#main').addClass('bitsy');
		document.removeEventListener('touchstart', input.ontouchstart);
		document.removeEventListener('touchmove', input.ontouchmove);
		document.removeEventListener('touchend', input.ontouchend);

		$('#start span').text('ACT');
		$('#select span').text('ACT');
		$('#aButton span').text('ACT');
		$('#bButton span').text('ACT');

		$('#start').hide();
		$('#select').hide();

		initKey('touchstart', 'touchend', '#up', 38);
		initKey('touchstart', 'touchend', '#down', 40);
		initKey('touchstart', 'touchend', '#left', 37);
		initKey('touchstart', 'touchend', '#right', 39);
		initKey('touchstart', 'touchend', '#aButton', 32);
		initKey('touchstart', 'touchend', '#bButton', 32);
		initKey('touchstart', 'touchend', '#start', 32);
		initKey('touchstart', 'touchend', '#select', 32);
		updatePalette();
		t2 = setInterval(updatePalette, 100);
	} else {
		window.Mobile = null;
		$('#main').addClass('puzzlescript');
		$('#start span').text('QUIT');
		$('#select span').text('RESTART');
		$('#aButton span').text('ACT');
		$('#bButton span').text('UNDO');
		initKey('touchstart', 'touchend', '#up', 38);
		initKey('touchstart', 'touchend', '#down', 40);
		initKey('touchstart', 'touchend', '#left', 37);
		initKey('touchstart', 'touchend', '#right', 39);
		initKey('touchstart', 'touchend', '#aButton', 88);
		initKey('touchstart', 'touchend', '#bButton', 85);
		initKey('touchstart', 'touchend', '#start', 27);
		initKey('touchstart', 'touchend', '#select', 69);
		t2 = setInterval(clickCanvas, 100);
	}
}
var t = setTimeout(init, 200);
var t2;