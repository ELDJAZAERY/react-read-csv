import React, { Component } from 'react'
import {DropzoneDialog} from 'material-ui-dropzone'
import Button from '@material-ui/core/Button';
import csvDataChecker from './csvDataChecker'



export default class DropzoneDialogExample extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            sites : [],
            warnings : [],
            errors : [],
            reset : false,
        };
    }

    handleClose() {
        this.setState({
            open: false
        });
    }

    onDrop(file){
        var reader = new FileReader();
        //console.log(file)
        this.setState({
            sites:[],
            warnings:[],
            errors:[],
        })

        reader.onload = () => {
          let {sites , warnings , errors } = csvDataChecker(reader.result)
          console.log(sites)

          this.setState({
            sites,
            warnings,
            errors,
            reset : (errors.length) ? true : false,
          })
        }
        reader.readAsText(file);
    }

    handleSave(files) {
        //Saving files to state for further use and closing Modal.
        this.setState({
            files: files, 
            open: false
        });
    }

    handleOpen() {
        this.setState({
            open: true,
        });
    }

    render() {
        return (
            <div>
                <Button onClick={this.handleOpen.bind(this)}>
                  Add Image
                </Button>
                <DropzoneDialog
                    dropzoneText = {'-- Glissez un fichier CSV ou cliquez ici --'}
                    open={this.state.open}
                    error = {this.state.errors[0] || null }
                    warnings = {this.state.warnings}
                    reset = {this.state.reset}
                    onDrop = {this.onDrop.bind(this)}
                    onSave={this.handleSave.bind(this)}
                    acceptedFiles={['text/csv']}
                    showPreviews={true}
                    maxFileSize={5000000}
                    onClose={this.handleClose.bind(this)}
                />
            </div>
        );
    }
}