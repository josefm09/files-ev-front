import React, { Component } from 'react';
import UploadService from '../services/UploadFileService';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Card, CardContent, CardActions, Typography, Button, Box, Grid } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DescriptionIcon from '@material-ui/icons/Description';
import GetAppIcon from '@material-ui/icons/GetApp';
import Analysis from './Analysis';

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
      dataTable: []
    };

    this.selectFiles = this.selectFiles.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
  }

  selectFiles(event) {
    this.setState({
      progressInfos: [],
      selectedFiles: event.target.files,
    });
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
          if(selectedFiles[i].size > 0){
            this.upload(i, selectedFiles[i]);
          }else{
            alert("Favor de seleccionar un archivo que contenga texto (TXT)");
          }
        }
      }
    );

    UploadService.getAnalysis(this.props.userId).then((response) => {
      this.setState({
        dataTable: response.data
      });
    });

  }

  upload(idx, file) {
    let _progressInfos = [...this.state.progressInfos];
    const nombre = file.name;
    const reader = new FileReader();
    reader.onload = async (file) => { 
      const text = (file.target.result);
      let data = {
        fileText: text,
        name: nombre        
      }
      UploadService.upload(data, this.props.userId, (event) => {
        _progressInfos[idx].percentage = Math.round((100 * event.loaded) / event.total);
        this.setState({
          _progressInfos,
        });
      })
        .then((response) => {
          this.setState((prev) => {
            let nextMessage = [...prev.message, "Archivo cargado con exito: " + response.data.name];
            return {
              message: nextMessage
            };
          });
  
          return UploadService.getFiles(this.props.userId);
        })
        .then((files) => {
          this.setState({
            fileInfos: files.data
          });
        })
        .catch(() => {
          _progressInfos[idx].percentage = 0;
          this.setState((prev) => {
            let nextMessage = [...prev.message, "No se pudo cargar el archivo"];
            return {
              progressInfos: _progressInfos,
              message: nextMessage
            };
          });
        });
    };
    reader.readAsText(file);
  }

  downloadTxtFile(fileParam) {
    const element = document.createElement("a");
    const file = new Blob([fileParam.fileText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = fileParam.name;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  componentDidMount() {
    UploadService.getFiles(this.props.userId).then((response) => {
      this.setState({
        fileInfos: response.data,
      });
    });

    UploadService.getAnalysis(this.props.userId).then((response) => {
      this.setState({
        dataTable: response.data,
      });
    });
  }

  render = () => {

    const { selectedFiles, progressInfos, message, fileInfos } = this.state;
    
    const mystyle = {
      width: '100%',
      height: '600px'
    };
    return (
      <Box m={1} pt={1}>
        <Grid container justify="center">
          <Grid item md={4} >
            <Card style={mystyle}>
              <Typography variant="h6" gutterBottom>
                Analizador de comentarios
              </Typography>
              <CardContent style={{maxHeight: 475, overflow: 'auto'}}>
                
                  {progressInfos &&
                  progressInfos.map((progressInfo, index) => (
                    <Grid item key={index}>
                      <span>{progressInfo.fileName} {progressInfo.percentage}%</span>
                      <LinearProgress variant="determinate" value={progressInfo.percentage} />
                    </Grid>
                  ))}

                {message.length > 0 && (
                <List component="nav" aria-label="Listado notificaciones">
                  {message.map((item, i) => {
                    return <ListItem key={i}>
                            <ListItemIcon>
                              <DescriptionIcon />
                            </ListItemIcon>
                            <ListItemText primary={item} />
                          </ListItem>
                  })}
                </List>
                )}

                
                <Grid item>Lista de Archivos</Grid>
                <List component="nav" aria-label="Listado archivos" >
                  {fileInfos &&
                    fileInfos.map((file, index) => (
                      <ListItem button key={index} onClick={() => this.downloadTxtFile(file)} >
                        <ListItemIcon>
                          <GetAppIcon />
                        </ListItemIcon>
                        <ListItemText primary={file.name} />
                      </ListItem>
                    ))}
                </List>
                
              </CardContent>
              <CardActions>
                <Button color="secondary" component="label">
                  Subir archivo
                  <input  type="file" multiple accept=".txt,.log" onChange={this.selectFiles} hidden />
                </Button>
                <Button
                  color="primary"
                  disabled={!selectedFiles}
                  onClick={this.uploadFiles}
                >
                  Enviar comentario
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item md={8}>
            <Analysis dataTable={this.state.dataTable} />
          </Grid>
        </Grid>
      </Box>
    );
  }

}

export default Home;