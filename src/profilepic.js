import React from 'react';

export default function ProfilePic(props) {
    console.log('ProfilePic props', props);
    return (
        <div className="profilePicBox">
            <img src={props.url} alt="ProfilePic" className="profilePic" />
        </div>
    );
}
