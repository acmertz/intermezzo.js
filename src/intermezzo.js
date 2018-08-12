const IntermezzoWorker = require('worker-loader?inline&fallback=false!./intermezzo-worker.js');

export class Intermezzo {
    constructor() {
        this._index = [];
        this._callbacks = [];
        this._events = [];
        this._freeId = 0;
        this._eventId = 0;
        this._playing = false;
        this._timer = new IntermezzoWorker();
        this._timer.addEventListener("message", (message) => this._messageReceived(message));
        this.currentTime = 0;
    }

    /**
     * Adds an event to the timeline and returns its ID.
     * @param {number} time 
     * @param {number} duration
     * @param {function} [callback] An optional function for the event.
     * @returns {number} The ID of the event.
     */
    addEvent(time, duration, callback) {
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

    /**
     * Removes the event with the given ID from the timeline.
     * @param {number} id 
     */
    removeEvent(id) {
        let result = this._index.filter((obj) => obj.id === id);
        if (result) this._index.splice(this._index.indexOf(result), 1);

        this._timer.postMessage({
            type: "remove",
            id
        });
    }

    /**
     * Begins playback from the current position.
     * @returns {Promise} A promise that is resolved once playback has begun.
     */
    play() {
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

    /**
     * Pauses playback at the current position.
     * @returns {Promise} A promise that is resolved once playback has been paused.
     */
    pause() {
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

    /**
     * Seeks the timeline to the specified position.
     * @param {number} time The time in milliseconds.
     * @returns {Promise} A promise that is resolved once seeking has finished.
     */
    seek(time) {
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

    /**
     * Returns the duration of the timeline.
     * @returns {number} The duration of the timeline in milliseconds.
     */
    getDuration() {
        return Math.max(...this._index.map((val) => {return val.time + val.duration}));
    }

    /**
     * Registers a callback function to fire with details about timeline events.
     * @param {string} type One of the following values: begin, end, play, pause, seek, stop
     * @param {function} callback A function that is called when the event occurs.
     */
    registerCallback(type, callback) {
        if (typeof type === "string" && typeof callback === "function") {
            this._callbacks.push({
                type,
                callback
            })
        }
    }

    /**
     * Unregisters a callback function.
     * @param {string} type  One of the following values: begin, end, play, pause, seek, stop
     * @param {function} callback 
     */
    unregisterCallback(type, callback) {
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
        let resolveCallback = null,
            rejectCallback = null;
        const promise = new Promise((resolve, reject) => {
            resolveCallback = resolve;
            rejectCallback = reject;
        });
        this._events.push({
            eventId: eventId,
            resolve: resolveCallback,
            reject: rejectCallback
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
            promiseDetails = null;
        switch (message.data.type) {
            case "begin":
                callbackData.id = message.data.id;
                break;
            case "end":
                callbackData.id = message.data.id;
                break;
            case "play":
                promiseDetails = this._retrievePromise(message.data.eventId);
                break;
            case "pause":
                promiseDetails = this._retrievePromise(message.data.eventId);
                break;
            case "stop":
                this._playing = false;
                break;
            case "seek":
                callbackData.time = message.data.time;
                promiseDetails = this._retrievePromise(message.data.eventId);
                break;
            case "time":
                this.currentTime = parseFloat(message.data.time);
                callbackData = null;
                break;
        }

        if (promiseDetails && typeof promiseDetails.resolve === "function") promiseDetails.resolve();

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
