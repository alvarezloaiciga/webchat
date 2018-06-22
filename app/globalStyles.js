import {injectGlobal} from 'react-emotion';

injectGlobal`
  * {
    font-family: sans-serif;
    box-sizing: border-box;
  }
`;

injectGlobal`
  .emoji-mart,
  .emoji-mart * {
    box-sizing: border-box;
    line-height: 1.15;
  }

  .emoji-mart {
    font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
    font-size: 16px;
    display: inline-block;
    color: #222427;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    background: #fff;
  }

  .emoji-mart .emoji-mart-emoji {
    padding: 6px;
  }

  .emoji-mart-bar {
    border: 0 solid #d9d9d9;
  }
  .emoji-mart-bar:first-child {
    border-bottom-width: 1px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .emoji-mart-bar:last-child {
    border-top-width: 1px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .emoji-mart-anchors {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    padding: 0 6px;
    color: #858585;
    line-height: 0;
    hiehgt: 40px;
  }

  .emoji-mart-anchor {
    position: relative;
    display: block;
    width: 30px;
    flex: 1 1 auto;
    text-align: center;
    padding: 12px 4px;
    overflow: hidden;
    transition: color 0.1s ease-out;
  }
  .emoji-mart-anchor:hover,
  .emoji-mart-anchor-selected {
    color: #464646;
  }

  .emoji-mart-anchor-selected .emoji-mart-anchor-bar {
    bottom: 0;
  }

  .emoji-mart-anchor-bar {
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #464646;
  }

  .emoji-mart-anchors i {
    display: inline-block;
    width: 100%;
    max-width: 22px;
  }

  .emoji-mart-anchors svg {
    fill: currentColor;
    max-height: 18px;
  }

  .emoji-mart-scroll {
    overflow-y: scroll;
    height: 270px;
    padding: 0 6px 6px 6px;
    will-change: transform; /* avoids "repaints on scroll" in mobile Chrome */
  }

  .emoji-mart-search {
    margin-top: 6px;
    padding: 0 6px;
  }
  .emoji-mart-search input {
    font-size: 16px;
    display: block;
    width: 100%;
    padding: 0.2em 0.6em;
    border-radius: 25px;
    border: 1px solid #d9d9d9;
    outline: 0;
  }

  .emoji-mart-category .emoji-mart-emoji span {
    z-index: 1;
    position: relative;
    text-align: center;
    cursor: default;
  }

  .emoji-mart-category .emoji-mart-emoji:hover:before {
    z-index: 0;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f4f4f4;
    border-radius: 100%;
  }

  .emoji-mart-category-label {
    z-index: 2;
    position: relative;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
  }

  .emoji-mart-category-label span {
    display: block;
    width: 100%;
    font-weight: 500;
    padding: 5px 6px;
    background-color: #fff;
    background-color: rgba(255, 255, 255, 0.95);
  }

  .emoji-mart-emoji {
    position: relative;
    display: inline-block;
    font-size: 0;
  }

  .emoji-mart-no-results {
    font-size: 14px;
    text-align: center;
    padding-top: 70px;
    color: #858585;
  }
  .emoji-mart-no-results .emoji-mart-category-label {
    display: none;
  }
  .emoji-mart-no-results .emoji-mart-no-results-label {
    margin-top: 0.2em;
  }
  .emoji-mart-no-results .emoji-mart-emoji:hover:before {
    content: none;
  }

  .emoji-mart-preview {
    position: relative;
    height: 70px;
  }

  .emoji-mart-preview-emoji,
  .emoji-mart-preview-data,
  .emoji-mart-preview-skins {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .emoji-mart-preview-emoji {
    left: 12px;
  }

  .emoji-mart-preview-data {
    left: 68px;
    right: 12px;
    word-break: break-all;
  }

  .emoji-mart-preview-skins {
    right: 30px;
    text-align: right;
  }

  .emoji-mart-preview-name {
    font-size: 14px;
  }

  .emoji-mart-preview-shortname {
    font-size: 12px;
    color: #888;
  }
  .emoji-mart-preview-shortname + .emoji-mart-preview-shortname,
  .emoji-mart-preview-shortname + .emoji-mart-preview-emoticon,
  .emoji-mart-preview-emoticon + .emoji-mart-preview-emoticon {
    margin-left: 0.5em;
  }

  .emoji-mart-preview-emoticon {
    font-size: 11px;
    color: #bbb;
  }

  .emoji-mart-title span {
    display: inline-block;
    vertical-align: middle;
  }

  .emoji-mart-title .emoji-mart-emoji {
    padding: 0;
  }

  .emoji-mart-title-label {
    color: #999a9c;
    font-size: 26px;
    font-weight: 300;
  }

  .emoji-mart-skin-swatches {
    font-size: 0;
    padding: 2px 0;
    border: 1px solid #d9d9d9;
    border-radius: 12px;
    background-color: #fff;
  }

  .emoji-mart-skin-swatches-opened .emoji-mart-skin-swatch {
    width: 16px;
    padding: 0 2px;
  }

  .emoji-mart-skin-swatches-opened .emoji-mart-skin-swatch-selected:after {
    opacity: 0.75;
  }

  .emoji-mart-skin-swatch {
    display: inline-block;
    width: 0;
    vertical-align: middle;
    transition-property: width, padding;
    transition-duration: 0.125s;
    transition-timing-function: ease-out;
  }

  .emoji-mart-skin-swatch:nth-child(1) {
    transition-delay: 0s;
  }
  .emoji-mart-skin-swatch:nth-child(2) {
    transition-delay: 0.03s;
  }
  .emoji-mart-skin-swatch:nth-child(3) {
    transition-delay: 0.06s;
  }
  .emoji-mart-skin-swatch:nth-child(4) {
    transition-delay: 0.09s;
  }
  .emoji-mart-skin-swatch:nth-child(5) {
    transition-delay: 0.12s;
  }
  .emoji-mart-skin-swatch:nth-child(6) {
    transition-delay: 0.15s;
  }

  .emoji-mart-skin-swatch-selected {
    position: relative;
    width: 16px;
    padding: 0 2px;
  }
  .emoji-mart-skin-swatch-selected:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 4px;
    height: 4px;
    margin: -2px 0 0 -2px;
    background-color: #fff;
    border-radius: 100%;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease-out;
  }

  .emoji-mart-skin {
    display: inline-block;
    width: 100%;
    padding-top: 100%;
    max-width: 12px;
    border-radius: 100%;
  }

  .emoji-mart-skin-tone-1 {
    background-color: #ffc93a;
  }
  .emoji-mart-skin-tone-2 {
    background-color: #fadcbc;
  }
  .emoji-mart-skin-tone-3 {
    background-color: #e0bb95;
  }
  .emoji-mart-skin-tone-4 {
    background-color: #bf8f68;
  }
  .emoji-mart-skin-tone-5 {
    background-color: #9b643d;
  }
  .emoji-mart-skin-tone-6 {
    background-color: #594539;
  }
`;

