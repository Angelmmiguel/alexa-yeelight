import { Client } from 'node-ssdp';
import { EventEmitter } from 'events';
import net from 'net';
import Bulb from './bulb';

class Yeelight extends EventEmitter {

  constructor() {
    super();

    // Cache IDs to send the correct event
    this.cacheBulbs = [];
    // SSDP Client
    this.client = new Client({
      ssdpPort: 1982,
    });

    // Listen SSDP events
    this.client.on('response', (headers, statusCode, rinfo) => {
      let newBulb = new Bulb(rinfo.address, headers);

      // When I launch the discover method, this listener will return 5 responses
      // so we need to store the elements we sent already
      if (this.cacheBulbs.indexOf(newBulb.get('id')) === -1) {
        // Add the new Bulb
        this.cacheBulbs.push(newBulb.get('id'));
        // Only emit for one element every time
        this.emit('bulb', newBulb);
      }
    });
  }

  // Requests all the bulbs on the network to send an SSDP announcement
  discover() {
    console.log('Discovering!');
    this.clearCache();
    this.client.search('wifi_bulb');
  }

  // Clear cache to prevent duplicated events
  clearCache() {
    this.cacheBulbs = [];
  }
}

export default Yeelight;
