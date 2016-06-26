import React from 'react';

const MIME_VIDEO_CODEC = 'video/mp4; codecs="avc1.640029"';
const MIME_AUDIO_CODEC = 'audio/mp4; codecs="mp4a.40.2"';

const fileName = 'namelsakatetalibrad_180x180_3dh'; // debug use

export default (OriginalVideoPlayer) => class extends React.Component {

    static propTypes = {
        params: React.PropTypes.object
    }

    constructor(props) {
        super(props);

        this.state = {
            src: null
        };

        this._isWorking = false;
        this._isSeeking = false;
        this._bufferedSegment = {};
        this._bufferQueue = [];
        this._videoQueue = [];
        this._audioQueue = [];
        this._duration = null;
        this._fetchFlag = false;
        this.mediaSource = new MediaSource();
        this._src = URL.createObjectURL(this.mediaSource);
    }

    componentDidMount() {
        const mediaSource = this.mediaSource;

        Promise.all([this._getCreateSourcePromise(), this._getVideoInfoPromise()])
            .then(() => {
                const videoSourceBuffer = this.videoSourceBuffer = mediaSource.addSourceBuffer(MIME_VIDEO_CODEC);
                const audioSourceBuffer = this.audioSourceBuffer = mediaSource.addSourceBuffer(MIME_AUDIO_CODEC);
                const duration = this._duration;
                videoSourceBuffer.addEventListener('updateend', this._videoSourceUpdate);
                audioSourceBuffer.addEventListener('updateend', this._audioSourceUpdate);
                mediaSource.duration = duration;
            })
            .then(() => {
                return Promise.all([this._getVideoInit(), this._getAudioInit()]);
            })
            .then((arrayBuffers) => {
                this.videoSourceBuffer.appendBuffer(new Uint8Array(arrayBuffers[0]));
                this.audioSourceBuffer.appendBuffer(new Uint8Array(arrayBuffers[1]));
            })
            .then(() => {
                this._enqueueSegment(0);
            })
            .catch((err) => {
                console.error(err.message);
            });
    }

    _getVideoInit = () => {
        return fetch(`/video/${fileName}/init/video`)
            .then((response) => {
                return response.arrayBuffer();
            });
    }

    _getAudioInit = () => {
        return fetch(`/video/${fileName}/init/audio`)
            .then((response) => {
                return response.arrayBuffer();
            });
    }

    _getCreateSourcePromise() {
        return new Promise((resolve) => {
            const handleSourceOpen = () => {
                this.mediaSource.removeEventListener('sourceopen', handleSourceOpen);
                resolve();
            };

            this.mediaSource.addEventListener('sourceopen', handleSourceOpen);
        });
    }

    componentWillUnmount() {
        const {
            videoSourceBuffer,
            audioSourceBuffer,
            mediaSource
        } = this;
        videoSourceBuffer.abort();
        audioSourceBuffer.abort();
        mediaSource.endOfStream();
        videoSourceBuffer.removeEventListener('update', this._videoSourceUpdate);
        audioSourceBuffer.removeEventListener('update', this._audioSourceUpdate);
        mediaSource.removeSourceBuffer(videoSourceBuffer);
        mediaSource.removeSourceBuffer(audioSourceBuffer);
        mediaSource.removeEventListener('sourceopen', this._handleSourceOpen);
    }

    _getVideoInfoPromise() {
        return new Promise((resolve, reject) => {
            fetch(`/video/${fileName}/info`)
                .then((response) => {
                    return response.json();
                })
                .then((json) => {
                    this._duration = json.duration * 0.001;
                    resolve();
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                });
        });
    }

    _fetchVideoSegment = (segment) => {
        return new Promise((resolve, reject) => {
            fetch(`/video/${fileName}/data/video/${segment + 1}`)
            .then((response) => {
                return response.arrayBuffer();
            })
            .then((arrayBuffer) => {
                const buffer = new Uint8Array(arrayBuffer);
                const sourceBuffer = this.videoSourceBuffer;
                const queue = this._videoQueue;
                if (
                    (queue.length > 0) ||
                    (sourceBuffer.updating)
                ) {
                    queue.push({
                        buffer
                    });
                } else {
                    sourceBuffer.appendBuffer(buffer);
                }
                resolve();
            })
            .catch((err) => {
                console.error('video Error');
                reject(err);
            });
        });
    }

    _fetchAudioSegment = (segment) => {
        return new Promise((resolve, reject) => {
            fetch(`/video/${fileName}/data/audio/${segment + 1}`)
            .then((response) => {
                return response.arrayBuffer();
            })
            .then((arrayBuffer) => {
                const buffer = new Uint8Array(arrayBuffer);
                const sourceBuffer = this.audioSourceBuffer;
                const queue = this._audioQueue;
                if (
                    (queue.length > 0) ||
                    (sourceBuffer.updating)
                ) {
                    queue.push({
                        buffer
                    });
                } else {
                    sourceBuffer.appendBuffer(buffer);
                }
                resolve();
            })
            .catch((err) => {
                console.error('audio Error');
                reject(err);
            });
        });
    }

    _loadSegment = (segment) => {
        if (this._fetchFlag) {
            return;
        }

        this._fetchFlag = true;
        Promise.all([
            this._fetchVideoSegment(segment), this._fetchAudioSegment(segment)
        ])
        .then(() => {
            this._fetchFlag = false;
            if (this._bufferQueue.length > 0) {
                this._loadSegment(this._bufferQueue.shift());
            }
            else {
                this._isWorking = false;

                if (this._isSeeking) {
                    const videoBuffer = this.videoSourceBuffer.buffered;
                    const bufferedLength = videoBuffer.length;
                    let distance = 100000,
                        point = 0;

                    for (let i = 0; i < bufferedLength; i++) {
                        const startTime = videoBuffer.start(i);
                        const endTime = videoBuffer.end(i);

                        if (this._seekToTime >= startTime && this._seekToTime < endTime) {
                            this._isSeeking = false;
                            return;
                        }

                        const startDistance = Math.abs(this._seekToTime - startTime);

                        if (startDistance < distance) {
                            distance = startDistance;
                            point = i;
                        }
                    }

                    let lastNumber = -1;

                    for (let number in this._bufferedSegment) {
                        const currentNumber = parseInt(number);
                        if (currentNumber !== lastNumber + 1) {
                            point--;
                            if (point === 0) {
                                return this._checkAndEnqueue(currentNumber - 1);
                            }
                        }
                        lastNumber = parseInt(currentNumber);
                    }

                }
            }
        })
        .catch((err) => {
            console.error(err);
        });
    }

    _videoSourceUpdate = () => {
        const sourceBuffer = this.videoSourceBuffer;
        const queue = this._videoQueue;
        if (
            (queue.length > 0) &&
            !sourceBuffer.updating
        ) {
            const {
                buffer
            } = queue.shift();
            sourceBuffer.appendBuffer(buffer);
        }
    }

    _audioSourceUpdate = () => {
        const sourceBuffer = this.audioSourceBuffer;
        const queue = this._audioQueue;
        if (
            (queue.length > 0) &&
            !sourceBuffer.updating
        ) {
            const {
                buffer
            } = queue.shift();
            sourceBuffer.appendBuffer(buffer);
        }
    }

    _handleSeeking = (video) => {
        this._isSeeking = true;
        this._seekToTime = video.currentTime;
        let nextSegment = Math.floor(video.currentTime * 0.1) - 2;
        this._checkAndEnqueue(nextSegment++);
        this._checkAndEnqueue(nextSegment++);
        this._checkAndEnqueue(nextSegment++);
        this._checkAndEnqueue(nextSegment++);
        this._checkAndEnqueue(nextSegment++);
    }

    _handleTimeUpdate = (video) => {
        let nextSegment = Math.floor(video.currentTime * 0.1);
        this._checkAndEnqueue(nextSegment++);
        this._checkAndEnqueue(nextSegment++);
        this._checkAndEnqueue(nextSegment++);
    }

    _checkAndEnqueue(nextSegment) {
        if (nextSegment < 0) {
            return;
        }

        if (this._bufferedSegment[nextSegment] === undefined) {
            this._bufferedSegment[nextSegment] = 'pending';
            this._enqueueSegment(nextSegment);
        }
    }

    _enqueueSegment = (segment) => {
        this._bufferQueue.push(segment);

        if (!this._isWorking) {
            this._isWorking = true;
            this._loadSegment(this._bufferQueue.shift());
        }
    }

    render() {
        return (
            <OriginalVideoPlayer
                src={this._src}
                onSeeking={this._handleSeeking}
                onTimeUpdate={this._handleTimeUpdate}
            />
        );
    }
};
