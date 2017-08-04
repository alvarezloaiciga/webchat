try {
  function getHostName() {
    if (window.QUIQ && window.QUIQ.HOST) return window.QUIQ.HOST;

    var supportedWebchatUrls = [
      'goquiq.com/app/webchat',
      'quiq.sh/app/webchat',
      'centricient.com/app/webchat',
      'centricient.corp/app/webchat',
      'quiq.dev:7000/app/webchat',
      'centricient.dev:7000/app/webchat',
      'quiq.dev:41014/app/webchat',
      'centricient.dev:41014/app/webchat',
    ];

    var url;
    for (var i = 0; i < supportedWebchatUrls.length; i++) {
      if(window.location.href.indexOf(supportedWebchatUrls[i]) !== -1) {
        url = window.location.href;
      }
    }
    if(!url) {
      var scriptTagsNodeList = document.getElementsByTagName('script');
      var scriptTagsArray = [];
      for (var i = scriptTagsNodeList.length >>> 0; i--;) {
        scriptTagsArray[i] = scriptTagsNodeList[i];
      }
      for (var i = 0; i < supportedWebchatUrls.length; i++) {
        for(var j = 0; j < scriptTagsArray.length; j++) {
          if(scriptTagsArray[j].src.toLowerCase().indexOf(supportedWebchatUrls[i]) !== -1) {
            url = scriptTagsArray.src;
          }
        }
      }
    }

    return url.slice(0, url.indexOf('/app/webchat'));
  }

  function loadQuiqWebchat() {
    window.QUIQ = window.QUIQ || {};

    // TODO: FIX ME!!!!!!!!!!!! DONT FORGET
    var href = getHostName() + "/app/webchatiframify/index.html";
    var quiqChatFrame = document.createElement('iframe');
    quiqChatFrame.id = 'quiqChatFrame';
    quiqChatFrame.src = href;
    window.QUIQ.HEIGHT = window.QUIQ.HEIGHT || 600;
    window.QUIQ.WIDTH = window.QUIQ.WIDTH || 400;
    quiqChatFrame.height = window.QUIQ.HEIGHT;
    quiqChatFrame.width = window.QUIQ.WIDTH;
    quiqChatFrame.style.position = 'fixed';
    window.QUIQ.POSITION = window.QUIQ.POSITION || {};
    quiqChatFrame.style.bottom = window.QUIQ.POSITION.bottom || '24px';
    quiqChatFrame.style.right = window.QUIQ.POSITION.right || '24px';
    quiqChatFrame.style.left = window.QUIQ.POSITION.left || quiqChatFrame.style.left;
    quiqChatFrame.style.top = window.QUIQ.POSITION.top || quiqChatFrame.style.top;
    quiqChatFrame.style.border = 'none';
    quiqChatFrame.onload = function() {
      this.contentWindow.postMessage({ QUIQ: window.QUIQ }, href);
    };
    document.body.appendChild(quiqChatFrame);
  }

  if (window.addEventListener) {
      window.addEventListener('load', loadQuiqWebchat, false);
  } else if (window.attachEvent) {
      window.attachEvent('onload', loadQuiqWebchat);
  } else {
      window.onload = loadQuiqWebchat;
  }
}
catch(ex) {
  throw new Error('Error loading Quiq Webchat', ex);
}
