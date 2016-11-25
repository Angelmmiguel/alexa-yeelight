import React from 'react';

// Components
import MyTitle from '../components/MyTitle';

class AppContainer extends React.Component {
  // Layout
  render() {
    return <section className="App">
      <MyTitle title="Yeelight" />
    </section>;
  }
}

export default AppContainer;
