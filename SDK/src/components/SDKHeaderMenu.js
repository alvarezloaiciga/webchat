// @flow
/** @jsx h */
import {h} from 'preact';
import {getStyle} from 'Common/QuiqOptions';
import SDKChatContainer from './SDKChatContainer';
import {getQuiqOptions} from 'Globals';
import {intlMessageTypes, displayModes, postmasterActionTypes} from 'Common/Constants';
import {tellChat} from 'Postmaster';
import {getDisplayString} from 'core-ui/services/i18nService';
import './styles/SDKHeaderMenu.scss';

// Here in the SDK, we don't have access to font awesome, as we don't want to load it on the customer's page.
// These are the same icons in the form of SVG constants.
const windowMaximize = (
  <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0.000000, 128.000000)">
      <path
        d="M1408,928 L1408,1248 C1408,1327.33333 1379.83333,1395.16667 1323.5,1451.5 C1267.16667,1507.83333 1199.33333,1536 1120,1536 L288,1536 C208.666667,1536 140.833333,1507.83333 84.5,1451.5 C28.1666667,1395.16667 0,1327.33333 0,1248 L0,416 C0,336.666667 28.1666667,268.833333 84.5,212.5 C140.833333,156.166667 208.666667,128 288,128 L992,128 C1001.33333,128 1009,131 1015,137 C1021,143 1024,150.666667 1024,160 L1024,224 C1024,233.333333 1021,241 1015,247 C1009,253 1001.33333,256 992,256 L288,256 C244,256 206.333333,271.666667 175,303 C143.666667,334.333333 128,372 128,416 L128,1248 C128,1292 143.666667,1329.66667 175,1361 C206.333333,1392.33333 244,1408 288,1408 L1120,1408 C1164,1408 1201.66667,1392.33333 1233,1361 C1264.33333,1329.66667 1280,1292 1280,1248 L1280,928 C1280,918.666667 1283,911 1289,905 C1295,899 1302.66667,896 1312,896 L1376,896 C1385.33333,896 1393,899 1399,905 C1405,911 1408,918.666667 1408,928 Z M1792,64 L1792,576 C1792,593.333333 1785.66667,608.333333 1773,621 C1760.33333,633.666667 1745.33333,640 1728,640 C1710.66667,640 1695.66667,633.666667 1683,621 L1507,445 L855,1097 C848.333333,1103.66667 840.666667,1107 832,1107 C823.333333,1107 815.666667,1103.66667 809,1097 L695,983 C688.333333,976.333333 685,968.666667 685,960 C685,951.333333 688.333333,943.666667 695,937 L1347,285 L1171,109 C1158.33333,96.3333333 1152,81.3333333 1152,64 C1152,46.6666667 1158.33333,31.6666667 1171,19 C1183.66667,6.33333333 1198.66667,0 1216,0 L1728,0 C1745.33333,0 1760.33333,6.33333333 1773,19 C1785.66667,31.6666667 1792,46.6666667 1792,64 Z"
        id="Shape"
      />
    </g>
  </svg>
);

const windowClose = (
  <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
    <rect
      transform="translate(896.177670, 896.177670) rotate(315.000000) translate(-896.177670, -896.177670) "
      x="793.395924"
      y="-135.491124"
      width="205.563492"
      height="2063.33759"
      rx="35"
    />
    <rect
      transform="translate(896.177670, 896.177670) rotate(45.000000) translate(-896.177670, -896.177670) "
      x="793.395924"
      y="-135.491124"
      width="205.563492"
      height="2063.33759"
      rx="35"
    />
  </svg>
);

const minimize = () => {
  tellChat(postmasterActionTypes.setChatVisibility, {visible: false});
};

const popChat = () => {
  SDKChatContainer.handleStandaloneOpen();
};

const renderButtons = () => {
  const configuration = getQuiqOptions();
  const {messages} = configuration;
  const iconStyle = getStyle(configuration.styles.HeaderMenuIcons);
  return (
    <div className="buttons">
      {configuration.displayMode === displayModes.EITHER && (
        <button
          className="icon"
          style={iconStyle}
          title={getDisplayString(messages[intlMessageTypes.openInNewWindowTooltip])}
          onClick={popChat}
        >
          {windowMaximize}
        </button>
      )}

      {configuration.displayMode !== displayModes.UNDOCKED && (
        <button
          className="icon"
          style={iconStyle}
          title={getDisplayString(messages[intlMessageTypes.minimizeWindowTooltip])}
          onClick={minimize}
        >
          {windowClose}
        </button>
      )}
    </div>
  );
};

export const SDKHeaderMenu = () => {
  const {colors, styles, fontFamily, demoMode, messages} = getQuiqOptions();

  const headerStyle = getStyle(styles.HeaderMenu, {backgroundColor: colors.primary});
  const titleTextStyle = getStyle(styles.TitleText, {fontFamily});

  return (
    <div className="HeaderMenu" style={headerStyle}>
      <div className="title">
        <span style={titleTextStyle}>{getDisplayString(messages[intlMessageTypes.titleText])}</span>
      </div>
      {!demoMode && renderButtons()}
    </div>
  );
};

export default SDKHeaderMenu;
