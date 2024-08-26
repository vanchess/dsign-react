import React from 'react';

import Button from '@mui/material/Button';
import { ButtonCircularProgress } from './ButtonCircularProgress';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { fileService } from '../../services';
import { css, styled } from '@mui/material';

const Warper = styled('div')(({theme}) => css`
    margin: ${theme.spacing(1)};
    position: 'relative';
`);

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
    
    let regName = new RegExp('^.*(odt|ods|odp|csv|txt|xlx|xls|pdf|doc|docx|xlsx|xml|ppt)$','gi');
    if (!regName.test(file.name)) {
        alert('Недопустимый формат файла! Допустивые форматы: odt,ods,odp,csv,txt,xlx,xls,pdf,doc,docx,xlsx,xml,ppt');
        return;
    }

    this.setState({
        file: file,
        fileName: file.name
      });
  }

  render() {

    return (
      <div>
        <form onSubmit={(e)=>this._handleSubmit(e)}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Warper>
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
            </Warper>
            {this.state.fileName}
            <Warper>
              <Button 
                variant="contained"
                color="primary"
                type="submit" 
                disabled={!this.state.file || this.state.uploading || this.state.disabled}
                startIcon={<CloudUploadIcon />}
                onClick={(e)=>this._handleSubmit(e)}>Загрузить</Button>
              {this.state.uploading && <ButtonCircularProgress size={24} />}
            </Warper>
          </div>
        </form>

      </div>
    )
  }
}

export default UploadFile;