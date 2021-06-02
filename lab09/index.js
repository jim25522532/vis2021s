const video = document.getElementById('video');
const videoControls = document.getElementById('video-controls');
const playButton = document.getElementById('play');
const playbackIcons = document.querySelectorAll('.playback-icons use');
const timeElapsed = document.getElementById('time-elapsed');
const duration = document.getElementById('duration');
const progressBar = document.getElementById('progress-bar');
const seek = document.getElementById('seek');
const seekTooltip = document.getElementById('seek-tooltip');
const volumeButton = document.getElementById('volume-button');
const volumeIcons = document.querySelectorAll('.volume-button use');
const volumeMute = document.querySelector('use[href="#volume-mute"]');
const volumeLow = document.querySelector('use[href="#volume-low"]');
const volumeHigh = document.querySelector('use[href="#volume-high"]');
const volume = document.getElementById('volume');
const playbackAnimation = document.getElementById('playback-animation');
const fullscreenButton = document.getElementById('fullscreen-button');
const videoContainer = document.getElementById('video-container');
// const fullscreenIcons = fullscreenButton.querySelectorAll('use');
// const pipButton = document.getElementById('pip-button');
var timer;
var myarray = [];
const videoWorks = !!document.createElement('video').canPlayType;
  if (videoWorks) {
    video.controls = false;
    videoControls.classList.remove('hidden');
  }

// Add functions here

// togglePlay toggles the playback state of the video.
// If the video playback is paused or ended, the video is played
// otherwise, the video is paused
function togglePlay() {

  if (video.paused || video.ended) {
    resetSubtitle();
    video.play();
  } 
  else {
    clearSubtitle();
    video.pause();
  }
}

// updatePlayButton updates the playback icon and tooltip
// depending on the playback state
function updatePlayButton() {
  playbackIcons.forEach((icon) => icon.classList.toggle('hidden'));

  if (video.paused) {
    playButton.setAttribute('data-title', 'Play (k)');
  } else {
    playButton.setAttribute('data-title', 'Pause (k)');
  }
}

// formatTime takes a time length in seconds and returns the time in
// minutes and seconds
function formatTime(timeInSeconds) {

    
  const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

  return {
    minutes: result.substr(3, 2),
    seconds: result.substr(6, 2),
  };
}

// initializeVideo sets the video duration, and maximum value of the
// progressBar
function initializeVideo() {
  const videoDuration = Math.round(video.duration);
  seek.setAttribute('max', videoDuration);
  progressBar.setAttribute('max', videoDuration);
  const time = formatTime(videoDuration);
  duration.innerText = `${time.minutes}:${time.seconds}`;
  duration.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`);
}

// updateTimeElapsed indicates how far through the video
// the current playback is by updating the timeElapsed element
function updateTimeElapsed() {

    const time = formatTime(Math.round(video.currentTime));
    timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
    timeElapsed.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`);

}

// updateProgress indicates how far through the video
// the current playback is by updating the progress bar
function updateProgress() {
  seek.value = Math.floor(video.currentTime);
  progressBar.value = Math.floor(video.currentTime);

}

// updateSeekTooltip uses the position of the mouse on the progress bar to
// roughly work out what point in the video the user will skip to if
// the progress bar is clicked at that point
function updateSeekTooltip(event) {
  const skipTo = Math.round(
    (event.offsetX / event.target.clientWidth) *
      parseInt(event.target.getAttribute('max'), 10)
  );
  seek.setAttribute('data-seek', skipTo);
  // console.log("1 updateSeekTooltip:"+skipTo);
  const t = formatTime(skipTo);
  // console.log("updateSeekTooltip time:" + t);
  seekTooltip.textContent = `${t.minutes}:${t.seconds}`;
  const rect = video.getBoundingClientRect();
  seekTooltip.style.left = `${event.pageX - rect.left}px`;


}

// skipAhead jumps to a different point in the video when the progress bar
// is clicked
function skipAhead(event) {

  const skipTo = event.target.dataset.seek
    ? event.target.dataset.seek
    : event.target.value;
  video.currentTime = skipTo;
  progressBar.value = skipTo;
  seek.value = skipTo;
 
  resetSubtitle();
}

// updateVolume updates the video's volume
// and disables the muted state if active
function updateVolume() {
  if (video.muted) {
    video.muted = false;
  }

  video.volume = volume.value;
}

