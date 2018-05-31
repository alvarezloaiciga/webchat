# Quiq Web Chat
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> ** Welcome to Chat, Quiq's easy-to-use, highly-extendable Web Chat client built for the modern age. **

## Quiq Start

### Enabling Web Chat on your Tenant

Web Chat is setup is on a per-contact point basis. This will need to be done before chat can function on your site.
To enable Web Chat for a contact point, go to the **Quiq Admin UI**, select **Contact Points** on the left-hand side, then select a contact point you wish to edit.
Next, under **Platform Specific Settings**, toggle the **Web Chat Enabled** switch to the "on" position. 
Web Chat is now enabled on that contact point.

### Adding chat to your page

Quiq Chat can work out-of-the-box with minimal setup on your part. Simply include the Quiq Chat library on your page by adding the following script tag into the `<head>` of your HTML:
**Replace `<tenant>` with the name of your Quiq tenant.**

```javascript
<script src="https://<tenant>.goquiq.com/app/webchat/index.js"></script>
```

Next, setup Web Chat by calling the `Quiq()` function in the body of your page:

```javascript
var chat = Quiq({
  contactPoint: 'default',
});
```

?> You should replace `tenant` with the name of your own Quiq tenant. If you would like Chat to send messages to a specific Contact Point, replace `default` with that Contact Point's name. **NOTE:** The `contactPoint` you specify must be enabled from Admin UI as described above.

?> The `Quiq()` function can be called with an object containing customization options beyond just `contactPoint`. See the [Options](/types?id=options) section for all the possible customization points.

**That's all there is to it!** A launch button should now be visible in the lower-right corner of your page, and a fully functioning chat UI will appear when clicked.

If you need to change the way the UI looks, show or hide Chat at specific times or alter some other aspect, we've got you covered.
The Chat experience is very customizable, and includes an SDK you can use to control its behavior from your page.
- [Learn about configuration options to control appearence and behavior](/types?id=options)
- [Learn about using the SDK to control chat via JavaScript](/sdk)