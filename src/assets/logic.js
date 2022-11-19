const videoURL = './assets/Company Introduction Animation360p.mp4';

const body = document.querySelector('body')

//video and controls container
const wrapper = document.createElement('section');
wrapper.className = 'video--wrapper'

body.append(wrapper)

    //video and sources
    const media = document.createElement('video')
    media.setAttribute('controls', '') //adds the play-pause button → even though is not supported in many browsers
    media.setAttribute('preload', 'auto') //makes rendering of the video simultaneusly with render of the page
    media.classList.add('video')

    //building the source element
    const source1 = document.createElement('source');
    source1.src = videoURL; //inserting videoURL inside the source for the video
    source1.type = 'video/mp4'

    //controls container and timer

    const controls = document.createElement('div') //controls container
    controls.className = "video--controls-container";

        //controls buttons
        const play = document.createElement('button'); //Play / Pause
        play.className = "button-play";
        play.setAttribute('data-icon', 'P');
        play.setAttribute('aria-label', 'play pause toggle');

        const stop = document.createElement('button'); //Stop
        stop.className = "button-stop";
        stop.setAttribute('data-icon', 'S');
        stop.setAttribute('aria-label', 'stop')

        const rwd = document.createElement('button'); //Rewind
        rwd.classList.add('rwd');
        rwd.setAttribute('data-icon', 'B');
        rwd.setAttribute('aria-label', 'rewind');
        

        const fwd = document.createElement('button'); //Forward
        fwd.classList.add('fwd');
        fwd.setAttribute('data-icon', 'F')
        fwd.setAttribute('aria-label', 'fast-forward');

        //timer
        const timerWrapper = document.createElement('div'); //timer wrapper
        timerWrapper.className = "timer";

        const timeBar = document.createElement('div') // Time bar

        const timer = document.createElement('span') // timer
        timer.setAttribute('aria-label', 'timer');
        timer.innerText = '00:00';

            //including timer elements inside timer container   
            timerWrapper.append(timeBar, timer);

        
    //inserting video controls and timer inside controls container:
    controls.append(play, stop, timerWrapper, rwd, fwd);    

    //inserting source inside media:
    media.append(source1);

//appending video controls and containers along video in video container    
wrapper.append(media, controls)


//removing native media controls visibility
media.removeAttribute('controls');

//adding visibility to custom controls
controls.style.visibility = "visible"

//impementing interactivity

    //Play/pause event ↓
    function playPauseMedia (){
        if(media.paused){ //attribute inside media (video)
            play.setAttribute('data-icon', 'u'); //change icon from play to pause ( || )
            media.play();
        } else {
            play.setAttribute('data-icon', 'P');
            media.pause();
        }
    }

    play.addEventListener('click', playPauseMedia)

    //Stopping event. There's no stop event in HTMLMediaElement like so, however pausing the video and returning currentTime to 0 makes up to the same effect
    function stopMedia(){
        media.pause(); //pause the video first
        media.currentTime = 0; //elapsed time of video → return it to 0
        play.setAttribute('data-icon', 'P') //change play button icon to "play" as in the start
    }

    stop.addEventListener('click', stopMedia); //→ trigger the event of stopping the video when we click stop button
    media.addEventListener('ended', stopMedia); // → stop the video when the media is ended

    //Implementing fast-forward and rewind

    //variables to set a specific interval of time for rewinding and fast-forward
    let intervalBwd; 
    let intervalFwd;

    function mediaBackward(){
        //first clear the interval from intervalFwd if there's any, also remove the class of active from fwd button. This way there'll be no interference from the forward associated variables into this function. That means that if we press fast-forward button first and then rewind, the former will affect the later. So this way we clear any interference
        clearInterval(intervalFwd);
        fwd.classList.remove('active');

        if(rwd.classList.contains('active')){  
            
            //find out if this rewind button had already been pressed is an indicator to remove previous classes such as 'active', clear any interval and play the media. 'contains' method helps us to check if this element contains the class 'active'
            rwd.classList.remove('active'); 
            
            clearInterval(intervalBwd); //this interval get cleared, so there's no more repetition every 200 miliseconds from the function below (windBackward)

            media.play(); //the media start playing, cancelling the rewind
        } 
        else {
            rwd.classList.add('active'); //if it hasn't been added, we add the class 'active'
        
            media.pause(); //pause the video
        
            intervalBwd = setInterval(windBackward, 200) //we use the function setInterval, to run the windBackward function every 200 miliseconds, this is equal to intervalBwd, as a loop saved in such variable
        }
        // media.currentTime -= 3; //simplets way I tried to implement this functionality
        // media.play()
    }

    //fast-forward function
    function mediaForward(){
        clearInterval(intervalBwd);
        rwd.classList.remove('active');

        if(fwd.classList.contains('active')){
            fwd.classList.remove('active'); 
            clearInterval(intervalFwd); 
            media.play(); 
        } else {
            fwd.classList.add('active');
            media.pause();
            intervalFwd = setInterval(windForward, 200);
        }
    }

    //Defining functions invoked in the setIntervals (windBackward and windForward)
    function windBackward(){
        if(media.currentTime <= 3){ //if the elapsed time of the video is below 3 seconds ↓
            
            rwd.classList.remove('active'); //remove the class 'active' from rwd
            
            clearInterval(intervalBwd); //the loop inside intervalBwd get cleared
            
            stopMedia(); //the video gets stopped
        } else { 
            media.currentTime -= 3; //rewinding the video 3 seconds
        }
    }

    function windForward() {
        if(media.currentTime >= media.duration - 3){
            fwd.classList.remove('active');
            clearInterval(intervalFwd);
            stopMedia();
        } else {
            media.currentTime += 3;
        }
    }

    rwd.addEventListener('click', mediaBackward);
    fwd.addEventListener('click', mediaForward);

console.log({media})
