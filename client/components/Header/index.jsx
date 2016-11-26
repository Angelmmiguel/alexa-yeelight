import React from 'react';

// Components
import { IndexLink, Link } from 'react-router';

/**
 * Header of the application.
 */
class Header extends React.PureComponent {
  /**
   * Render the Header component
   */
  render() {
    return <header className="w-100 pa3 ph5-ns bg-white">
      <div className="dt mw9 center w-100">
        <div className="dtc v-mid tl w-50">
          <IndexLink to="/" className="dib f5 f4-ns fw6 mt0 mb1 link dark-green dim" title="Home">
            Alexa Yeelight <div className="dib">
              <small className="nowrap f6 mt2 mt3-ns pr2 green fw2"> v1.0.0</small>
            </div>
          </IndexLink>
        </div>
        <nav className="db dtc v-mid w-100 tr">
          <Link title="Alexa configuration" to="/config"
            className="f6 fw6 dim link black-70 mr1 mr3-m mr4-l dn dib-l">
            Alexa Config
          </Link>
          <Link title="Logs" to="/logs"
            className="f6 fw6 dim link black-70 mr1 mr3-m mr4-l dn dib-l">
            Logs
          </Link>
          <a title="Alexa Yeelight on GitHub" href="https://github.com/Angelmmiguel/alexa-yeelight"
            className="f6 fw6 dim link black-70 mr1 mr3-m mr4-l dn dib-l">
            GitHub
          </a>
        </nav>
      </div>
    </header>
  }
}

// Export the class
export default Header;
