import React , { Component } from 'react';

class Test extends Component {
    fileInput: React.RefObject<any>;
    constructor(props:any) {
        super(props);
        this.state = {  };
        this.fileInput = React.createRef();
    }

    public parseWordDocxFile = (inputElement: any) => {
        let file:any = this.fileInput.current.files[0];
        console.log(file);

        var reader = new FileReader();
        reader.onload = function(event) {
            var arrayBuffer = reader.result;

            let mammoth = require('mammoth');

            mammoth.convertToHtml({arrayBuffer: arrayBuffer}).then(function (resultObject: any) {
                var test = document.getElementById('result1');
                test.innerHTML = resultObject.value;
            })
        };
        reader.readAsArrayBuffer(file);
    }

    render() {
        return (
            <div>
                <input ref={this.fileInput} type="file" onChange={this.parseWordDocxFile}  />
                <div id="result1">
                    {}
                </div>
            </div>
        );
    }
}

export default Test;
