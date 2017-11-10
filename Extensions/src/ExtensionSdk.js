/**
* The SDK for creating Quiq Messaging add-ins
*/
(function() {
const Quiq = {};
// TODO: Figure out how to get this dynamically
let centricientHost;
const eventHandlers = {};

/**
 * Initializes the extension for the centricient host it runs on
 * @param {string} host - The base url for the site (i.e. https://dundermifflin.centricient.com)
 */
Quiq.init = function(host) {
  if (!host) {
    throw new Error('Init needs to be called with the hostname of the site that will run ')
  }
  centricientHost = host;
};

/**
 * Subscribe the event handler for the given event
 * @param {string} eventName
 * @param {function} handler
 */
Quiq.on = function(eventName, handler) {
  eventHandlers[eventName] = eventHandlers[eventName] || [];
  eventHandlers[eventName].push(handler);
};

function handleEvent(event) {
  const eventType = event.data.eventType;
  const data = event.data.data;

  const handlers = eventHandlers[eventType];
  if (handlers) {
    handlers.forEach(function(handler) {
      handler(data);
    });
  }
}

window.addEventListener('message', handleEvent, false);

// Export to global namespace. This feels yucky
window.Quiq = Quiq;
})()
