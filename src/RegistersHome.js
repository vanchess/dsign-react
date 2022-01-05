import React from 'react';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import MailIcon from '@material-ui/icons/Mail';
import LabelImportantIcon from '@material-ui/icons/LabelImportant';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';

import RegistersRoutes from './routes/RegistersRoutes';
import Home from './Home';

class RegistersHome extends React.Component {
  
  constructor(props) {
      super(props);
      
      this.state ={title: 'Счета', snackbarOpen: true}
      
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
    
    let actions = [];
    
    let sidebarMainListItems = [];
    
    if(this.props.permission) {
        if (this.props.permission.includes('send reg')) {
            actions.push({'key':1, 'title':'Отправить реестры','tooltip':'Создать новое сообщение для отправки реестров','to':`${path}msg/reg/new`});
        }
        
        /*sidebarMainListItems.push({'key':1, 'title':'Реестры',       'to':`${path}msg/reg`, 'tooltip':'Реестры', 'icon': <MailIcon />});*/
        sidebarMainListItems.push({'key':2, 'title':'Реестры',    'to':`${path}list/reg`,   'tooltip':'Реестры', 'icon': <MailIcon />});
        /*sidebarMainListItems.push({'key':4, 'title':'Отклонено',   'to':`${path}msg/reg/rejected`, 'tooltip':'Отклоненные реестры', 'icon': <ThumbDownAltOutlinedIcon />});*/
        
    }

    
    return (  
      <Home 
          path={path}
          title={this.state.title}
          main={<RegistersRoutes handleSetTitle={(title) => this.handleSetTitle(title)}/>}
          sidebarMainListItems={sidebarMainListItems}
          actions={actions}
      />
    );
  }
}


const mapStateToProps = function(store) {
  console.log(store);
  return {
        permission: store.authReducer.user.permissions,
    };
}
const mapDispatchToProps = dispatch => {
  return {
    /*
    fetchMyFiles: (page, perPage) => {
        dispatch(myFileFetch(page, perPage));
    },*/
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(RegistersHome);
