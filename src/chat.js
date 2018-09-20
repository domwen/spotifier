import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSocket } from './socket';

class Chat extends Component {
    constructor() {
        super();
        this.state = {};

        this.saveChatMsg = this.saveChatMsg.bind(this);
    }
    componentDidMount() {
        if (!this.elem) {
            return;
        }
        this.elem.scrollTop = this.elem.scrollHeight - this.elem.clientHeight;
    }

    componentDidUpdate() {
        if (!this.elem) {
            return;
        }
        this.elem.scrollTop = this.elem.scrollHeight - this.elem.clientHeight;
    }

    saveChatMsg(e) {
        if (e.which === 13) {
            getSocket().emit('chat', e.target.value);
            e.target.value = '';
        }
    }
    render() {
        if (!this.props.messages) {
            return null;
        }
        console.log('this.propsmessages', this.props.messages);

        return (
            <div className="chatRoomContainer">
                <h1>Chatroom</h1>
                <textarea
                    className="chatBox"
                    placeholder="Enter message here and press Enter (sorry for the shitty UX)"
                    onKeyDown={this.saveChatMsg}
                />
                <div ref={elem => (this.elem = elem)}>
                    {this.props.messages.map(message => (
                        <div key={message.chatid}>
                            <div className="chatBox">
                                <div>
                                    <img
                                        className="chatImg"
                                        src={
                                            message.url ||
                                            '../Portrait_Placeholder.png'
                                        }
                                    />
                                </div>
                                <div className="chatBox-inner">
                                    <p className="p2"> {message.message}</p>
                                    <p>
                                        User:{' '}
                                        <span className="p1">
                                            {message.first} {message.last}
                                        </span>
                                    </p>

                                    <p className="p3">
                                        Created at {message.created_at}{' '}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

const mapsStateToProps = state => {
    // state = global redux state
    return {
        messages: state.recentMessages
    };
};

// check length, if greater than then, then slice();

export default connect(mapsStateToProps)(Chat);
