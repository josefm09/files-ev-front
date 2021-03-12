import React, { Component } from 'react';
import UploadService from '../services/UploadFileService';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Box, Typography, Button, ListItem, withStyles } from '@material-ui/core';

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 15,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: "#EEEEEE",
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#1a90ff',
  },
}))(LinearProgress);

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedFiles: [],
      currentFile: undefined,
      progress: 0,
      message: "",
      isError: false,
      fileInfos: [],
    };
  }

  selectFile(event) {
    this.setState({
      selectedFiles: this.state.selectedFiles.concat(event.target.files),
    });
  }

  upload() {
    alert(this.state.selectedFiles);
    for (let i = 0; i < this.state.selectedFiles.length; i++) {
      let currentFile = this.state.selectedFiles[i];

      this.setState({
        progress: 0,
        currentFile: currentFile,
      });

      UploadService.upload(currentFile, (event) => {
        this.setState({
          progress: Math.round((100 * event.loaded) / event.total),
        });
      })
        .then((response) => {
          this.setState({
            message: response.data.message,
            isError: false
          });
        })
        .catch(() => {
          this.setState({
            progress: 0,
            message: "No se pudieron cargar los archivos!",
            currentFile: undefined,
            isError: true
          });
        });
    }

    this.setState({
      selectedFiles: undefined,
    });
  }

  /*showFile = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => { 
      const text = (e.target.result)
      console.log(text)
      alert(text)
    };

    reader.readAsText(e.target.files[i])
    const files = e.target.files;

    
  }*/

  render = () => {

    const {
      selectedFiles,
      currentFile,
      progress,
      message,
      fileInfos,
      isError
    } = this.state;
    
    return (
      <div className="mg20">
        {currentFile && (
          <Box className="mb25" display="flex" alignItems="center">
            <Box width="100%" mr={1}>
              <BorderLinearProgress variant="determinate" value={progress} />
            </Box>
            <Box minWidth={35}>
              <Typography variant="body2" color="textSecondary">{`${progress}%`}</Typography>
            </Box>
          </Box>)
        }

        <label htmlFor="btn-upload">
          <input
            id="btn-upload"
            name="btn-upload"
            style={{ display: 'none' }}
            type="file"
            multiple
            onChange={e => this.selectFile(e)} />
          <Button
            className="btn-choose"
            variant="outlined"
            component="span" >
             Choose Files
          </Button>
        </label>
        <div className="file-name">
        {selectedFiles && selectedFiles.length > 0 ? selectedFiles[0].name : null}
        </div>
        <Button
          className="btn-upload"
          color="primary"
          variant="contained"
          component="span"
          disabled={!selectedFiles}
          onClick={this.upload}>
          Upload
        </Button>

        <Typography variant="subtitle2" className={`upload-message ${isError ? "error" : ""}`}>
          {message}
        </Typography>

        <Typography variant="h6" className="list-header">
          List of Files
          </Typography>
        <ul className="list-group">
          {fileInfos &&
            fileInfos.map((file, index) => (
              <ListItem
                divider
                key={index}>
                <a href={file.url}>{file.name}</a>
              </ListItem>
            ))}
        </ul>
      </div >
    );
  }

}

export default Home;