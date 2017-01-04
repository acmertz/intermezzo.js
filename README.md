# intermezzo.js

## Goals
- Schedule events on a virtual timeline
- Play, pause, and seek the timeline
- Minimal performance impact to UI thread
- Works in browsers that support [`performance.now()`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now) (IE10+ and modern Chrome, FF, Edge, and Safari)

## What it does
- Schedule callbacks when events on the timeline begin and end
- Compute timing in a Worker to minimize the amount of work that is done on the UI thread
- Correct for `setTimeout` drift during playback

## What it doesn't do
- Animation and tweening
- Update the UI (you should use [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) to repeatedly check the playback state if you want to perform your own actions during playback)
- Render to a Canvas

## Why intermezzo.js?
intermezzo.js provides a simple way for you to create a timeline of arbitrary "events" and perform actions when those events begin or end. It makes no assumptions about the purpose of those events (you have to specify your own callbacks).

## Usage and examples
### Create a new instance of Intermezzo:
You may create multiple instances of Intermezzo within the same page. Instances operate independently of each other, and each instance creates its own Worker thread.

    var intermezzo = new Intermezzo()

### Add an event to the timeline:
Add an event to the timeline with the specified `time` and `duration`. If included, function `callback` is called when the event begins or ends during timeline playback. The event's unique ID (within this particular instance of Intermezzo) is returned.

    var eventId = intermezzo.addEvent(time, duration, callback)

### Remove an event from the timeline:
Remove an existing event from the timeline by passing the ID returned from `addEvent`.

    intermezzo.removeEvent(eventId)

### Begin playback:
Start playing back the timeline. Playback can only begin if the duration is greater than 0ms (calling `play` on an instance of Intermezzo with no events will have no effect).

    intermezzo.play()

### Pause playback:
Pause the playback. Has no effect if playback is already paused.

    intermezzo.pause()

### Seek to a time in milliseconds:
Seek the timeline to a specific time in milliseconds. Has no effect if playback is in progress (you must pause playback before seeking).

    intermezzo.seek(time)

### Register a callback:
Fire a callback when one of the following things occurs (use one of these for the value of `type`):

- `begin`: a timeline event has begun
- `end`: a timeline event has ended
- `play`: playback began
- `pause`: playback paused
- `stop`: playback stopped at the end of the timeline
- `seek`: finished seeking to a new time

The registered callback will fire whenever an event of that type occurs.

    intermezzo.registerCallback(type, callback)

### Unregister a previously-added callback:
    intermezzo.unregisterCallback(type, callback)