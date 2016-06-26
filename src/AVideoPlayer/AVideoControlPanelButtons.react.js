import React from 'react';
import AnIconButton from '../AButtons/AnIconButton.react';
import FunctionUtil from '../utils/FunctionUtil';
import Constants from '../constants';
const {PIXEL_TO_METER} = Constants;

export default class AVideoControlPanelButtons extends React.Component {

    static contextTypes = {
        currentState: React.PropTypes.string,
        onSetPlay: React.PropTypes.func,
        onSetPause: React.PropTypes.func,
        onSetForward: React.PropTypes.func,
        handleBackButtonClick: React.PropTypes.func,
        router: React.PropTypes.object
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return FunctionUtil.contextShallowCompare(this, nextProps, nextState, nextContext);
    }

    renderPlayState() {
        return (
            <AnIconButton
                iconSrc="/images/pause.svg"
                onClick={this.context.onSetPause}
                position="-2 0 0.5"
            />
        );
    }

    renderPauseState() {
        return (
            <AnIconButton
                iconSrc="/images/play.svg"
                onClick={this.context.onSetPlay}
                position="-2 0 0.01"
            />
        );
    }

    renderPendingState() {
        return (
            <AnIconButton
                iconSrc="/images/sync.svg"
                onClick={this._handleTogglePlay}
                position="-2 0 0.01"
            />
        );
    }

    _handleBackButtonClick = () => {
        const context = this.context;
        context.handleBackButtonClick(() => {
            context.router.goBack();
        });
    }

    _handleForward5 = () => {
        this.context.onSetForward(5);
    }

    _handleForward10 = () => {
        this.context.onSetForward(10);
    }

    _handleForward30 = () => {
        this.context.onSetForward(30);
    }

    render() {
        const currentState = this.context.currentState;
        let playControlButton;

        switch (currentState) {
        case 'playing':
            playControlButton = this.renderPlayState();
            break;
        case 'paused':
            playControlButton = this.renderPauseState();
            break;
        case 'pending':
            playControlButton = this.renderPendingState();
            break;
        }

        return (
            <a-entity
                geometry={`primitive: roundedrect; width: ${6}; height: ${72 * PIXEL_TO_METER}; radius: 0.02;`}
                material='color: #fafafa;'
            >
                {playControlButton}
                <AnIconButton
                    iconSrc="/images/forward5.svg"
                    onClick={this._handleForward5}
                    position="-1 0 0.01"
                />
                <AnIconButton
                    iconSrc="/images/forward10.svg"
                    onClick={this._handleForward10}
                    position="0 0 0.01"
                />
                <AnIconButton
                    iconSrc="/images/forward30.svg"
                    onClick={this._handleForward30}
                    position="1 0 0.01"
                />
                <AnIconButton
                    iconSrc="/images/apps.svg"
                    onClick={this._handleBackButtonClick}
                    position="2 0 0.01"
                />
            </a-entity>
        );
    }
}
