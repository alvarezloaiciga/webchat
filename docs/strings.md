# Chat strings 
 You can override every piece of static text that appears in Webchat. This lets you match the app's verbage with your brand and provide translations for any language. 
 
- ### pageTitle
Title for standalone window  
**Default value:** *Quiq Webchat*
  
- ### messageArrivedNotification
Message Arrived  
**Default value:** *New Message from Quiq Webchat*
  
- ### send
Generic send message  
**Default value:** *Send*
  
- ### sendUsAMessage
Generic Send us a message  
**Default value:** *Send us a message...*
  
- ### reconnecting
Reconnecting to websocket  
**Default value:** *Reconnecting...*
  
- ### connecting
Connecting to websocket  
**Default value:** *Connecting...*
  
- ### errorState
Generic Error Message  
**Default value:** *We're having trouble connecting. Try refreshing the page.*
  
- ### clientInactive
Generic Client Inactive Message  
**Default value:** *You have been disconnected due to inactivity. Please refresh the page to reconnect.*
  
- ### agentIsTyping
Message to display when the agent is typing  
**Default value:** *Agent is typing*
  
- ### agentAssigned
The text of the event that's shown in the transcript when an agent is assigned.  
**Default value:** *You're chatting with {agent_name}*
  
- ### agentEndedConversation
Message to display when the agent ends conversation  
**Default value:** *Agent ended the conversation.*
  
- ### agentsNotAvailable
Message to display when no agents are avialable.  
**Default value:** *No agents are currently available.*
  
- ### required
Required  
**Default value:** *Required*
  
- ### referrer
Message to append to welcome form telling agent what web page the customer is on  
**Default value:** *Referrer*
  
- ### standaloneFatalError
Error to display when we load the quiqOptions object from query params in standalone mode  
**Default value:** *Error loading standalone mode. Are the query params properly formatted?*
  
- ### errorParsingStandaloneObject
Error to display when we found the quiqOptions query param but weren't able to parse it into a valid quiqOptions object  
**Default value:** *Error while trying to parse the standalone quiqOptions query object*
  
- ### cannotDetermineHost
Error to display when we can't determine the hostid from the script src attribute  
**Default value:** *Cannot determine host from script url. Please contact your administrator*
  
- ### quiqFatalError
Message to show a quiq fatal error  
**Default value:** *quiqOptions FATAL ERROR*
  
- ### hereToHelp
Welcome message to display at top of webchat  
**Default value:** *We're here to help if you have any questions!*
  
- ### openInNewWindow
Message to display on open in new window icon  
**Default value:** *Open chat in new window*
  
- ### emojiPickerTooltip
Tooltip for emoji picker toggle button  
**Default value:** *Emoji picker*
  
- ### optionsMenuTooltip
Tooltip for the options button to the left of the MessageForm  
**Default value:** *Options*
  
- ### emailTranscriptMenuMessage
Message to display in the options menu for the user to get an email containing the transcript of the chat  
**Default value:** *Email Transcript*
  
- ### emailTranscriptMenuTooltip
Tooltip for Email transcript menu button  
**Default value:** *Email a full transcript of the current chat*
  
- ### emailTranscriptInputPlaceholder
Message to display to user when they need to enter an Email to receive their transcript  
**Default value:** *Enter your Email...*
  
- ### emailTranscriptInputCancelTooltip
Tooltip to display above the Cancel button on the email transcript input  
**Default value:** *Cancel Email Transcript*
  
- ### emailTranscriptInputSubmitTooltip
Tooltip to display above the Submit button on the email transcript input  
**Default value:** *Email Transcript*
  
- ### emailTranscriptInlineButton
Text to display on the Email Transcript button that shows inline when agent ends convo  
**Default value:** *Email Transcript*
  
- ### transcriptEmailedEventMessage
Text to display on the inline Event displayed to the user when a transcript was successfully e-mailed to them  
**Default value:** *Transcript emailed*
  
- ### attachmentBtnTooltip
Tooltip for attachment button  
**Default value:** *Send file*
  
- ### welcomeFormUniqueIdentifier
Unique identifier to key off of as identifying a message as the welcome form customer submission.  
**Default value:** *Quiq Welcome Form Customer Submission*
  
- ### dockWindow
Message to display when user hovers over button in standalone mode to dock the standalone window back into the parent window  
**Default value:** *Dock chat*
  
- ### closeWindow
Close Window button  
**Default value:** *Hide chat*
  
- ### cookiesMustBeEnabledError
Error message to display when end user does not have cookies enabled  
**Default value:** *Cookies must be enabled to use Webchat*
  
- ### invalidWelcomeFormArray
Error message to display when WELCOME_FORM is not valid because fields must be of type array.  
**Default value:** *Invalid WELCOME_FORM definition: "WELCOME_FORM.fields" must be an array*
  
- ### invalidWelcomeFormUndefined
Error message to display when WELCOME_FORM is not valid because a field is missing required property.  
**Default value:** *Invalid WELCOME_FORM definition: The form field with id of "{id}" and label of "{label}" must have id, label and type defined.*
  
