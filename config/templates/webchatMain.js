var quiqWebchatScript;

function bootstrap(quiqOptions) {
  // We need to remove message event listener at this point, since Webchat will have its own postRobot listener
  window.removeEventListener('message', handleMessage);

  localStorage.setItem('quiqOptions', JSON.stringify(quiqOptions));

  if (!quiqWebchatScript) {
    quiqWebchatScript = document.createElement('script');
    quiqWebchatScript.src = window.webChatSrc;
    quiqWebchatScript.async = false;
    document.getElementsByTagName('body')[0].appendChild(quiqWebchatScript);
  }
}

// Bootstrapping: Listen for handshake message from parent window containing quiqOptions object
function handleMessage(event) {
  var parentUrl = (window.location !== window.parent.location)
    ? document.referrer
    : document.location.href;
  var originMatches = event.origin.indexOf(parentUrl) !== -1 || parentUrl.indexOf(event.origin) !== -1;
  var isHandshake = event.data.name && event.data.name === 'handshake';
  var containsQuiqObject = event.data && "quiqOptions" in event.data;
  if (originMatches && isHandshake && containsQuiqObject) {
    bootstrap(event.data.quiqOptions);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    try {
      pageSetup();
    } catch (e) {
      displayError(`Quiq: error bootstrapping webchat: ${e}`);
    }
  });
} else {
  // document.readyState === 'interactive' | 'loaded'
  pageSetup();
}

function pageSetup() {
  var headTag = document.getElementsByTagName('head')[0];

  var bodyTag = document.getElementsByTagName('body')[0];
  bodyTag.style.cssText="margin:0";

  var metaHttpEquiv = document.createElement('meta');
  metaHttpEquiv.httpEquiv="X-UA-Compatible";
  metaHttpEquiv.content="IE-edge";
  headTag.append(metaHttpEquiv);

  var metaCharset = document.createElement('meta');
  metaCharset.charset="utf-8";
  headTag.append(metaCharset);

  document.title = "Quiq Webchat";

  var metaAppName = document.createElement('meta');
  metaAppName.name="application-name";
  metaAppName.content="Quiq Chat";
  headTag.append(metaAppName);

  var metaTileColor = document.createElement('meta');
  metaTileColor.name="msapplication-TileColor";
  metaTileColor.content="#";
  headTag.append(metaTileColor);

  var fontawesomeScript = document.createElement('script');
  fontawesomeScript.src="https://use.fontawesome.com/89da14f4b6.js";
  headTag.append(fontawesomeScript);

  var quiqWebchatScript;

  // Listen for handshake form SDK
  window.addEventListener('message', handleMessage);

  // If quiqOptions was given to us in window.name, use that for bootstrapping:
  if (window.name && window.name !== 'quiqChatFrame') {
    try {
      var quiqOptions = JSON.parse(window.name);
      bootstrap(quiqOptions);
    }
    catch (e) {
      console.warn("Quiq Webchat could not parse the options provided in window.name");
    }
  }
};
