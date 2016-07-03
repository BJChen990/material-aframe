import React from 'react';
import ReactDOM from 'react-dom';
import FunctionUtil from '../utils/FunctionUtil';

export default (OriginalComponent) => class extends React.Component {

    static displayName = `ALinkButton(${
            OriginalComponent.displayName ||
            OriginalComponent.name ||
            'Component'
    })`;

    static propTypes = {
        link: React.PropTypes.node
    }

    constructor(props) {
        super(props);
        this._leaved = false;
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return FunctionUtil.contextShallowCompare(this, nextProps, nextState, nextContext);
    }

    render() {
        const {
            link,
            ...others
        } = this.props;
        const newLink = React.cloneElement(link, {
            ref: 'link'
        });

        return (
            <a-entity>
                <OriginalComponent key="component" {...others} onClick={this._handleClick} />,
                {newLink}
            </a-entity>
        );
    }

    _handleClick = () => {
        ReactDOM.findDOMNode(this.refs.link).click();
    }
};
