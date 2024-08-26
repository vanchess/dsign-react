import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';

import { PrivateRoute } from '../_components';

import AgreementIn from  '../components/Agreements/AgreementIn.js' 
import AgreementNewMessage from  '../components/Agreements/AgreementNewMessage.js' 

class Routes extends React.Component {

    render(){
      let path = this.props.match.path;
      return (
            <Switch>
              <Route exact path={`${path}`} >
                <Redirect to={`${path}/list/agreement-fin`} />
              </Route>
              <PrivateRoute path={`${path}/msg/:type/new`} component={AgreementNewMessage} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/list/:type/:id`} component={AgreementIn} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/list/:type`} component={AgreementIn} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
            </Switch>
      );
    }
}

export default withRouter(Routes);
