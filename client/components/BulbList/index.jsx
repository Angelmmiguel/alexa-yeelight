import React, { PropTypes } from 'react';

// Components
import Title from '../Title';

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
      <h3>Discovered Bulbs</h3>
      <ul>
        { this.newBulbs.map(b =>
          <li key={ b._id }>{ b.alexaName }</li>
        )}
      </ul>
      <h3>Stored Bulbs</h3>
      <ul>
        { this.storedBulbs.map(b =>
          <li key={ b._id }>{ b.alexaName }</li>
        )}
      </ul>
    </section>;
  }
}

// Export the class
export default BulbList;
