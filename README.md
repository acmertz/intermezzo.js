# BulletTime.js

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

## Why BulletTime.js?
BulletTime.js provides a simple way for you to create a timeline of arbitrary "events" and perform actions when those events begin or end. It makes no assumptions about the purpose of those events (you have to specify your own callbacks).

## Usage and examples
Todo: add usage and examples