import React from 'react';

export default function ProfilePic(props) {
    console.log('ProfilePic props', props);
    return (
        <div className="userInfoBox">
            <h4>
                {' '}
                Hello {props.firstName} {props.lastName}
            </h4>
            <img
                src={props.url}
                alt="ProfilePic"
                className="profilePic"
                onClick={props.clickHandler}
            />
        </div>
    );
}
