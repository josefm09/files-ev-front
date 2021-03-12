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
      selectedFiles: undefined,
      currentFile: undefined,
      progress: 0,
      progressInfos: [],
      message: [],
      isError: false,
      fileInfos: [],
    };

    this.selectFiles = this.selectFiles.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
  }

  selectFiles(event) {
    this.setState({
      progressInfos: [],
      selectedFiles: event.target.files,
    });
    alert(this.state.selectedFiles);
  }

  uploadFiles() {
    const selectedFiles = this.state.selectedFiles;

    let _progressInfos = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      _progressInfos.push({ percentage: 0, fileName: selectedFiles[i].name });
    }

    this.setState(
      {
        progressInfos: _progressInfos,
        message: [],
      },
      () => {
        for (let i = 0; i < selectedFiles.length; i++) {
          this.upload(i, selectedFiles[i]);
        }
      }
    );
  }

  upload(idx, file) {
    let _progressInfos = [...this.state.progressInfos];

    const reader = new FileReader();
    reader.onload = async (file) => { 
      const text = (file.target.result);
      console.log(text);
      console.log(this.props.userId);
      UploadService.upload(text, this.props.userId, (event) => {
        _progressInfos[idx].percentage = Math.round((100 * event.loaded) / event.total);
        this.setState({
          _progressInfos,
        });
      })
        .then((response) => {
          this.setState((prev) => {
            let nextMessage = [...prev.message, "Archivo cargado con exito: " + file.name];
            return {
              message: nextMessage
            };
          });
  
          return UploadService.getFiles(this.props.userId);
        })
        .then((files) => {
          this.setState({
            fileInfos: files.data,
          });
        })
        .catch(() => {
          _progressInfos[idx].percentage = 0;
          this.setState((prev) => {
            let nextMessage = [...prev.message, "No se pudo cargar el archivo: " + file.name];
            return {
              progressInfos: _progressInfos,
              message: nextMessage
            };
          });
        });
    };
    reader.readAsText(file);
  }

  componentDidMount() {
    UploadService.getFiles(this.props.userId).then((response) => {
      this.setState({
        fileInfos: response.data,
      });
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

    const { selectedFiles, progressInfos, message, fileInfos } = this.state;

    return (
      <div>
        {progressInfos &&
          progressInfos.map((progressInfo, index) => (
            <div className="mb-2" key={index}>
              <span>{progressInfo.fileName}</span>
              <div className="progress">
                <div
                  className="progress-bar progress-bar-info"
                  role="progressbar"
                  aria-valuenow={progressInfo.percentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{ width: progressInfo.percentage + "%" }}
                >
                  {progressInfo.percentage}%
                </div>
              </div>
            </div>
          ))}

        <div className="row my-3">
          <div className="col-8">
            <label className="btn btn-default p-0">
              <input type="file" multiple onChange={this.selectFiles} />
            </label>
          </div>

          <div className="col-4">
            <button
              className="btn btn-success btn-sm"
              disabled={!selectedFiles}
              onClick={this.uploadFiles}
            >
              Upload
            </button>
          </div>
        </div>

        {message.length > 0 && (
          <div className="alert alert-secondary" role="alert">
            <ul>
              {message.map((item, i) => {
                return <li key={i}>{item}</li>;
              })}
            </ul>
          </div>
        )}

        <div className="card">
          <div className="card-header">List of Files</div>
          <ul className="list-group list-group-flush">
            {fileInfos &&
              fileInfos.map((file, index) => (
                <li className="list-group-item" key={index}>
                  <a href={file.url}>{file.name}</a>
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }

}

export default Home;