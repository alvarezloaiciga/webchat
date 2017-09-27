var fs = require('fs');
var os = require('os');

var tenantOverride;

function getServiceOverrideFile() {
  var home = os.homedir();
  var serviceFile = home + "/.centricient/service-override.json";
  return serviceFile;
}

function fileExists(file) {
  try {
    fs.accessSync(file, fs.F_OK);
    return true;
  } catch (e) {
    /* eslint-disable no-console */
    console.log("Could not access file at " + file + ". Falling back to default values.");
    return false;
  }
}

function readServiceOverrideSettings() {
  var settings = {};
  var overrideFile = getServiceOverrideFile();
  if (overrideFile && fileExists(overrideFile)) {
    console.log("Loading service locations from file " + overrideFile);
    var services = require(overrideFile);
    services.forEach(function(service) {
      var hostname = service.address || "quiq.dev";
      settings[service.name] = "https://" + tenantOverride + "." + hostname + ":" + service.port;
      //console.log("Service " + service.name + " is located at " + settings[service.name]);
    });
  }
  return settings;
}

module.exports = function(tenant) {
  tenantOverride = tenant;
  return {
    readLocalSettings: readServiceOverrideSettings
  };
};
