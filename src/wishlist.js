import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSocket } from './socket';

class Wishlist extends Component {
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
            <div>
                <section id="one" className="wrapper style1">
                    <div className="inner">
                        <article className="feature left">
                            <div className="content">
                                <h2>Drop your search query below</h2>
                                <p>
                                    <textarea
                                        className="chatBox"
                                        placeholder="Example: Depeche Mode - Everything Counts (T. Schumacher & V. Ruiz Remix)
"
                                        onKeyDown={this.saveChatMsg}
                                    />
                                </p>
                                <ul className="actions">
                                    <li>
                                        <a href="#" className="button alt">
                                            Save
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </article>
                        <article className="feature right">
                            <div className="content">
                                <h2>Your saved tracks</h2>
                                <p>
                                    Sed egestas, ante et vulputate volutpat,
                                    eros pede semper est, vitae luctus metus
                                    libero eu augue. Morbi purus libero,
                                    faucibus adipiscing, commodo quis, gravida
                                    id, est.
                                </p>
                            </div>
                        </article>
                    </div>
                </section>

                {/* ====FORMER CHATROOM IS BELOW === */}
                {/*<div ref={elem => (this.elem = elem)}>
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
                </div>*/}
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

export default connect(mapsStateToProps)(Wishlist);
