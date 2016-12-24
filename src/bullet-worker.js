const index = [];

let timer = null,
    precision = 10,
    lastTime = 0,
    startTime = 0,
    playing = false;

function processTime () {
    const currentTime = performance.now(),
        elapsed = currentTime - lastTime,
        diff = elapsed - precision;
    lastTime = currentTime;

    for (let i=0; i<index.length; i++) {
        const currentItem = index[i];
        if (currentItem.playing) {
            // Check if the event should end
            if (currentTime > currentItem.time + currentItem.duration) {
                currentItem.playing = false;
                postMessage({
                    id: currentItem.id,
                    type: "end"
                });
            }
        }
        else {
            // Check if the event should begin
            if (currentTime > currentItem.time && currentItem.time + currentItem.duration > currentTime) {
                currentItem.playing = true;
                postMessage({
                    id: currentItem.id,
                    type: "begin"
                });
            }
        }
    }

    if (playing) {
        const nextTimeout = precision - diff;
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
            timer = setTimeout(processTime, precision);
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
            let newEvent = message.data;
            newEvent.playing = false;
            index.push(newEvent);
            break;
        case "remove":
            let result = index.filter((obj) => obj.id === message.data.id);
            if (result) this.index.splice(this.index.indexOf(result), 1);
            break;
    }
});