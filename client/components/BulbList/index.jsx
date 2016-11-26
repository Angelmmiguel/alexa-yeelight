import React, { PropTypes } from 'react';

// Components
import Title from '../Title';
import Bulb from '../Bulb';

/**
 * Display a List with the current bulbs and their state
 */
class BulbList extends React.Component {
  /**
   * Props of the component
   */
  static propTypes = {
    socket: PropTypes.object.isRequired,
    bulbs: PropTypes.arrayOf(PropTypes.object)
  }

  get newBulbs() {
    return this.props.bulbs.filter(b => !b.initialized);
  }

  get storedBulbs() {
    return this.props.bulbs.filter(b => b.initialized);
  }

  /**
   * Render the BulbList component
   */
  render() {
    return <section>
      <Title>Bulbs</Title>
      <div>
        <h3>Discovered Bulbs</h3>
        { this.newBulbs.map(b =>
          <Bulb key={ b._id } bulb={ b } />
        )}
      </div>
      <div>
        <h3>Stored Bulbs</h3>
        { this.storedBulbs.map(b =>
          <Bulb key={ b._id } bulb={ b } />
        )}
      </div>
    </section>;
  }
}

// Export the class
export default BulbList;
