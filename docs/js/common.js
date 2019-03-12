const SIZE = 128;
let canvas = document.getElementById('canvas');
let parentDiv = canvas.parentElement;
let winW = window.innerWidth;
let winH = window.innerHeight;

canvas.width = winW;
canvas.height = winH;

if (window.location.search.indexOf('canvas_only') != -1) {
	document.getElementById('canvas_only').disabled = false;
	let scale = Math.max(Math.floor(Math.min(winW, winH) / SIZE), 2);
	let sizeParam = (scale * SIZE) + 'px';
	parentDiv.style.width = sizeParam;
	parentDiv.style.height = sizeParam;
} else {
	parentDiv.insertAdjacentHTML('beforeend', getPico8FuncHtml());
	parentDiv.insertAdjacentHTML('afterend', getInstructionHtml());
}

var Module = {};
Module.canvas = canvas;
function onKeyDown_blocker(event) {
	event = event || window.event;
	let elm = document.activeElement;
	if (!elm || elm == document.body || elm.tagName == 'canvas') {
		if ([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
			if (event.preventDefault) event.preventDefault();
		}
	}
}
document.addEventListener('keydown', onKeyDown_blocker, false);

function getPico8FuncHtml() {
	return function () {/*
<div class="pico8_el" onclick="Module.pico8Reset();">
	<img src="img/reset.png" alt="Reset" width="12" height="12"> Reset
</div>
<div class="pico8_el" onclick="Module.pico8TogglePaused();">
	<img src="img/pause.png" alt="Pause" width="12" height="12"> Pause
</div>
<div class="pico8_el" onclick="Module.requestFullScreen(true, false);">
	<img src="img/fullscreen.png" alt="Fullscreen" width="12" height="12"> Fullscreen
</div>
<div class="pico8_el" onclick="Module.pico8ToggleSound();">
	<img src="img/sound.png" alt="Toggle Sound" width="12" height="12"> Sound
</div>
<div class="pico8_el">
	<a target="_new" href="http://www.lexaloffle.com/bbs/?cat=7&sub=2">
	<img src="img/carts.png" alt="More Carts" width="12" height="12"> Carts</a>
</div>*/}.toString().slice(16, -3);
}

function getInstructionHtml() {
	let metas = {};
	[].forEach.call(document.getElementsByTagName('meta'), function (elm) {
		let name = elm.getAttribute('name');
		if (name) {
			metas[name] = elm.getAttribute('content');
		}
	});
	let html = '<div class="inst">';
	html += '<h1>' + metas['twitter:title'].toUpperCase() + '</h1>';
	html += 'VERSION ' + metas['my:version'] + '<br>(' + metas['my:release_date'].toUpperCase() + ')<br><br>';
	if (metas['twitter:description']) {
		html += metas['twitter:description'].replace(/\./g, '.<br>').toUpperCase();
	}
	if (metas['my:instruction']) {
		html += '<dl>';
		metas['my:instruction'].split(',').forEach(function (pair) {
			let items = pair.split(':');
			html += '<dt>' + items[0] + ':</dt><dd>' + items[1].toUpperCase() + '</dd>';
		});
		html += '</dl>';
	}
	if (metas['my:footnote']) {
		html += metas['my:footnote'].toUpperCase() + '<br><br>';
	}
	if (metas['my:source_url']) {
		html += '<a target="_new" href="' + metas['my:source_url'] + '">SOURCE CODE</a><br>';
	}
	if (metas['my:thread_url']) {
		html += '<a target="_new" href="' + metas['my:thread_url'] + '">THREAD IN FORUM</a><br>';
	}
	html += '</div>';
	return html;
}
