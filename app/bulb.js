import net from 'net';

/**
 * Bulb.
 */
class Bulb {
  /**
   * Receives the data from the Yeelight SSDP response
   */
  constructor(ipAddress, headers) {
    this.ipAddress = ipAddress;
    // Connect and pause
    this.client = new net.Socket();

    // Store the data
    this.data = {
      id: headers.ID,
      ipAddress,
      name: headers.NAME,
      model: headers.MODEL,
      fwVersion: headers.FW_VER,
      location: headers.LOCATION,
      support: headers.SUPPORT,
      power: headers.POWER,
      brightness: headers.BRIGHT,
      colorMode: headers.COLOR_MODE,
      colorRGB: headers.RGB,
      colorHue: headers.HUE,
      colorSat: headers.SAT
    }
  }

  // Get a property
  get = prop => {
    return this.data[prop];
  }

  // Serialize this class into an object.
  serialize = () => {
    return this.data;
  }

  // Get a property of the Bulb
  getProp = (values = []) => {
    this._request('get_prop', values);
  }

  setBright = (value, effect = 'smooth', duration = 500) => {
    this._request('set_bright', [value, effect, duration]);
  }

  setRgb = (rgb, effect = 'smooth', duration = 500) => {
    this._request('set_rgb', [rgb, effect, duration]);
  }

  setHsv = (hue, sat, effect = 'smooth', duration = 500) => {
    this._request('set_hsv', [hue, sat, effect, duration]);
  }

  setCtAbx = (ctValue, effect = 'smooth', duration = 500) => {
    this._request('set_ct_abx', [ctValue, effect, duration]);
  }

  setPower = (power, effect = 'smooth', duration = 500) => {
    this._request('set_power', [power, effect, duration]);
  }

  off = () => {
    this.setPower('off');
  }

  on = () => {
    this.setPower('on');
  }

  toggle = () => {
    this._request('toggle', []);
  }

  setDefault = () => {
    this._request('set_default', []);
  }

  setName = (name) => {
    this._request('set_name', [name]);
  }

  // Send a request to the bulb
  _request = (method, params = []) => {
    // Build the request
    let request = JSON.stringify({
      id: this.data.id,
      method,
      params
    });

    // Send to the server
    this.client.connect(55443, this.ipAddress, () => {
      this.client.end(request);
    });

    this.client.on('data', (res) => {
      let data;

      try {
        data = JSON.parse(res);
        console.log(data);
      } catch(err) {
        console.error('JSON Error: ' + err);
      }

      if (data && data.error) {
        console.error(data.error);
      }

      this.client.destroy();
    });

    this.client.on('close', (had_error) => {
      console.log('close');
      if (had_error) {
        console.error(`Error closing the socket to ${this.ipAddress}`);
      }
    })
  }
}

export default Bulb;
