import React from 'react';
import { Link } from 'react-router-dom';

export default function Profile(props) {
    return (
        <div className="profileContainer">
            <div className="profilePic">
                <img
                    src={props.url}
                    alt="ProfilePic"
                    className="profilePic"
                    onClick={props.clickHandler}
                />
            </div>
            <div className="profileInfo">
                <h4>
                    {props.first} {props.last}
                </h4>
                <p>{props.bio}</p>

                {props.showBio ? ( //== WHAT DOES ? MEAN? ==
                    <textarea
                        onKeyDown={props.setBio}
                        defaultValue={props.bio}
                    />
                ) : (
                    <button
                        className="btn"
                        onKeyDown={props.setBio}
                        defaultValue={props.bio}
                        onClick={props.toggleBio}
                    >
                        Update your bio
                    </button>
                )}
            </div>
        </div>
    );
}
