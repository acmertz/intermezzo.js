class BulletTime {
    constructor() {
        this._index = [];
        this._freeId = 0;
        this._playing = false;
        this._timer = new Worker("bullet-worker.js");
        this._timer.addEventListener("message", this._messageReceived);
    }

    addEvent(time, callback) {
        // Adds an event to the timeline and returns its ID. Accepts an optional callback function as a parameter.
        this._index.push({
            id: this._freeId,
            time: time,
            callback: callback
        });
        return this._freeId++;
    }

    removeEvent(id) {
        // Removes the event with the given ID from the timeline.
        let result = this._index.filter((obj) => obj.id === id);
        if (result) this._index.splice(this._index.indexOf(result), 1);
    }

    play() {
        // Begins playback from the current position.
        this._playing = true;
        this._timer.postMessage({
            type: "play"
        });
    }

    pause() {
        // Pauses playback at the current position.
        this._playing = false;
        this._timer.postMessage({
            type: "pause"
        });
    }

    seek(time) {
        // Seeks the timeline to the specified position.
        this._timer.postMessage({
            type: "seek",
            time
        });
    }

    _messageReceived() {
        // Processes messages received from the worker
    }
}