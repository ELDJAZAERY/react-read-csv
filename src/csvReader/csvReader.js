import React, { Component } from 'react'
import csvDataChecker from './csvDataChecker'
import { StyledDropZone } from 'react-drop-zone'
import 'react-drop-zone/dist/styles.css'

export default class csvReader extends React.Component {
  state = {
    files: []
  }

  addFile = (file) => {
    var reader = new FileReader();
    reader.onload = function(e) {
      // Use reader.result
      console.log(e)
      console.log(csvDataChecker(reader.result))
    }
    reader.readAsText(file);
    this.setState({ files: [file] })
  }

  render() {
    return (
      <div>
        <StyledDropZone onDrop={this.addFile} />
        <ul>
          {
            this.state.files.map((file,index) =>
              <li key = {index} >
                <i className='fa fa-file' /> {file.name} [{file.type}]
              </li>
            )
          }
        </ul>
      </div>
    );
  }
  
}
