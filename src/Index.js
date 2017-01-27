import React, { Component } from 'react';
import { Provider } from 'react-redux';

import store from './store';

import MarketData from './components/MarketData';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MarketData />
      </Provider>
    );
  }
}
