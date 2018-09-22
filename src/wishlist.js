import React, { Component } from "react";
import { connect } from "react-redux";
import {saveTrackQuery, receiveTracks} from "./actions";

class Wishlist extends Component {
    constructor() {
        super();
        this.state = {};
        this.saveTrackQuery = this.saveTrackQuery.bind(this);
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

    saveTrackQuery(e) {
        if (e.which === 13) {
            console.log("SAVED QUERY :", e.target.value);
            this.props.dispatch(saveTrackQuery(e.target.value));                    e.target.value = '';
        }

    }

    render() {
        // if (!this.props.trackQueries) {
        //     return null;
        // }
        console.log("this.propsmessages", this.props.trackQueries);

        return (
            <div>
                <h4>
                    {this.props.trackQueries}
                </h4>
                <section id="one" className="wrapper style1">
                    <div className="inner">
                        <article className="feature left">
                            <div className="content">
                                <h2>Drop your search query below</h2>
                                <p>
                                    <textarea
                                        className="chatBox"
                                        placeholder="Example: Depeche Mode - Everything Counts (T. Schumacher & V. Ruiz Remix)"
                                        onKeyDown={this.saveTrackQuery}
                                    />
                                </p>
                                <ul className="actions">
                                    <li>
                                        <input type="submit" text=""
                                            className="button alt"
                                            value=""
                                        />

                                    </li>
                                </ul>
                            </div>
                        </article>
                        <article className="feature right">
                            <div className="content">


                            </div>
                        </article>
                    </div>
                </section>

                {/* ====FORMER CHATROOM IS BELOW === */}
                {/*<div ref={elem => (this.elem = elem)}>
                    {this.props.trackQueries.map(message => (
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
    console.log("Wishlist mapStateToProps: ", state );
    // state = global redux state
    return {
        trackQueries: state.trackQueries
    };
};

// check length, if greater than then, then slice();

export default connect(mapsStateToProps)(Wishlist);
