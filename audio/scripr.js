const audio = document.getElementById('audio');
const transcriptEl = document.getElementById('transcript');
const sidebar = document.getElementById('sidebar');
const repeatModeEl = document.getElementById('repeatMode');

let currentList = 0;
let currentTrack = 0;
let repeatMode = 'list';

function toggleList() {
    sidebar.classList.toggle('open');
}

function loadTrack(listIndex, trackIndex) {
    currentList = listIndex;
    currentTrack = trackIndex;

    const track = listeningLists[listIndex].tracks[trackIndex];
    audio.src = track.src;
    audio.play();

    document.querySelectorAll('.track').forEach(function (el) {
        el.classList.remove('active');
    });

    const active = document.getElementById('track-' + listIndex + '-' + trackIndex);
    if (active) {
        active.classList.add('active');
    }

    const html = track.text.map(function (line) {
        return '<p><strong>' + line.speaker + ':</strong> ' + line.content + '</p>';
    }).join('');

    transcriptEl.innerHTML = '<strong>Nội dung nghe:</strong>' + html;
}

function renderSidebar() {
    sidebar.innerHTML = '<button class="close-sidebar" onclick="toggleList()">✖ Đóng</button>';

    listeningLists.forEach(function (list, li) {
        const title = document.createElement('div');
        title.className = 'group-title';
        title.textContent = list.title;
        sidebar.appendChild(title);

        list.tracks.forEach(function (track, ti) {
            const div = document.createElement('div');
            div.className = 'track';
            div.id = 'track-' + li + '-' + ti;
            div.textContent = track.title;
            div.onclick = function () {
                loadTrack(li, ti);
                sidebar.classList.remove('open');
            };
            sidebar.appendChild(div);
        });
    });
}

function next() {
    const list = listeningLists[currentList];

    if (currentTrack < list.tracks.length - 1) {
        loadTrack(currentList, currentTrack + 1);
    } else if (currentList < listeningLists.length - 1) {
        loadTrack(currentList + 1, 0);
    } else if (repeatMode === 'list') {
        loadTrack(0, 0);
    }
}

function prev() {
    if (currentTrack > 0) {
        loadTrack(currentList, currentTrack - 1);
    }
}

function toggleRepeat() {
    repeatMode = repeatMode === 'list' ? 'one' : 'list';
    repeatModeEl.textContent = repeatMode === 'list' ? 'List' : 'One';
}

audio.addEventListener('ended', function () {
    if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
    } else {
        next();
    }
});

renderSidebar();
loadTrack(0, 0);