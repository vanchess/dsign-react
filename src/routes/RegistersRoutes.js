import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';

import { PrivateRoute } from '../_components';

import Dashboard  from '../dashboard/Dashboard.js'
import RegisterNewMessage  from  '../components/Registers/RegisterNewMessage.js'
import RegisterShowMessage from  '../components/Registers/RegisterShowMessage.js'
import RegisterInMessage   from  '../components/Registers/RegisterInMessage.js'
import RegisterInRejected  from  '../components/Registers/RegisterInRejected.js' 
import RegisterIn from  '../components/Registers/RegisterIn.js' 



class Routes extends React.Component {

    render(){
      let path = this.props.match.path;
      return (
            <Switch>
              <Route exact path={`${path}`} >
                <Redirect to={`${path}/list/reg`} />
              </Route>
              <PrivateRoute path={`${path}/msg/:type/new`} component={RegisterNewMessage} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/msg/:type/rejected`}  component={RegisterInRejected}  handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/msg/:type/:id`}  component={RegisterShowMessage}  handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/msg/:type`}  component={RegisterInMessage}  handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              
              <PrivateRoute path={`${path}/list/:type/:id`} component={RegisterIn} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/list/:type`} component={RegisterIn} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              
              <PrivateRoute component={Dashboard} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
            </Switch>
      );
    }
}

export default withRouter(Routes);
