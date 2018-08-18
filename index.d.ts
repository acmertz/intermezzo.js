export as namespace Intermezzo;

export = Intermezzo;

declare class Intermezzo {
  /** Constructs a new instance of Intermezzo. */
  constructor();

  /** The current playback position in milliseconds. */
  currentTime: number;

  /** Adds an event to the timeline and returns its ID.
   * @param time The start of the event in milliseconds.
   * @param duration The duration of the event in milliseconds.
   * @param callback A function to call when the event starts or ends.
   * @returns A number that uniquely identifies the event within this instance of Intermezzo.
   */
  addEvent(time: number, duration: number, callback?: Function) : number;

  /** Removes the event with the given ID from the timeline.
   * @param id The ID of the event to remove.
   */
  removeEvent(id: number) : void;

  /** Begins playback from the current position.
   * @returns A promise that resolves once playback has started.
   */
  play() : Promise<void>;

  /** Pauses playback at the current position.
   * @returns A promise that resolves once playback has paused.
   */
  pause() : Promise<void>;

  /** Seeks the timeline to the specified position.
   * @param time A time in milliseconds to which to seek the timeline.
   * @returns A promise that resolves when the timeline finishes seeking.
   */
  seek(time: number) : Promise<void>;

  /** Returns the duration of the timeline.
   * @returns The duration of the timeline in milliseconds.
   */
  getDuration() : number;

  /** Registers a callback function to fire with details about timeline events.
   * @param type The type of listener. Must be one of the following values: begin, end, play, pause, seek, stop
   * @param callback A function that is called when an event of this type occurs.
   */
  registerCallback(type: string, callback: Function) : void;

  /** Unregisters a callback function.
   * @param type The type of listener. Must be one of the following values: begin, end, play, pause, seek, stop
   * @param callback A function that is called when an event of this type occurs.
   */
  unregisterCallback(type: string, callback: Function) : void;
}