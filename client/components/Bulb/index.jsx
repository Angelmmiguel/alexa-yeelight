import React, { PropTypes } from 'react';

/**
 * Represent a bulb in the UI. Allow user to make changes to the Bulb
 */
class Bulb extends React.Component {
  /**
   * Props of the component
   */
  static propTypes = {
    bulb: PropTypes.object.isRequired
  }

  get bulb() {
    return this.props.bulb;
  }

  /**
   * Render the Bulb component
   */
  render() {
    return <article className="br2 ba dark-gray b--black-10 mv2 w-100 cf">
      <div className="pa2 b--black-10 bb cf">
        <div className="fl w-30">
          <span className="black-40">Alexa Name:</span> { this.bulb.alexaName }
        </div>
        <div className="fl w-70 tr v-mid">
          <span className="mr3"><span className="black-30">Power:</span> { this.bulb.power }</span>
          <span className="mr3"><span className="black-30">RGB:</span> { this.bulb.colorRGB }</span>
          <span className="mr3"><span className="black-30">Brightness:</span> { this.bulb.brightness }</span>
        </div>
      </div>
      <div className="fl br b--black-10 w-50 pv2 ph3">
        <ul className="list pa0 ma0">
          <li className="cf pa1">
            <div className="fl w-30 black-30">Name:</div>
            <div className="fl w-70"> { this.bulb.name || 'Non defined' }</div>
          </li>
          <li className="cf pa1">
            <div className="fl w-30 black-30">Model:</div>
            <div className="fl w-70"> { this.bulb.model }</div>
          </li>
        </ul>
      </div>
      <div className="fl w-50 pv2 ph3">
        <ul className="list pa0 ma0">
          <li className="cf pa1">
            <div className="fl w-30 black-30">HUE:</div>
            <div className="fl w-70"> { this.bulb.colorHue }</div>
          </li>
          <li className="cf pa1">
            <div className="fl w-30 black-30">Saturation:</div>
            <div className="fl w-70"> { this.bulb.colorSat }</div>
          </li>
        </ul>
      </div>
    </article>
  }
}

// Export the class
export default Bulb;
