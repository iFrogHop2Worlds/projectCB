import React, { Component } from 'react';

import HelloWorld from './components/hello-world';
import AllureTrendingArticles from './components/AllureTrendingArticles';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <HelloWorld title="Hello MetaDeck" />
        <AllureTrendingArticles />
      </div>
    );
  }
}

export default App;
