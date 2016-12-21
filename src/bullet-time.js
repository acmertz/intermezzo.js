class BulletTime {
    constructor() {
        this.index = [];
        this.freeId = 0;
    }

    addEvent(time, callback) {
        // Adds an event to the timeline and returns its ID. Accepts an optional callback function as a parameter.
        this.index.push({
            id: this.freeId,
            callback: callback
        });
        this.freeId++;
        return this.freeId - 1;
    }

    removeEvent(id) {
        // Removes the event with the given ID from the timeline.
        let result = this.index.filter((obj) => obj.id === id);
        if (result) this.index.splice(this.index.indexOf(result), 1);
    }

    play() {
        // Begins playback from the current position.
    }

    pause() {
        // Pauses playback at the current position.
    }

    seek() {
        // Seeks the timeline to the specified position.
    }
}