injectGlobal`
  /**
  * Draft v0.10.3
  *
  * Copyright (c) 2013-present, Facebook, Inc.
  * All rights reserved.
  *
  * This source code is licensed under the BSD-style license found in the
  * LICENSE file in the root directory of this source tree. An additional grant
  * of patent rights can be found in the PATENTS file in the same directory.
  */
 .DraftEditor-editorContainer,.DraftEditor-root,.public-DraftEditor-content{
    height:inherit;
    text-align:initial
  }
  .public-DraftEditor-content[contenteditable=true]{
    -webkit-user-modify:read-write-plaintext-only
  }
  .DraftEditor-root{
    position:relative
  }
  .DraftEditor-editorContainer{
    background-color:rgba(255,255,255,0);
    border-left:.1px solid transparent;
    position:relative;
    z-index:1
  }
  .public-DraftEditor-block{
    position:relative
  }
  .DraftEditor-alignLeft .public-DraftStyleDefault-block{
    text-align:left
  }
  .DraftEditor-alignLeft .public-DraftEditorPlaceholder-root{
    left:0;
    text-align:left
  }
  .DraftEditor-alignCenter .public-DraftStyleDefault-block{
    text-align:center
  }
  .DraftEditor-alignCenter .public-DraftEditorPlaceholder-root{
    margin:0 auto;
    text-align:center;
    width:100%
  }
  .DraftEditor-alignRight .public-DraftStyleDefault-block{
    text-align:right
  }
  .DraftEditor-alignRight .public-DraftEditorPlaceholder-root{
    right:0;
    text-align:right
  }
  .public-DraftEditorPlaceholder-root{
    color:#9197a3;
    position:absolute;
    z-index:1
  }
  .public-DraftEditorPlaceholder-hasFocus{
    color:#bdc1c9
  }
  .DraftEditorPlaceholder-hidden{
    display:none
  }
  .public-DraftStyleDefault-block{
    position:relative;
    white-space:pre-wrap
  }
  .public-DraftStyleDefault-ltr{
    direction:ltr;
    text-align:left
  }
  .public-DraftStyleDefault-rtl{
    direction:rtl;
    text-align:right
  }
  .public-DraftStyleDefault-listLTR{
    direction:ltr
  }
  .public-DraftStyleDefault-listRTL{
    direction:rtl
  }
  .public-DraftStyleDefault-ol,.public-DraftStyleDefault-ul{
    margin:16px 0;
    padding:0
  }
  .public-DraftStyleDefault-depth0.public-DraftStyleDefault-listLTR{
    margin-left:1.5em
  }
  .public-DraftStyleDefault-depth0.public-DraftStyleDefault-listRTL{
    margin-right:1.5em
  }
  .public-DraftStyleDefault-depth1.public-DraftStyleDefault-listLTR{
    margin-left:3em
  }
  .public-DraftStyleDefault-depth1.public-DraftStyleDefault-listRTL{
    margin-right:3em
  }
  .public-DraftStyleDefault-depth2.public-DraftStyleDefault-listLTR{
    margin-left:4.5em
  }
  .public-DraftStyleDefault-depth2.public-DraftStyleDefault-listRTL{
    margin-right:4.5em
  }
  .public-DraftStyleDefault-depth3.public-DraftStyleDefault-listLTR{
    margin-left:6em
  }
  .public-DraftStyleDefault-depth3.public-DraftStyleDefault-listRTL{
    margin-right:6em
  }
  .public-DraftStyleDefault-depth4.public-DraftStyleDefault-listLTR{
    margin-left:7.5em
  }
  .public-DraftStyleDefault-depth4.public-DraftStyleDefault-listRTL{
    margin-right:7.5em
  }
  .public-DraftStyleDefault-unorderedListItem{
    list-style-type:square;
    position:relative
  }
  .public-DraftStyleDefault-unorderedListItem.public-DraftStyleDefault-depth0{
    list-style-type:disc
  }
  .public-DraftStyleDefault-unorderedListItem.public-DraftStyleDefault-depth1{
    list-style-type:circle
  }
  .public-DraftStyleDefault-orderedListItem{
    list-style-type:none;
    position:relative
  }
  .public-DraftStyleDefault-orderedListItem.public-DraftStyleDefault-listLTR:before{
    left:-36px;
    position:absolute;
    text-align:right;
    width:30px
  }
  .public-DraftStyleDefault-orderedListItem.public-DraftStyleDefault-listRTL:before{
    position:absolute;
    right:-36px;
    text-align:left;
    width:30px
  }
  .public-DraftStyleDefault-orderedListItem:before{
    content:counter(ol0) ". ";
    counter-increment:ol0
  }
  .public-DraftStyleDefault-orderedListItem.public-DraftStyleDefault-depth1:before{
    content:counter(ol1) ". ";
    counter-increment:ol1
  }
  .public-DraftStyleDefault-orderedListItem.public-DraftStyleDefault-depth2:before{
    content:counter(ol2) ". ";
    counter-increment:ol2
  }
  .public-DraftStyleDefault-orderedListItem.public-DraftStyleDefault-depth3:before{
    content:counter(ol3) ". ";
    counter-increment:ol3
  }
  .public-DraftStyleDefault-orderedListItem.public-DraftStyleDefault-depth4:before{
    content:counter(ol4) ". ";
    counter-increment:ol4
  }
  .public-DraftStyleDefault-depth0.public-DraftStyleDefault-reset{
    counter-reset:ol0
  }
  .public-DraftStyleDefault-depth1.public-DraftStyleDefault-reset{
    counter-reset:ol1
  }
  .public-DraftStyleDefault-depth2.public-DraftStyleDefault-reset{
    counter-reset:ol2
  }
  .public-DraftStyleDefault-depth3.public-DraftStyleDefault-reset{
    counter-reset:ol3
  }
  .public-DraftStyleDefault-depth4.public-DraftStyleDefault-reset{
    counter-reset:ol4
  }
`;
