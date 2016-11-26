const Client = require('node-ssdp').Client;
const EventEmitter = require('events').EventEmitter;
const net = require('net');

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
      // TODO: MOVE TO A CLASS!!!
      let newBulb = {
        id: headers.ID,
        name: headers.NAME,
        model: headers.MODEL,
        fwVersion: headers.FW_VER,
        location: headers.LOCATION,
        support: headers.SUPPORT,
        ipAddress: rinfo.address,
        power: headers.POWER,
        brightness: headers.BRIGHT,
        colorMode: headers.COLOR_MODE,
        colorRGB: headers.RGB,
        colorHue: headers.HUE,
        colorSat: headers.SAT,
      };

      // When I launch the discover method, this listener will return 5 responses
      // so we need to store the elements we sent already
      if (this.cacheBulbs.indexOf(newBulb.id) === -1) {
        // Add the new Bulb
        this.cacheBulbs.push(newBulb.id);
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
