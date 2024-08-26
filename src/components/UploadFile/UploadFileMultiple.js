import React from 'react';

import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { fileService } from '../../services';
import { styled } from '@mui/material';
import { ButtonCircularProgress } from './ButtonCircularProgress';

const DivWrapper = styled('div')(({theme}) => ({
  margin: theme.spacing(1),
  position: 'relative',
}));


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

    this.setState({
        uploading: true
      });
    fileService.uploadMultiple(this.state.attachment).then(
        result => {
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
    
  }

  render() {

    return (
      <div>
        <form onSubmit={(e)=>this._handleSubmit(e)}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <DivWrapper>
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
            </DivWrapper>
            {this.state.fileName}
            <DivWrapper>
              <Button 
                variant="contained"
                color="primary"
                type="submit" 
                disabled={!this.state.attachment.length || this.state.uploading}
                startIcon={<CloudUploadIcon />}
                onClick={(e)=>this._handleSubmit(e)}>Загрузить</Button>
              {this.state.uploading && <ButtonCircularProgress size={24} />}
            </DivWrapper>
          </div>
        </form>

      </div>
    )
  }
}

export default UploadFileMultiple;