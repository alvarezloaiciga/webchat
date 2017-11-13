/**
* The SDK for creating Quiq Messaging add-ins
*/
(function() {
const Quiq = {};
const eventHandlers = {};

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
