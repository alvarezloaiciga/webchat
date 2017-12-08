var quiqWebchatScript;

function bootstrap(quiqOptions) {
  // We need to remove message event listener at this point, since Webchat will have its own postRobot listener
  window.removeEventListener('message', handleMessage);

  localStorage.setItem('quiqOptions', JSON.stringify(quiqOptions));

  if (!quiqWebchatScript) {
    quiqWebchatScript = document.createElement('script');
    quiqWebchatScript.src = window.webChatSrc;
    quiqWebchatScript.async = false;

    if (window.webChatHash) {
      quiqWebchatScript.integrity = window.webChatHash;
      quiqWebchatScript.crossOrigin = 'anonymous';
    }

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

  var containsQuiqObject = event.data && typeof event.data === 'object' && "quiqOptions" in event.data;
  if (originMatches && isHandshake && containsQuiqObject) {
    bootstrap(event.data.quiqOptions);
  }
}

if (document.readyState === 'complete') {
  pageSetup();
} else {
  window.addEventListener('load', pageSetup);
}

function inStandaloneMode() {
  // If this fails, it's because of a cross origin exception.
  // This means we  must be in an iFrame, since window and window.top are on different domains.
  // Thus, return false in the catch block.
  try {
    return window.self === window.top;
  } catch (e) {
    return false;
  }
}

function pageSetup() {
  var headTag = document.getElementsByTagName('head')[0];

  var bodyTag = document.getElementsByTagName('body')[0];
  bodyTag.style.cssText="margin:0";

  var metaHttpEquiv = document.createElement('meta');
  metaHttpEquiv.httpEquiv="X-UA-Compatible";
  metaHttpEquiv.content="IE-edge";
  headTag.appendChild(metaHttpEquiv);

  var metaAppName = document.createElement('meta');
  metaAppName.name="application-name";
  metaAppName.content="Quiq Chat";
  headTag.appendChild(metaAppName);

  var metaTileColor = document.createElement('meta');
  metaTileColor.name="msapplication-TileColor";
  metaTileColor.content="#";
  headTag.appendChild(metaTileColor);

  var fontawesomeScript = document.createElement('script');
  fontawesomeScript.src="https://use.fontawesome.com/89da14f4b6.js";
  headTag.appendChild(fontawesomeScript);

  // If we're in a popup, use window.name or localStorage for quiqOptions
  if (inStandaloneMode()) {
    var quiqOptionsString = window.name || (localStorage && localStorage.getItem('quiqOptions'));
    if (quiqOptionsString) {
      try {
        var quiqOptions = JSON.parse(quiqOptionsString);
        bootstrap(quiqOptions);
      }
      catch (e) {
        console.warn("Quiq Webchat could not parse the options provided in window.name");
      }
    }
  }
  else {
    // Otherwise, we're in an iFrame, so listen for handshake form SDK
    window.addEventListener('message', handleMessage);
  }
}