// updateVolumeIcon updates the volume icon so that it correctly reflects
// the volume of the video
function updateVolumeIcon() {
  volumeIcons.forEach((icon) => {
    icon.classList.add('hidden');
  });

  volumeButton.setAttribute('data-title', 'Mute (m)');

  if (video.muted || video.volume === 0) {
    volumeMute.classList.remove('hidden');
    volumeButton.setAttribute('data-title', 'Unmute (m)');
  } else if (video.volume > 0 && video.volume <= 0.5) {
    volumeLow.classList.remove('hidden');
  } else {
    volumeHigh.classList.remove('hidden');
  }
}

// toggleMute mutes or unmutes the video when executed
// When the video is unmuted, the volume is returned to the value
// it was set to before the video was muted
function toggleMute() {
  video.muted = !video.muted;

  if (video.muted) {
    volume.setAttribute('data-volume', volume.value);
    volume.value = 0;
  } else {
    volume.value = volume.dataset.volume;
  }
}

// animatePlayback displays an animation when
// the video is played or paused
function animatePlayback() {
  playbackAnimation.animate(
    [
      {
        opacity: 1,
        transform: 'scale(1)',
      },
      {
        opacity: 0,
        transform: 'scale(1.3)',
      },
    ],
    {
      duration: 500,
    }
  );
}

// toggleFullScreen toggles the full screen state of the video
// If the browser is currently in fullscreen mode,
// then it should exit and vice versa.
// function toggleFullScreen() {
//   if (document.fullscreenElement) {
//     document.exitFullscreen();
//   } else if (document.webkitFullscreenElement) {
//     // Need this to support Safari
//     document.webkitExitFullscreen();
//   } else if (videoContainer.webkitRequestFullscreen) {
//     // Need this to support Safari
//     videoContainer.webkitRequestFullscreen();
//   } else {
//     videoContainer.requestFullscreen();
//   }
// }

// updateFullscreenButton changes the icon of the full screen button
// and tooltip to reflect the current full screen state of the video
// function updateFullscreenButton() {
//   fullscreenIcons.forEach((icon) => icon.classList.toggle('hidden'));

//   if (document.fullscreenElement) {
//     fullscreenButton.setAttribute('data-title', 'Exit full screen (f)');
//   } else {
//     fullscreenButton.setAttribute('data-title', 'Full screen (f)');
//   }
// }

// togglePip toggles Picture-in-Picture mode on the video
// async function togglePip() {
//   try {
//     if (video !== document.pictureInPictureElement) {
//       pipButton.disabled = true;
//       await video.requestPictureInPicture();
//     } else {
//       await document.exitPictureInPicture();
//     }
//   } catch (error) {
//     console.error(error);
//   } finally {
//     pipButton.disabled = false;
//   }
// }

// hideControls hides the video controls when not in use
// if the video is paused, the controls must remain visible
function hideControls() {
  if (video.paused) {
    return;
  }

  videoControls.classList.add('hide');
}

// showControls displays the video controls
function showControls() {
  videoControls.classList.remove('hide');
}

// keyboardShortcuts executes the relevant functions for
// each supported shortcut key
function keyboardShortcuts(event) {
  const { key } = event;
  switch (key) {
    case 'k':
      togglePlay();
      animatePlayback();
      if (video.paused) {
        showControls();
      } else {
        setTimeout(() => {
          hideControls();
        }, 2000);
      }
      break;
    case 'm':
      toggleMute();
      break;
    case 'f':
      toggleFullScreen();
      break;
    case 'p':
      togglePip();
      break;
  }
}

// Add eventlisteners here
playButton.addEventListener('click', togglePlay);
video.addEventListener('play', updatePlayButton);
video.addEventListener('pause', updatePlayButton);
video.addEventListener('loadedmetadata', initializeVideo);
video.addEventListener('timeupdate', updateTimeElapsed);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('volumechange', updateVolumeIcon);
video.addEventListener('click', togglePlay);
video.addEventListener('click', animatePlayback);
video.addEventListener('mouseenter', showControls);
video.addEventListener('mouseleave', hideControls);
videoControls.addEventListener('mouseenter', showControls);
videoControls.addEventListener('mouseleave', hideControls);
seek.addEventListener('mousemove', updateSeekTooltip);
seek.addEventListener('input', skipAhead);
volume.addEventListener('input', updateVolume);
volumeButton.addEventListener('click', toggleMute);
// fullscreenButton.addEventListener('click', toggleFullScreen);
// videoContainer.addEventListener('fullscreenchange', updateFullscreenButton);
// pipButton.addEventListener('click', togglePip);

