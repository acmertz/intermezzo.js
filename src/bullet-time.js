class BulletTime {
    constructor() {
        this._index = [];
        this._callbacks = [];
        this._freeId = 0;
        this._playing = false;
        this._timer = new Worker("bullet-worker.js");
        this._timer.addEventListener("message", (message) => this._messageReceived(message));
    }

    addEvent(time, duration, callback) {
        // Adds an event to the timeline and returns its ID. Accepts an optional callback function as a parameter.
        this._index.push({
            id: this._freeId,
            time,
            duration,
            callback
        });

        this._timer.postMessage({
            type: "add",
            id: this._freeId,
            time,
            duration
        });

        return this._freeId++;
    }

    removeEvent(id) {
        // Removes the event with the given ID from the timeline.
        let result = this._index.filter((obj) => obj.id === id);
        if (result) this._index.splice(this._index.indexOf(result), 1);

        this._timer.postMessage({
            type: "remove",
            id
        });
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

    time() {
        // Logs the current playback time
        this._timer.postMessage({
            type: "time"
        })
    }

    registerCallback(type, callback) {
        // Registers a callback function for one of the following values for type: begin, end, play, pause, seek, time
        if (typeof type === "string" && typeof callback === "function") {
            this._callbacks.push({
                type,
                callback
            })
        }
    }

    unregisterCallback(type, callback) {
        // Unregisters a callback function for one of the following values for type: begin, end, play, pause, seek, time
        if (typeof type === "string" && typeof callback === "function") {
            let i = this._callbacks.length;
            while (i--) {
                if (this._callbacks[i].type === type && this._callbacks[i].callback === callback) {
                    this._callbacks.splice(i, 1);
                }
            }
        }
    }

    _messageReceived(message) {
        // Processes messages received from the worker
        let callbackData = {type: message.data.type};
        switch (message.data.type) {
            case "begin":
                callbackData.id = message.data.id;
                break;
            case "end":
                callbackData.id = message.data.id;
                break;
            case "play":
                break;
            case "pause":
                break;
            case "seek":
                callbackData.time = message.data.time;
                break;
            case "time":
                callbackData.time = message.data.time;
                break;
        }

        if (callbackData) {
            // Execute any matching callbacks
            for (let i=0; i<this._callbacks.length; i++) {
                if (this._callbacks[i].type === callbackData.type && typeof this._callbacks[i].callback === "function") {
                    this._callbacks[i].callback(callbackData);
                }
            }
        }
    }
}