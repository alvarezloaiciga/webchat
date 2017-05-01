# QUIQ WebChat

This is the end-user client for web chats with Quiq Messaging

### Production Note
If running Webchat in IE9, it is _required_ to have the following at the **top** of your webpage's `<head>`.

`<meta http-equiv="X-UA-Compatible" content="IE=edge">`

## Usage

### Setup
Ensure you have registered the `default` contactPoint with Chatterbox at `POST /external/chat/registration`
```json
  {
    "endpoints": [
      {
        "id": "default",
        "label": "default"
      }
    ]
  }
```

### Running on a hosted site
Include this at the bottom of your index.html
```js
<script src="https://yourTenant.cluster.centricient.corp/app/webchat/index.js" type="text/javascript"></script>
```

### Running Locally
Include this at the bottom of the page
```js
  <script type="text/javascript">
    window.QUIQ = {
      HOST: 'https://andrew.dev.centricient.corp',
    };
  </script>
  <script src="/location/of/index.js" type="text/javascript"></script>
```
replacing HOST with your site URL.

There is an optional `DEBUG` property on the window.QUIQ object.  Currently this will override the atmosphere transport type.
```js
  window.QUIQ = {
    HOST: 'https://andrew.dev.centricient.corp',
    DEBUG: {
      transport: 'long-polling'
    }
  };
```

### Running Webchat from a VM locally
I haven't found a way to get hot reloading working.  I think to do so, we'd have to map `localhost:3000` to a domain name like we do in message-ui.  Until then, this is what I've found works.
1. Open Notepad as admin (search in the start menu, right click, run as admin)
2. Open `C:\Windows\System32\drivers\etc\hosts`
3. Find your Mac's IP Address by running `ifconfig | grep --color 172\.20` (this works currently with our static ip scheme)
4. Add an entry in your hosts file like the following. If your ip were 172.20.5.1, your entry would look like `172.20.5.1  mymac`.  Note, the term `mymac` should specifically be used, since we have a special case in webchat to look for it.
5. Create a folder on your desktop, or somewhere else (on your mac) named `localWebchat`
6. In the `localWebchat` directory, add your `index.html` file from above.  You should point the script tag at `index.js`. We will be hosting the index file here.
7. `yarn build` the webchat repo
8. Copy the `dist/` directory to your new `localWebchat` folder.
9. in your local `localWebchat` folder, spin up a server to host the index file. `python -m SimpleHTTPServer 9000`
10. In your VM, open up your browser and navigate to `http://mymac:9000`
Note: You'll probably want to create a bash alias to automate steps 6-9.  You don't need to restart the python server after every build, it will use the correctly updated `index.js` file.
My bash alias looks like the following (sketchy, but works): `cd work/webchat && yarn build && cp -R dist/ ~/Desktop/localWebchat && cd -`

### window.QUIQ Object
The window.QUIQ object contains properties describing how the instance of webchat should act.  
  - CONTACT_POINT
    - type: string
    - description: The contact point for this webchat interface
    - required: no
    - default: 'default'
  - COLOR
    - type: string
    - description: Color to control appearance of chat UI in hex format.
    - required: no
    - default: '#59ad5d' (green)
  - HEADER_TEXT
    - type: string
    - description: Message to appear at top of chat window.
    - required: no
    - default: 'We're here to help if you have any questions!'
  - HOST
    - type: string
    - description: The hostname to operate against. In production, this should always be goquiq.com, and shouldn't need to be manually set
    - required: no
    - default: 'goquiq.com'
