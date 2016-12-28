const index = [];

let timer = null,
    precision = 10,
    lastTime = 0,
    startTime = 0,
    offsetTime = 0,
    playing = false;

function processTime () {
    lastTime = (performance.now() - startTime) + offsetTime;

    for (let i=0; i<index.length; i++) {
        const currentItem = index[i];

        // Check if the event should end
        if (lastTime > currentItem.time + currentItem.duration) {
            if (currentItem.playing) {
                currentItem.playing = false;
                postMessage({
                    id: currentItem.id,
                    type: "end"
                });
            }
        }

        // Check if the event should begin
        else if (lastTime > currentItem.time && currentItem.time + currentItem.duration > lastTime) {
            if (!currentItem.playing) {
                currentItem.playing = true;
                postMessage({
                    id: currentItem.id,
                    type: "begin"
                });
            }
        }
    }

    if (playing) {
        timer = setTimeout(processTime, precision);
    }
    else {
        timer = null;
        offsetTime = lastTime;
        postMessage({
            type: "pause"
        });
    }
}

addEventListener("message", (message) => {
    switch (message.data.type) {
        case "play":
            playing = true;
            startTime = performance.now();
            timer = setTimeout(processTime, precision);
            postMessage({
                type: "play"
            });
            break;
        case "pause":
            playing = false;
            break;
        case "seek":
            offsetTime = lastTime = parseFloat(message.data.time);
            postMessage({
                type: "seek",
                time: offsetTime
            });
            break;
        case "time":
            postMessage({
                type: "time",
                time: lastTime
            });
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