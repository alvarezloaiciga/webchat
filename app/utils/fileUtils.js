// @flow

export const attachmentTypes: Map<RegExp, {name: string, icon: string}> = new Map([
  [/video\/*/, {name: 'Video file', icon: 'file-video-o'}],
  [/audio\/*/, {name: 'Audio file', icon: 'file-audio-o'}],
  [/text\/*/, {name: 'File', icon: 'file-text-o'}],
  [/application\/pdf/, {name: 'PDF file', icon: 'file-pdf-o'}],
  [/application\/zip/, {name: 'ZIP file', icon: 'file-archive-o'}],
  [/application\/msword/, {name: 'Word file', icon: 'file-word-o'}],
  [
    /application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document/,
    {name: 'Word file', icon: 'file-word-o'},
  ],
  [/application\/vnd\.ms-powerpoint/, {name: 'PowerPoint file', icon: 'file-powerpoint-o'}],
  [
    /application\/vnd\.openxmlformats-officedocument\.presentationml\.presentation/,
    {name: 'PowerPoint file', icon: 'file-powerpoint-o'},
  ],
  [/application\/vnd\.ms-excel/, {name: 'PowerPoint file', icon: 'file-excel-o'}],
  [
    /application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet/,
    {name: 'PowerPoint file', icon: 'file-excel-o'},
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
  return {name: 'File', icon: 'file-o'};
};