document.addEventListener('DOMContentLoaded', () => {
  if (!('pictureInPictureEnabled' in document)) {
    pipButton.classList.add('hidden');
  }
});
document.addEventListener('keyup', keyboardShortcuts);


var key;
var begin;
var end;
var dur;
var subtitle;

var time = 0;
var time2 =0.0
function play_time(){
    
    
    video.onloadedmetadata = function() {
        time = parseInt(video.currentTime);
        time2 = parseInt(video.duration ); 
    };
    if(time!=video.currentTime){
      time = parseInt(video.currentTime);
    }
   
    console.log(time2);
     

     timer = setInterval(() => {

        var mytime  = to_clock(time);
        var mytime2 = to_clock(time2);
        if(mytime<=mytime2){
          d3.select('#subtitle')
            .append('text')
            .attr('id', 'clock')
            .text(mytime +' / ' + mytime2)
            .attr('x', 430)
            .attr('y', 60)
            .attr('opacity', 0)
            .transition()
            .duration(1000)
            .attr('opacity', 1)
            .transition()
            .duration(1000)
            .attr('opacity', 0)
            .remove()
            ;
        time++;
      }
    }, 1000);

}

function make_subtitle(){

    d3.text('DAOKO.srt', function(data){
        // console.log(data);
        //alert(data);
        var videoTime = parseInt(video.currentTime);
        // console.log(videoTime);

        parsedCSV = d3.csvParseRows(data);
        // console.log(parsedCSV);
        //alert('parsedCSV.length = ' + parsedCSV.length);

        d3.select('#srt')
          .selectAll('p')
          .data(parsedCSV)
          .enter()
          .append("p")
          .text(function(d, i){
              //return d;
              if ( !isNaN(d) && d != '' ){
                  key = parseInt(d);
              } else if (d == '') {

                  if(begin>=0){
                    myarray.push({
                      "key": key,
                      "begin": begin,
                      "end": end,
                      "dur": end - begin,
                      "subtile": subtile
                    });
                  }
              } else if (d.length == 3 ){
                  begin = (parseInt(d[0][3]) * 10 + parseInt(d[0][4])) * 60 +
                          (parseInt(d[0][6]) * 10 + parseInt(d[0][7]));

                  end =   (parseInt(d[1][11]) * 10 + parseInt(d[1][12])) * 60 +
                          (parseInt(d[1][14]) * 10 + parseInt(d[1][15]));
                  // console.log("begin"+begin);
                  // console.log("videoTime"+videoTime);
                  // console.log(begin>videoTime);

                begin = begin - videoTime;
                end = end - videoTime;
              } else {
                  subtile = d;
              }   
          })
          ;

          // 完成歌詞


          // 完成歌詞
          var w = 960;
          var h = 540;

          var svg = d3.select('.video-container')
            .append('svg')
            .attr('id', 'subtitle')
            .attr("class","subtitle")
            .attr('width', w)
            .attr('height', h)
            .attr('viewbox', function(){
                return "0, 0, " + w + ', ' + h;
            })
            ;


        svg.selectAll('text')
           .data(myarray)
           .enter()
           .append('text')
           .text(function(d, i){
                return d.subtile;
            })
           .attr('begin', function(d, i){
                   return d.begin;
           })
           .attr('end', function(d, i){
                   return d.end;
           })
           .attr('x', (w / 2) -90)
           .attr('y', h - 200)
           .attr("text-anchor", "middle")
           //.style('display', 'none')
           .attr('opacity', 0)
           .transition()
           .delay(function(d){

                return (d.begin - d.dur / 2) * 1000;
           })
           .duration(function(d){
               return (d.dur + d.dur / 2) * 1000;
           })
           .attr('opacity', 1)
           .transition()
           .duration(function(d){
               return (d.dur / 6.0 * 1000.0);
           })
           .attr('opacity', 0)
           ;

        play_time();
    })

}


function to_clock (time){
  if (time % 60 < 10) 
    return '0' + parseInt(time / 60) + ':' + '0' + time % 60;
  else
    return '0' + parseInt(time / 60) + ':' + time % 60;
}

function resetSubtitle(){
  d3.selectAll("p").remove();
  d3.selectAll(".subtitle").remove();
  clearInterval(timer);
  myarray = []
  make_subtitle();
}

function clearSubtitle(){
  d3.selectAll("p").remove();
  d3.selectAll(".subtitle").remove();
  clearInterval(timer);
  myarray = []
}