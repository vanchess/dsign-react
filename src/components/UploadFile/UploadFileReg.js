import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

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

class UploadFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        file: '',
        uploading: false,
        fileName: 'Файл не выбран',
        disabled: false
    };
  }

  _handleSubmit(e) {
    e.preventDefault();

    console.log('handle uploading-', this.state.file);
    this.setState({
        uploading: true
      });
    fileService.upload(this.state.file).then(
        result => {
            console.log(result);
            this.setState({
                file: '',
                uploading: false,
                disabled: true,
                fileName: 'Файл успешно загружен'
              });
            this.props.onUploadFile(result);
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

    // let reader = new FileReader();

    
    let file = e.target.files[0];
    
    if (!file) {
        return;
    }
    
    let regName = new RegExp('^([R]?)([B|H|T|D])([M]45[0-9]{4})([S|T][0-9]{2,5})_([0-9]{4})([12347]{1})([0-9]{1,2}).(zip|ZIP)$');
    if (!regName.test(file.name)) {
        alert('Имя файла не соответствует шаблону');
        return;
    }

    this.setState({
        file: file,
        fileName: file.name
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
              disabled={ this.state.uploading || this.state.disabled }
              variant="contained"
              component="label"
            >
              Выбрать файл
              <input
                type="file"
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
                disabled={!this.state.file || this.state.uploading || this.state.disabled}
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

export default withStyles(styles)(UploadFile);