import React from 'react';
import axios from './axios';
import Logo from './logo';
import ProfilePic from './profilepic';
import Uploader from './uploader';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.updateImage = this.updateImage.bind(this);
        this.makeUploaderVisible = this.makeUploaderVisible.bind(this);
    }
    componentDidMount() {
        axios.get('/user').then(({ data }) => {
            if (!data.url) {
                data.url = '/internets9yk.jpg';
            }
            this.setState(data);
            console.log('componentDidMount data: ', data);
        });
    }
    makeUploaderVisible() {
        this.setState({
            uploaderIsVisible: true
        });
    }
    updateImage(imageUrl) {
        this.setState({
            url: imageUrl,
            uploaderIsVisible: false
        });
    }
    submit() {
        const fd = new FormData();
        axios.post('/upload', fd).then(({ data }) => {
            this.props.updateImage(data.imageUrl);
        });
    }
    render() {
        // if (!this.state.id) {
        //     return (
        //         <div>
        //             <Logo />
        //         </div>
        //     );
        // }
        return (
            <div>
                <h4>You are logged in</h4>
                <ProfilePic
                    url={this.state.url}
                    firstName={this.state.firstName}
                    lastName={this.state.lastName}
                    clickHandler={this.makeUploaderVisible}
                />
                {this.state.uploaderIsVisible && (
                    <Uploader updateImage={this.updateImage} />
                )}
            </div>
        );
    }
}
