import React from 'react';

// Components
import Header from '../components/Header';
import BulbList from '../components/BulbList';

// Socket client
import * as io from 'socket.io-client'

class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io.connect();

    this.state = {
      bulbs: []
    }
  }

  componentWillMount() {
    fetch('/api/bulbs')
      .then(res => {
        return res.json().then(json => {
          return Promise.resolve({
            body: json,
            status: res.status,
            error: (res.status < 200 || res.status >= 300)
          })
        });
      })
      .then(res => {
        this.setState({ bulbs: res.body.items });
      })
  }

  // Layout
  render() {
    return <section className="App">
      <Header />
      <main className="w-100 pa3 ph5-ns bg-white">
        { this.props.children || <BulbList socket={ this.socket } bulbs={ this.state.bulbs } /> }
      </main>
    </section>;
  }
}

export default AppContainer;
