import React, { Component } from "react";
import { connect } from "react-redux";
import {saveTrackQuery, receiveTrackQueries} from "./actions";
import axios from './axios';


class Results extends Component {
    constructor() {
        super();
        this.state = {};
        this.saveTrackQuery = this.saveTrackQuery.bind(this);
    }
    componentDidMount() {
        // console.log("this.elem ", this.elem);
        // if (!this.elem) {
        //     return;
        // }
        axios.get("/receiveTrackQueries").then(trackQueries => {
            console.log("After Axios get > trackQueries ", trackQueries);
            this.props.dispatch(receiveTrackQueries(trackQueries));

        });
        // this.elem.scrollTop = this.elem.scrollHeight - this.elem.clientHeight;
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

    sendQueries() {
        axios.get("/sendQueries").then(results => {
            console.log("results from sendQueries", results);
        });
    }

    render() {
        // if (!this.props.trackQueries) {
        //     return null;
        // }
        // console.log("this.propsmessages", this.props.trackQueries);

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
                                        placeholder="Example: Depeche Mode - Everything Counts (T. Schumacher & V. Ruiz Remix)"
                                        onKeyDown={this.saveTrackQuery}
                                    />
                                </p>
                                <ul className="actions">
                                    <li>
                                        <input type="submit" text=""
                                            className="button alt"
                                            value="Save"
                                        />

                                    </li>
                                </ul>
                            </div>
                        </article>
                        <article className="feature right">
                            <div className="content">
                                <h2>Your saved tracks</h2>
                                <p>
                                    {/*{this.props.trackQueries}*/}
                                </p>

                                <input type="submit" text=""
                                    className="button alt"
                                    value="Send request"
                                    onClick={this.sendQueries}
                                />
                            </div>
                        </article>
                    </div>
                </section>

                {/* ====FORMER CHATROOM IS BELOW === */}
                {/*<div ref={elem => (this.elem = elem)}>
                    {this.props.trackQueries.map(trackQuery => (
                        <div key={trackQuery.queries.id}>
                            <div >
                                <div className="chatBox-inner">
                                    <p className="p2"> {trackQuery.query}</p>
                                    <p className="p3">
                                        Created at {trackQuery.created_at}{' '}
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
    console.log("Wishlist mapStateToProps: ", state.trackQueries );
    // state = global redux state
    return {
        trackQueries: state.trackQueries
    };
};

// check length, if greater than then, then slice();

export default connect(mapsStateToProps)(Results);
