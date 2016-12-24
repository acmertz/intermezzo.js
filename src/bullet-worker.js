const delay = 10,
    index = [];

let timer = null,
    lastTime = 0,
    startTime = 0,
    playing = false;

function processTime () {
    const currentTime = performance.now(),
        elapsed = currentTime - lastTime,
        diff = elapsed - delay;
    lastTime = currentTime;

    if (playing) {
        const nextTimeout = delay - diff;
        timer = setTimeout(processTime, nextTimeout);
    }
    else {
        timer = null;
        console.log("Timer stopped.");
    }
}

addEventListener("message", (message) => {
    switch (message.data.type) {
        case "play":
            playing = true;
            lastTime = performance.now();
            timer = setTimeout(processTime, delay);
            break;
        case "pause":
            playing = false;
            break;
        case "seek":
            break;
        case "time":
            console.log(lastTime - startTime);
            break;
        case "add":
            break;
        case "remove":
            break;
    }
});