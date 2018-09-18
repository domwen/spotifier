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
            <div className="profile2a">
                <h1>Chatroom</h1>
                <div className="chatRoom" ref={elem => (this.elem = elem)}>
                    {this.props.messages.map(message => (
                        <div key={message.chatid}>
                            <div className="chatRoom2">
                                <img
                                    className="chatImg"
                                    src={message.image_url || '../troll.png'}
                                />
                                <div className="chatRoom4">
                                    <h5>
                                        {message.first} {message.last}{' '}
                                    </h5>
                                    <p className="p1">
                                        Created at {message.created_at}{' '}
                                    </p>
                                </div>
                            </div>
                            <div className="chatRoom3">
                                <p className="p2">{message.message}</p>
                            </div>
                            <p className="px">-------------------</p>
                        </div>
                    ))}
                </div>
                <textarea className="txtarea" onKeyDown={this.saveChatMsg} />
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
