// Database
import Datastore from 'nedb';

// Constants
const BULBS_DATABASE = './db/bulbs.db';

export const loadDatabase = () => {
  return new Datastore({ filename: BULBS_DATABASE, autoload: true });
}
