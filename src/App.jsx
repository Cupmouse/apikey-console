import React, { Component } from 'react';
import { Container, Grid } from 'semantic-ui-react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import SideMenu from './component/SideMenu';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import APIKeys from './views/APIKeys';
import NotFound from './views/NotFound';
import APIKeyTickets from './views/APIKeyTickets';
import { STRIPE_TOKEN } from './constants';

const stripePromise = loadStripe(STRIPE_TOKEN);

export default class App extends Component {
  render() {
    const customerKeyStr = localStorage.getItem('customerKey');
    const customerKey = BigNumber(customerKeyStr);

    return (
      <BrowserRouter>
        <Elements stripe={stripePromise}>
          <Container style={{ paddingTop: '1em' }}>
            <Switch>
              <Route exact path="/" component={Login} />
              <Route path="*">
                <Grid columns={2}>
                  <Grid.Column width={4}>
                    <SideMenu />
                  </Grid.Column>
                  <Grid.Column width={12}>
                    <Switch>
                      <Route path="/dashboard">
                        <Dashboard customerKey={customerKey} />
                      </Route>
                      <Route path="/apikeys">
                        <APIKeys customerKey={customerKey} />
                      </Route>
                      <Route path="/apikey/:apikey" component={APIKeyTickets} />
                      <Route path="/settings">
                        <APIKeys customerKey={customerKey} />
                      </Route>
                      <Route component={NotFound} />
                    </Switch>
                  </Grid.Column>
                </Grid>
              </Route>
            </Switch>
          </Container>
        </Elements>
      </BrowserRouter>
    );
  }
}
