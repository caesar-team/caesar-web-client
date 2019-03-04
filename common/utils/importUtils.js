import atob from 'atob';
import { parse } from 'papaparse';
import { parseBase64 } from 'common/utils/file';

export function parseFile(base64str) {
  const content = parse(atob(parseBase64(base64str).data));
  const data = content.data.filter(row => !row.every(item => !item));

  const [headings, ...rest] = data;

  return {
    headings,
    rows: rest,
  };
}