- ### invalidWelcomeFormDefinitionKeyLength
Error message to display when WELCOME_FORM is not valid because a field has an id that is too long.  
**Default value:** *Invalid WELCOME_FORM definition: The form field with id of "{id}" must have an id of length less or equal to than 80 characters.*
  
- ### invalidWelcomeFormDefinitionKeyUniqueness
Error message to display when WELCOME_FORM is not valid because not all fields have unique id's.  
**Default value:** *Invalid WELCOME_FORM definition: All fields must have a unique id*
  
- ### invalidWelcomeFormDefinitionKeyReserved
Error message to display when WELCOME_FORM is not valid because a field has an id that is reserved  
**Default value:** *Invalid WELCOME_FORM definition: Fields cannot have an id of "{id}" as this id is used internally.*
  
- ### invalidWelcomeFormFieldCount
Error message to display when WELCOME_FORM is not valid because there are too many fields  
**Default value:** *Invalid WELCOME_FORM definition: There can be at most 20 fields*
  
- ### invalidWelcomeFormFieldType
Error message to display when WELCOME_FORM is not valid because an unsupported field type was given  
**Default value:** *Invalid WELCOME_FORM definition: "{type}" is not a supported field type.*
  
- ### invalidWelcomeFormFieldRowsType
Error message to display when WELCOME_FORM is not valid because a non-numeric value was specified for a field's "rows" parameter  
**Default value:** *Invalid WELCOME_FORM definition: All fields' "rows" parameters must be of type number*
  
- ### submitWelcomeForm
Text of submit button on welcome form  
**Default value:** *Submit*
  
- ### submittingWelcomeForm
Text of submit button on welcome form while form is being submitted  
**Default value:** *Submitting*
  
- ### invalidEmailErrorMessage
Error displayed when user uses an invalid e-mail  
**Default value:** *Please enter a valid e-mail*
  
- ### welcomeFormValidationError
Error displayed when user has not filled in a required field  
**Default value:** *Please complete all fields marked with an **
  
- ### unableToBindCustomLauncherError
Error to display when CUSTOM_LAUNCH_BUTTONS is misconfigured  
**Default value:** *Unable to bind custom webchat launch buttons*
  
- ### unableToFindCustomLauncherError
Error to display once we successfully bind the webchat buttons, but they are now missing  
**Default value:** *Unable to find already-bound custom webchat launch buttons*
  
- ### cssHttpsError
Error displayed when css file is not an https url  
**Default value:** *The CUSTOM_CSS_URL must be an HTTPS url.*
  
- ### mfInitNeeded
Error displayed when init() has not been run in malfunction junction and we try and run something we shouldn't  
**Default value:** *MalfunctionJunction.init() must be run before posting a message, setting up listeners, or setting up Redux observers.*
  
- ### cannotFindHostingWindow
Error for when webchat can't find the host window (where SDK is running)  
**Default value:** *Unable to find host window*
  
- ### attachmentUploadError
Alert message for an attachment failing to upload  
**Default value:** *Error uploading file*
  
- ### muteSounds
label for muting sounds  
**Default value:** *Mute Sounds*
  
- ### unmuteSounds
label for unmuting sounds  
**Default value:** *Unmute Sounds*
  
- ### muteSoundsTooltip
tooltip for muting sounds  
**Default value:** *Mute new message sounds*
  
- ### unmuteSoundsTooltip
tooltip for unmuting sounds  
**Default value:** *Unmute new message sounds*
  
- ### cannotStartNewConversationMessage
tooltip for not being able to start a conversation  
**Default value:** *Conversation Has Ended*
  
- ### unsupportedFileType
Message to display when a file type is unsupported  
**Default value:** *Unsupported File Type*
  
- ### attachmentTooLarge
Message to display when an attachment is too large  
**Default value:** *Attachment Too Large*
  
- ### unsupportedOrientation
Message to display when a user switches to an orientation mode not supported on their device  
**Default value:** *Please rotate your device to portrait mode to continue*
  - ### emojiMessages 

    - #### search
Label for search in emoji picker  
**Default value:** *Search*
  
    - #### notfound
Label for not found in emoji picker  
**Default value:** *No emoji found*
      - #### categories 

        - ##### search
Label for 'Search' category in emoji picker  
**Default value:** *Search*
  
        - ##### recent
Label for 'Recent' category in emoji picker  
**Default value:** *Recent*
  
        - ##### people
Label for 'People/Smileys' category in emoji picker  
**Default value:** *Smileys & People*
  
        - ##### nature
Label for 'animals/nature' category in emoji picker  
**Default value:** *Animals & Nature*
  
        - ##### foods
Label for 'food/drink' category in emoji picker  
**Default value:** *Food & Drink*
  
        - ##### activity
Label for 'activity' category in emoji picker  
**Default value:** *Activity*
  
        - ##### places
Label for 'travel/places' category in emoji picker  
**Default value:** *Travel & Places*
  
        - ##### objects
Label for 'objects' category in emoji picker  
**Default value:** *Objects*
  
        - ##### symbols
Label for 'symbols' category in emoji picker  
**Default value:** *Symbols*
  
        - ##### flags
Label for 'flags' category in emoji picker  
**Default value:** *Flags*
  
        - ##### custom
Label for 'custom' category in emoji picker  
**Default value:** *Custom*
  