import React from 'react';

import withStyles from '@mui/styles/withStyles';
import { green } from '@mui/material/colors';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { fileService } from '../../services';

const styles = theme => ({
   root: {
    display: 'flex',
    alignItems: 'center',
  },
   wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
   buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
})

class UploadFileMultiple extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        attachment: [],
        uploading: false,
        fileName: 'Файл не выбран'
    };
  }

  _handleSubmit(e) {
    e.preventDefault();

    console.log('handle uploading-', this.state.attachment);
    this.setState({
        uploading: true
      });
    fileService.uploadMultiple(this.state.attachment).then(
        result => {
            console.log(result);
            this.setState({
                attachment: [],
                uploading: false,
                fileName: 'Файл успешно загружен'
              });
            this.props.onUploadFile(result.data);
        },
        error => {
            console.log(error);
            this.setState({
                uploading: false
              });
        }
      );
  }

  _handleChange(e) {
    e.preventDefault();

    let len = e.target.files.length;
    if (len < 1) {
        return;
    }
    
    let attachment = [];
    let fileName = [];
    for (let i = 0; i < len; i++) {
        attachment.push(e.target.files[i]);
        fileName.push(e.target.files[i].name);
    }

    this.setState({
        attachment: attachment,
        fileName: fileName.join(', ')
      });
    
    // reader.onloadend = () => { }
    // reader.readAsDataURL(file)
  }

  render() {
    const { classes } = this.props;
    


    return (
      <div>
        <form onSubmit={(e)=>this._handleSubmit(e)}>
          <div className={classes.root}>
            <div className={classes.wrapper}>
            <Button
              disabled={ this.state.uploading }
              variant="contained"
              component="label"
            >
              Выбрать файл
              <input
                type="file"
                multiple
                onChange={(e)=>this._handleChange(e)}
                hidden
              />
            </Button>
            </div>
            {this.state.fileName}
            <div className={classes.wrapper}>
              <Button 
                variant="contained"
                color="primary"
                type="submit" 
                disabled={!this.state.attachment.length || this.state.uploading}
                startIcon={<CloudUploadIcon />}
                onClick={(e)=>this._handleSubmit(e)}>Загрузить</Button>
              {this.state.uploading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
          </div>
        </form>

      </div>
    )
  }
}

export default withStyles(styles)(UploadFileMultiple);