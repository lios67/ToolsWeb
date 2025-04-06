/*!
* Start Bootstrap - Resume v7.0.6 (https://startbootstrap.com/theme/resume)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
*/
//
// Scripts
// 
import getVideoFrames from "https://deno.land/x/get_video_frames@v0.0.9/mod.js"

let frameCount = 0;

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
});



//const uploadInput = document.getElementById("myVid");

const fileSelect = document.getElementById("getVid");
const vid = document.getElementById("myVid");

fileSelect.addEventListener(
  "click",
  (e) => {
    if (vid) {
      vid.click();
    }
    e.preventDefault()
  },
  false,
);

vid.addEventListener(
  "change",
  () => {
    // Calculate total size
    vidSplice(vid);
  },
  false,
);
var zip = new JSZip();
var img = zip.folder("images");
let index = 0;
//VidSplice Function
async function vidSplice(video){
  let numberOfBytes = 0;
  for (const file of video.files) {
    //check if the type is correct
    if (isValidFileType(file)) {
      //window.alert(frames);
      numberOfBytes += file.size;
      if (numberOfBytes > 50000000){
        window.alert("The file size is bigger than the recommend size of 50 MB so this may take an absurd amount of time to be completed!");
      }
      await extractFramesFromVideo(file);
      //hide the canvas
      document.getElementById('canvasEl').hidden = true;
    }
  }
  window.alert(numberOfBytes);
  zip.generateAsync({type:"blob"}).then(function (content){
    saveAs(content, "output.zip")
  });
}


let download = function(){
  var savable = new Image();
  savable.src = document.getElementById('canvasEl').toDataURL();
  img.file(`image${index++}.png`, savable.src.substr(savable.src.indexOf(',')+1), {base64: true});
}

async function extractFramesFromVideo(file) {
  let ctx = canvasEl.getContext("2d"); 
  // `getVideoFrames` requires a video URL as input.
  // If you have a file/blob instead of a videoUrl, turn it into a URL like this:
  let videoUrl = URL.createObjectURL(file);
  //show the canvas
  document.getElementById('canvasEl').hidden = false;

  await getVideoFrames({
    videoUrl,
    onFrame(frame) {  // `frame` is a VideoFrame object: https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame
      ctx.drawImage(frame, 0, 0, canvasEl.width, canvasEl.height);
      frame.close();
      frameCount++;
      download();
    },
    onConfig(config) {
      canvasEl.width = config.codedWidth;
      canvasEl.height = config.codedHeight;
    },
    onFinish() {
      console.log("finished!");
      console.log("frameCount", frameCount);
      //clear the data in canvas
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    },
  });
  URL.revokeObjectURL(videoUrl); // revoke URL to prevent memory leak
}

//set the types to video
function isValidFileType(file) {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  return allowedTypes.includes(file.type);
}

//Dropbox
let dropbox;
dropbox = document.getElementById("dropbox");
dropbox.addEventListener("dragenter", dragenter, false);
dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("drop", drop, false);
function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}
function drop(e) {
  e.stopPropagation();
  e.preventDefault();

  const video = e.dataTransfer.files;
  if (video.length) {
    // Assigning the files to the hidden input from the first step
    vid.files = video;

    // Processing the files for VidSplice (next step)
    vidSplice(vid);
  }
}

