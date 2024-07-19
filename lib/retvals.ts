// BASS_ChannelIsActive return values
export const BASS_ACTIVE_STOPPED = 0; // The channel is not active, or handle is not a valid channel.
export const BASS_ACTIVE_PLAYING = 1; // The channel is playing (or recording).
export const BASS_ACTIVE_STALLED = 2; //Playback of the stream has been stalled due to a lack of sample data. Playback will automatically resume once there is sufficient data to do so.
export const BASS_ACTIVE_PAUSED = 3; //The channel is paused.
export const BASS_ACTIVE_PAUSED_DEVICE = 4; //The channel's device is paused.
