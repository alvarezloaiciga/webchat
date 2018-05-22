/**
 * Webchat supports a custom wait screen be provided via an IFrame hosted on your own servers. 
 * This allows you to show custom content while a user is waiting to be connected to an available agent.
 * Using the Extension SDK, your IFrame page can register for events from Webchat including changes in estimated wait time and new messages.
 * Custom screens can be defined in the [customScreens](/types?id=Options) property on the Quiq options object. 
   To load the Extension SDK on your IFrame page, reference it in a script tag:
   ```javascript
   <script type="text/javascript" src="https://<tenant>.goquiq.com/app/webchat/extensionSdk.js"></script>
   ```
   Replace `<tenant>` with the name fo your Quiq tenant.

   By default users will be able to drag and drop files and images into the extension, which may or may not be desirable. To prevent 
   drag and dropping in to the extension, please put the following code (or something similar) in a script tag:

  ```javascript
  // identify the iframe element
  var frameElem = document.getElementById('body');

  frameElem.contentWindow.addEventListener('dragover', function(e){
    e.preventDefault();
    e.stopPropagation();
  }, false);
  ```
 
   You can now access the Extension SDK via `window.Quiq`. The following methods are available off of this object:
 */
(function ExtensionSDK() {
  const Quiq = {};
  const eventHandlers = {};

  /**
   * Using the `on()` function, you can have the SDK call your `handler` function when a given event occurs.
   * `handler` will be called with a single `event` argument.
   * See the table below for supported events and the corresponding fields in the `event` object.
   * <table>
   *   <tr>
   *     <th>Event</th>
   *     <th>`event` object fields</th>
   *   </tr>
   *   <tr>
   *     <td>estimatedWaitTimeChanged</td>
   *     <td>`estimatedWaitTime: ?number` (milliseconds - if `undefined` then no wait time is available)</td>
   *   </tr>
   *   <tr>
   *     <td>transcriptChanged</td>
   *     <td>
   *       `messages: Array<{
   *          authorType: 'User' | 'Customer',
   *          text: string,
   *          id: string,
   *          timestamp: string,
   *          type: 'Text
   *       }
   *       |
   *       {
   *          authorType: AuthorType,
   *          url: string,
   *          id: string,
   *          contentType: string,
   *          timestamp: number,
   *          type: 'Attachment'
   *       }>`
   *       (`messages` is an array of Text or Attachment messages)
   *     </td>
   *   </tr>
   * </table>
   * @param {string} eventName - The name of the event you'd like to subscribe to. See the above table for possible values.
   * @param {Function} handler - A function that will be called when the given event occurs.
   * The function will be called with a single `Object` containing data about the event that just occurred. See the above table for specific fields for the exact structure of this object for a given event type.
   * @example
   * // Respond to a change in estimated wait time
   * Quiq.on('estimatedWaitTimeChanged', function (e) {
   *    console.log("The customer should be connected with an agent in " + e.estimatedWaitTime + " milliseconds.");
   * });
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
})();
