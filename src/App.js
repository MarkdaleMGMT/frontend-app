import React, { useEffect } from 'react';
//import ReactDOM from "react-dom";
import { Route, Switch, Redirect } from "react-router-dom";
import { SignIn, SignUp, ForgotPassword, Dashboard, Affiliates, Investment, Stats, Exchange, PasswordReset, Contact, Payments } from './pages';
import sessionTimeout from './HOC/sessionTimeout'
import dashboardTemplate from './pages/DashboardPageTemplate/DashboardPageTemplate'
import './App.scss';
import { domain } from './config'


          // <Route path="/affiliate" component={sessionTimeout(Dashboard)}/>
          // <Route path="/stats" component={sessionTimeout(Dashboard)}/>
          // <Route path="/exchange" component={sessionTimeout(Dashboard)}/>
          // <Route path="/contact" component={sessionTimeout(Dashboard)}/>
          // <Route path="/investment/:id" component={sessionTimeout(Dashboard)}/>

function App() {

  useEffect(() => {
    document.title = domain
  },[]);

  return (

    <div className="App">
        <Switch>
          <Route path="/login" component={SignIn}/>
          <Route path="/signup" component={SignUp}/>
          <Route path="/forgot" component={ForgotPassword}/>
          <Route path="/resetPassword" component={PasswordReset}/>
          <Route path="/dashboard" component={sessionTimeout(dashboardTemplate(Dashboard))}/>
          <Route path="/affiliate" component={sessionTimeout(dashboardTemplate(Affiliates))}/>
          <Route path="/investment/:investment_id" component={sessionTimeout(Investment)}/>
          <Route path="/stats" component={dashboardTemplate(Stats)}/>
          <Route path="/exchange" component={sessionTimeout(dashboardTemplate(Exchange))}/>
          <Route path="/contact" component={sessionTimeout(dashboardTemplate(Contact))}/>
          <Route path="/payments" component={sessionTimeout(Payments)}/>

          <Route render={ props => <Redirect to={{ pathname: '/login', state: { from: props.location } }} /> } />
        </Switch>
    </div>

  );
}

export default App;
