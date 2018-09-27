import React, { Component } from "react";
import { connect } from "react-redux";
import {saveTrackQuery, receiveTrackQueries, renderResults} from "./actions";
import axios from './axios';


class Wishlist extends Component {
    constructor() {
        super();
        this.state = {};
        this.saveTrackQuery = this.saveTrackQuery.bind(this);
        this.sendQueries = this.sendQueries.bind(this);

    }
    componentDidMount() {
        // console.log("this.elem ", this.elem);
        // if (!this.elem) {
        //     return;
        // }
        axios.get("/receiveTrackQueries").then(trackQueries => {
            // console.log("After Axios get > trackQueries ", trackQueries);
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
        axios.get("/sendQueries").then(finalData => {
            console.log("Wishlist.js: results from sendQueries", finalData);
            this.props.dispatch(renderResults(finalData));
        });
    }

    render() {
        if (!this.props.trackQueries) {
            return null;
        }
        console.log("this.propsmessages", this.props.trackQueries);

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

                                {this.props.trackQueries.map(trackQuery => (
                                    <div key={trackQuery.id}>
                                        <p>{trackQuery.query}</p>
                                    </div>
                                ))}

                                <input type="submit" text=""
                                    className="button alt"
                                    value="Send request"
                                    onClick={this.sendQueries}
                                />
                            </div>
                        </article>


                        <article className="wrapper style2 special">
                            <div className="content">
                                <h2>Your results</h2>

                                <div className="table-wrapper">

                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Cover image</th>
                                                <th>Artist name</th>
                                                <th>Track title</th>
                                                <th>Original query</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.props.results && this.props.results.map (result => (
                                                // <div key={result.trackId}>
                                                //     <p>{result.trackTitle}</p>
                                                // </div>

                                                <tr key={result.trackId}>

                                                    <td><a href={result.externalUrl} ><img src={result.imageUrl} alt="cover image" /></a></td>
                                                    <td>{result.artistNames}</td>
                                                    <td>{result.trackTitle}</td>
                                                    <td>{result.query}</td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>


                            </div>
                        </article>
                    </div>
                </section>


            </div>
        );
    }
}

const mapsStateToProps = state => {
    console.log("Wishlist mapStateToProps: ", state.results );
    // state = global redux state
    return {
        trackQueries: state.trackQueries,
        results: state.results
    };
};

// check length, if greater than then, then slice();

export default connect(mapsStateToProps)(Wishlist);
