"use strict";

const PlayPause = document.querySelector(".PlayPause");
const CurrentTime = document.querySelector(".current-time");
const TotalTime = document.querySelector(".total-time");
const playerSlider = document.querySelector(".player-slider");
let videoID = "";
let player;

function onYouTubeIframeAPIReady() {
  if (videoID != "") {
    player = new YT.Player("player", {
      height: "0",
      width: "0",
      videoId: videoID,
      playerVars: {
        playsinline: 1,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  } else {
    player = new YT.Player("player", {
      width: "0",
      height: "0",
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
    console.log("fasz");
  }
}

function playButton() {
  player.getPlayerState() == 1 ? player.pauseVideo() : player.playVideo();
}

function onPlayerReady(event) {
  player.playVideo();
}

function onPlayerStateChange(event) {
  let state = event.data;
  console.log(event.data);
  console.log(player.getDuration());
  if (state == YT.PlayerState.PLAYING) {
    PlayPause.innerHTML = "||";
    updateTimeStamps();

    playerSlider.max = player.getDuration();
    playerSlider.value = player.getCurrentTime();
    startTimeStampUpdate();
  }
  if (state == YT.PlayerState.PAUSED) {
    PlayPause.innerHTML = "▶";
    updateTimeStamps();
    stopTimeStampUpdate();
  }
  if (state == YT.PlayerState.BUFFERING) {
    PlayPause.innerHTML = "⏳";
  }
  if (state == YT.PlayerState.ENDED) {
    PlayPause.innerHTML = "⏮";
  }
}

function secToStamp(sec) {
  var date = new Date(null);
  date.setSeconds(sec);
  return date.toISOString().substr(14, 5);
}

function updateTimeStamps() {
  CurrentTime.innerText = secToStamp(playerSlider.value);
  TotalTime.innerText = secToStamp(playerSlider.max);
}
let stampTimeout;
function startTimeStampUpdate() {
  stampTimeout = setInterval(() => {
    playerSlider.value = player.getCurrentTime();
    updateTimeStamps();
  }, 1000);
}

function stopTimeStampUpdate() {
  clearInterval(stampTimeout);
}

function loadVideo(id) {
  player.loadVideoById(id);
}

async function playID(e) {
  try {
    let id = await getID(e.innerText + " audio");
    console.log(e.innerText + " audio");
    console.log(id);
    loadVideo(id);
    SearchQuery.value = "";
  } catch (e) {
    offline();
  }
}

const apiKey = "AIzaSyDfiRGCcFpdsQG4ML9PSTJjnk3KIpJugcQ";
const getID = async function (title) {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${title}&part=snippet&type=video`
  );
  const data = await res.json();
  return data.items[0].id.videoId;
};
