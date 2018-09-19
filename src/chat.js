import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSocket } from './socket';

class Chat extends Component {
    constructor() {
        super();
        this.state = {};

        this.saveChatMsg = this.saveChatMsg.bind(this);
    }
    // elem.scrollTop = elem.scrollHeight - elem.clientHeight;
    componentDidUpdate() {
        // this.elem.scrollTop;
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
                <textarea className="chatBox" onKeyDown={this.saveChatMsg} />
                <div ref={elem => (this.elem = elem)}>
                    {this.props.messages.map(message => (
                        <div key={message.chatid}>
                            <div className="chatBox">
                                <p className="p2">
                                    {message.first} {message.last}{' '}
                                    <p className="p1"> {message.message}</p>
                                </p>
                                <img
                                    className="profilePic"
                                    src={
                                        message.url ||
                                        '../Portrait_Placeholder.png'
                                    }
                                />

                                <p className="p3">
                                    Created at {message.created_at}{' '}
                                </p>
                            </div>

                            <p className="px">-------------------</p>
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
