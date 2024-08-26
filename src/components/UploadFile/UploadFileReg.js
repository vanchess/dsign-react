import React from 'react';

import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { fileService } from '../../services';
import { styled } from '@mui/material';
import { ButtonCircularProgress } from './ButtonCircularProgress';

const Wrapper = styled('div')(({theme}) => ({
    margin: theme.spacing(1),
    position: 'relative',
}))

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

    this.setState({
        uploading: true
      });
    fileService.upload(this.state.file).then(
        result => {
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
  }

  render() {
    const { classes } = this.props;
    


    return (
      <div>
        <form onSubmit={(e)=>this._handleSubmit(e)}>
          <div style={{display: 'flex', alignItems: 'center',}}>
            <Wrapper>
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
            </Wrapper>
            {this.state.fileName}
            <Wrapper>
              <Button 
                variant="contained"
                color="primary"
                type="submit" 
                disabled={!this.state.file || this.state.uploading || this.state.disabled}
                startIcon={<CloudUploadIcon />}
                onClick={(e)=>this._handleSubmit(e)}>Загрузить</Button>
              {this.state.uploading && <ButtonCircularProgress size={24} />}
            </Wrapper>
          </div>
        </form>

      </div>
    )
  }
}

export default UploadFile;