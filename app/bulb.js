/**
 * Bulb object.
 */

class Bulb {
  /**
   * Receives the data from the Yeelight SSDP response
   */
  constructor(ipAddress, headers) {
    this.address = ipAddress;
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
}

export default Bulb;
