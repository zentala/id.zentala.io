// const $ = require('jquery');

/** Disable selecting text */
document.onselectstart = () => { return false };
document.onmousedown = () => { return false };

/** Show video when its load */
window.addEventListener('DOMContentLoaded', () => {
  const video = document.querySelector(".video-hero__video");
  const poster = document.querySelector(".video-hero__poster");
  const posterImage = document.querySelector(".video-hero__poster img");
  const helloWorld = document.querySelector(".hello-world");

  // on posterImage loaded make cover transparent
  posterImage.onload = () => helloWorld.classList.add('hello-world--transparent');

  // on video loaded make hide poster
  let videoLoaded = false;
  video.oncanplaythrough = () => {
    setTimeout(()=>{
      if(!videoLoaded) {
        video.loop = true;
        video.play();
        videoLoaded = true;
        poster.classList.add('video-hero__poster--hidden');
      }
    }, 2.5*1000)

  };

  // lorem ipsum

});
console.log('hello from index.js')

//
// //jQuery is required to run this code
// $( document ).ready(function() {
//
//   scaleVideoContainer();
//
//   initBannerVideoSize('.video-container .poster img');
//   initBannerVideoSize('.video-container .filter');
//   initBannerVideoSize('.video-container video');
//
//   $(window).on('resize', function() {
//     scaleVideoContainer();
//     scaleBannerVideoSize('.video-container .poster img');
//     scaleBannerVideoSize('.video-container .filter');
//     scaleBannerVideoSize('.video-container video');
//   });
//
// });
//
// function scaleVideoContainer() {
//
//   var height = $(window).height() + 5;
//   var unitHeight = parseInt(height) + 'px';
//   $('.homepage-hero-module').css('height',unitHeight);
//
// }
//
// function initBannerVideoSize(element){
//
//   $(element).each(function(){
//     $(this).data('height', $(this).height());
//     $(this).data('width', $(this).width());
//   });
//
//   scaleBannerVideoSize(element);
//
// }
//
// function scaleBannerVideoSize(element){
//
//   var windowWidth = $(window).width(),
//     windowHeight = $(window).height() + 5,
//     videoWidth,
//     videoHeight;
//
//   // console.log(windowHeight);
//
//   $(element).each(function(){
//     var videoAspectRatio = $(this).data('height')/$(this).data('width');
//
//     $(this).width(windowWidth);
//
//     if(windowWidth < 1000){
//       videoHeight = windowHeight;
//       videoWidth = videoHeight / videoAspectRatio;
//       $(this).css({'margin-top' : 0, 'margin-left' : -(videoWidth - windowWidth) / 2 + 'px'});
//
//       $(this).width(videoWidth).height(videoHeight);
//     }
//
//     $('.homepage-hero-module .video-container video').addClass('fadeIn animated');
//
//   });
// }
//
