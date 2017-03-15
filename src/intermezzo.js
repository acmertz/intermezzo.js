export default class Intermezzo {
    constructor() {
        this._index = [];
        this._callbacks = [];
        this._events = [];
        this._freeId = 0;
        this._eventId = 0;
        this._playing = false;
        this._timer = new Worker("intermezzo-worker.js");
        this._timer.addEventListener("message", (message) => this._messageReceived(message));
        this.currentTime = 0;
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
        if (this.getDuration() > 0 && !this._playing) {
            const eventId = this._eventId++;
            this._playing = true;
            this._timer.postMessage({
                type: "play",
                eventId: eventId
            });
            return this._generatePromise(eventId);
        }
    }

    pause() {
        // Pauses playback at the current position.
        if (this._playing) {
            const eventId = this._eventId++;
            this._playing = false;
            this._timer.postMessage({
                type: "pause",
                eventId: eventId
            });
            return this._generatePromise(eventId);
        }
    }

    seek(time) {
        // Seeks the timeline to the specified position.
        if (!this._playing) {
            const duration = this.getDuration(),
                eventId = this._eventId++;

            let seekTime = time;
            if (0 > time) seekTime = 0;
            else if (time > duration) time = duration;

            this._timer.postMessage({
                type: "seek",
                time: seekTime,
                eventId: eventId
            });

            return this._generatePromise(eventId);
        }
        else throw "Unable to seek: playback is currently in progress.";
    }

    getDuration() {
        return Math.max(this._index.map((val) => {return val.time + val.duration}));
    }

    registerCallback(type, callback) {
        // Registers a callback function for one of the following values for type: begin, end, play, pause, seek
        if (typeof type === "string" && typeof callback === "function") {
            this._callbacks.push({
                type,
                callback
            })
        }
    }

    unregisterCallback(type, callback) {
        // Unregisters a callback function for one of the following values for type: begin, end, play, pause, seek
        if (typeof type === "string" && typeof callback === "function") {
            let i = this._callbacks.length;
            while (i--) {
                if (this._callbacks[i].type === type && this._callbacks[i].callback === callback) {
                    this._callbacks.splice(i, 1);
                }
            }
        }
    }

    _generatePromise(eventId) {
        const promise = new Promise();
        this._events.push({
            eventId: eventId,
            promise: promise
        });
        return promise;
    }

    _retrievePromise(eventId) {
        const eventObj = this._events.find(item => eventId === item);
        if (eventObj) {
            this._events.splice(this._events.indexOf(eventObj), 1);
            return eventObj;
        }
    }

    _messageReceived(message) {
        // Processes messages received from the worker
        let callbackData = {type: message.data.type},
            promise = null;
        switch (message.data.type) {
            case "begin":
                callbackData.id = message.data.id;
                break;
            case "end":
                callbackData.id = message.data.id;
                break;
            case "play":
                promise = this._retrievePromise
                break;
            case "pause":
                break;
            case "stop":
                this._playing = false;
                break;
            case "seek":
                callbackData.time = message.data.time;
                break;
            case "time":
                this.currentTime = parseFloat(message.data.time);
                callbackData = null;
                break;
        }

        if (promise) Promise.resolve(promise);

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

if (module) {
    module.exports = Intermezzo;
}