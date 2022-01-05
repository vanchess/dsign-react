import React from 'react';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import MailIcon from '@material-ui/icons/Mail';
import LabelImportantIcon from '@material-ui/icons/LabelImportant';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';

import AgreementsRoutes from './routes/AgreementsRoutes';
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
        if (this.props.permission.includes('send agreement-fin')) {
            actions.push({'key':1, 'title':'Новое соглашение','tooltip':'Загрузить соглашение для подписания','to':`${path}msg/agreement-fin/new`});
        }
        if (this.props.permission.includes('send contract-payment-oms')) {
            actions.push({'key':2, 'title':'Новый договор','tooltip':'Загрузить договор на оказание и оплату медицинской помощи по ОМС','to':`${path}msg/contract-payment-oms/new`});
        }
        
        sidebarMainListItems.push({'key':3, 'title':'Соглашения',    'to':`${path}list/agreement-fin`,   'tooltip':'Соглашения', 'icon': <MailIcon />});
        sidebarMainListItems.push({'key':4, 'title':'Договоры оплаты МП по ОМС',    'to':`${path}list/contract-payment-oms`,   'tooltip':'Договоры на оказание и оплату медицинской помощи по ОМС', 'icon': <MailIcon />}); 
    }

    
    return (  
      <Home 
          path={path}
          title={this.state.title}
          main={<AgreementsRoutes handleSetTitle={(title) => this.handleSetTitle(title)}/>}
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
