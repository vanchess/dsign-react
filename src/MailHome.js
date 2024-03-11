import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import MailIcon from '@mui/icons-material/Mail';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';

import MailRoutes  from './routes/MailRoutes';
import Home from './Home';

class MailHome extends React.Component {
  constructor(props) {
      super(props);
      
      this.state ={title: 'Почта', snackbarOpen: true}
      
      this.handleClose = this.handleClose.bind(this);
      this.handleSetTitle = this.handleSetTitle.bind(this);
  }
  
  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({snackbarOpen: false});
  };
  
  handleSetTitle(t){
      this.setState({title: t});
  }
  
  render(){
    let path = this.props.match.path;    
    if( !path.endsWith('/') ) {
          path += '/';
    }
    let actions = [{'key':1, 'title':'Новое сообщение','tooltip':'Создать новое сообщение','to':`${path}msg/new`}];
    let sidebarMainListItems = [
        {'key':1, 'title':'Входящие',   'to':`${path}msg/in`, 'tooltip':'Входящие сообщения', 'icon': <MailIcon />},
        {'key':2, 'title':'Отправлено', 'to':`${path}msg/out`, 'tooltip':'Отправленные сообщения', 'icon': <LabelImportantIcon />},
    ];
    
    return (  
      <Home 
          path={path}
          title={this.state.title}
          main={<MailRoutes handleSetTitle={(title) => this.handleSetTitle(title)}/>}
          sidebarMainListItems={sidebarMainListItems}
          snackbar={null}
          actions={actions}
      />
    );
  }
}

export default MailHome;
