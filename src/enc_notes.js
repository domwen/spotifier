import React from 'react';
import ReactDOM from 'react-dom';

class Hello extends React.Component {
    constructor() {
        super();
        this.state = {
            name: 'Sesame',
            address: 'potsdamer str'
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            name: e.target.value
        });
    }

    componentDidMount() {
        console.log('component did mount running!');
    }

    render() {
        return (
            <div>
                <h1>Hello component: Welcome {this.state.name}!</h1>
                <Greetee name={this.state.name} address={this.state.address} />

                <GreeteeEditor handleChange={this.handleChange} />
            </div>
        );
    }
}

function GreeteeEditor(props) {
    return <input onChange={props.handleChange} />;
}

function Greetee(props) {
    return (
        <div>
            <h3>
                Greetee component: Hope you're enjoying React,
                {props.name}
            </h3>
        </div>
    );
}
// function HelloWorld() {
//
//     let cohort = "Sesame";
//
//     let styleObject = {
//         color: 'blue',
//         fontSize: '150px',
//         fontFamily: "Helvetica Neue",
//         fontWeight: 300
//     };
//
//     return (
//         <div className = 'greeting' style = { styleObject }>
//             <h1>usgg WELCOME </h1>
//             <p>Hello, { cohort }!</p>
//         </div>
//     );
//
// }
ReactDOM.render(<Hello />, document.querySelector('main'));
