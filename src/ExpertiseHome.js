import React from 'react';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import MailIcon from '@material-ui/icons/Mail';
import LabelImportantIcon from '@material-ui/icons/LabelImportant';

import ExpertiseRoutes  from './routes/ExpertiseRoutes';
import Home from './Home';

class ExpertiseHome extends React.Component {
  constructor(props) {
      super(props);
      
      this.state ={title: 'Экспертиза', snackbarOpen: true}
      
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
    if (this.props.permission) {
        if(this.props.permission.includes('send mek')){
            actions.push({'key':1, 'title':'Отправка актов МЭК', 'tooltip':'Создать новое сообщение для актов МЭК', 'to':`${path}msg/mek/new`});
        }
        if(this.props.permission.includes('send mee')){
            actions.push({'key':2, 'title':'Отправка актов МЭЭ', 'tooltip':'Создать новое сообщение для актов МЭЭ', 'to':`${path}msg/mee/new`});
        }
    }
    let sidebarMainListItems = [
        {'key':1, 'title':'МЭК', 'to':`${path}msg/mek`, 'tooltip':'Акты МЭК', 'icon': <MailIcon />},
        {'key':2, 'title':'МЭЭ', 'to':`${path}msg/mee`, 'tooltip':'Акты МЭЭ', 'icon': <MailIcon />},
    ];
    
    return (  
      <Home 
          title={this.state.title}
          main={<ExpertiseRoutes handleSetTitle={(title) => this.handleSetTitle(title)}/>}
          sidebarMainListItems={sidebarMainListItems}
          snackbar={null}
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

export default connect(mapStateToProps,mapDispatchToProps)(ExpertiseHome);
