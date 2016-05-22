# react-aframe-raised-button
An A-Frame React Component with Material Design styling

## Important
This is a React Component written with React 0.14.*, and using the latest version of AFrame on github.
Please make sure the environment meet the requirement, or some of the functionality will not work.
For example, if you're using the AFrame from npm, the built in THREE module is still R74, so clipping will not work.

## Demo
This is [an example](http://bjchen990.github.io/react-aframe-raised-button/ "ARaisedButton").

## Example
`ACursor` will notify the clicked target the point where it was clicked. This is not support in built-in AFrame, so please remember to use this.

```
require('aframe');
import React from 'react';
import {render} from 'react-dom';
import {ARaisedButton, ACursor} from 'react-aframe-raised-button';

render((
    <a-scene debug='true' stats>
    <a-camera
        ref="camera"
        id='user'
        position='0 0 0'
        near='0.01'
        stereo-camera='eye:left;'
        aTurn="strength: 0.1"
    >
        <ACursor />
    </a-camera>
    <a-sky color='white' />
        <a-entity position="0 0 -3">
            <ARaisedButton backgroundColor='#fafafa' colorChangeRate={1} fontColor='black' />
        </a-entity>
    </a-scene>
    ), document.getElementById('appContainer')
);
```
