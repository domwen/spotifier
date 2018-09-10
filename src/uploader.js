import React from 'react';
import axios from './axios';

export default function Uploader(props) {
    let file;

    function onChange(e) {
        console.log('e.target:', e.target);
        e.preventDefault();
        file = e.target.files[0];
    }

    function submit(e) {
        const fd = new FormData();
        fd.append('file', file);
        axios.post('/upload', fd).then(({ data }) => {
            props.updateImage(data.imageUrl);
        });
    }
    return (
        <div className="uploaderModal">
            <input
                id="myInput"
                className="cta"
                type="file"
                accept="image/*"
                onChange={onChange}
            />
            <button className="cta" onClick={submit}>
                Update
            </button>
        </div>
    );
}

// Ivanas Approach

// import React from 'react';
//
// export default class Uploader extends React.Component {
//     constructor(props) {
//         // prepare a class for props
//         super(props);
//     }
//
//     upload(e) {
//         console.log('e.target.files[0]', e.target.files[0]);
//         this['file'] = e.target.files[0];
//     }
//     render() {
//         return (
//             <div id="containerModal">
//                 <h3>Uploader!</h3>
//
//                 <input
//                     type="file"
//                     accept="image/*"
//                     className="btn"
//                     onChange={e => this.upload(e)}
//                 />
//                 <button onClick={() => this.props.submit(this.file)}>
//                     Upload
//                 </button>
//             </div>
//         );
//     }
// }
