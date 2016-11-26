// Database
import Datastore from 'nedb';

// Constants
const BULBS_DATABASE = './db/bulbs.db';
const LOG_DATABASE = './db/log.db';


export const loadDatabase = () => {
  let bulbs = new Datastore({ filename: BULBS_DATABASE, autoload: true });
  bulbs.persistence.setAutocompactionInterval(60000);

  return {
    bulbs: bulbs,
    log: new Datastore({ filename: LOG_DATABASE, autoload: true })
  }
}
