import {
  fileAudio,
  fileVideo,
  filePdf,
  file as fileText,
  fileArchive,
  fileWord,
  filePowerpoint,
  fileExcel,
} from 'Icons';

// @flow

export const attachmentTypes: Map<RegExp, {name: string, icon: string}> = new Map([
  [/video\/*/, {name: 'Video file', icon: fileVideo}],
  [/audio\/*/, {name: 'Audio file', icon: fileAudio}],
  [/text\/*/, {name: 'File', icon: fileText}],
  [/application\/pdf/, {name: 'PDF file', icon: filePdf}],
  [/application\/zip/, {name: 'ZIP file', icon: fileArchive}],
  [/application\/msword/, {name: 'Word file', icon: fileWord}],
  [
    /application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document/,
    {name: 'Word file', icon: fileWord},
  ],
  [/application\/vnd\.ms-powerpoint/, {name: 'PowerPoint file', icon: filePowerpoint}],
  [
    /application\/vnd\.openxmlformats-officedocument\.presentationml\.presentation/,
    {name: 'PowerPoint file', icon: filePowerpoint},
  ],
  [/application\/vnd\.ms-excel/, {name: 'Excel file', icon: fileExcel}],
  [
    /application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet/,
    {name: 'Excel file', icon: fileExcel},
  ],
]);

export const getMetadataForMimeType = (mimeType: string): {name: string, icon: string} => {
  // eslint-disable-next-line no-restricted-syntax
  for (const [regex, metadata] of attachmentTypes) {
    if (regex.test(mimeType)) {
      return metadata;
    }
  }

  // Mime type didn't match anything
  return {name: 'File', icon: fileText};
};
