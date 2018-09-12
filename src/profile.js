import React from 'react';

export default function ProfilePic(props) {
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
                    <p onClick={props.toggleBio}>Update your bio.</p>
                )}
            </div>
        </div>
    );
}
