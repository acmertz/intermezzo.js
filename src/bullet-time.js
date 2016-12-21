const _index = [];

let freeId = 0;

export function addEvent (time, callback) {
    // Adds an event to the timeline and returns its ID. Accepts an optional callback function as a parameter.
    _index.push({
        id: freeId,
        callback: callback
    });
    freeId++;
    return freeId - 1;
}

export function removeEvent (id) {
    // Removes the event with the given ID from the timeline.
    let result = _index.filter((obj) => obj.id === id);
    if (result) _index.splice(_index.indexOf(result), 1);
}

export function play () {
    // Begins playback from the current position.
}

export function pause () {
    // Pauses playback at the current position.
}

export function seek () {
    // Seeks the timeline to the specified position.
}