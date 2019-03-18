import atob from 'atob';
import { parse } from 'papaparse';
import { parseBase64 } from 'common/utils/file';

export function parseFile(base64str) {
  const content = parse(atob(parseBase64(base64str).data));
  const data = content.data.filter(row => !row.every(item => !item));

  const [headings, ...rest] = data;

  const emptyIndexes = headings.reduce((acc, item, index) => {
    if (!item) {
      return [...acc, index];
    }

    return acc;
  }, []);

  return {
    headings: headings.filter(item => item !== ''),
    rows: rest.map(row =>
      row.reduce((acc, item, index) => {
        if (emptyIndexes.includes(index)) {
          return acc;
        }

        return [...acc, item];
      }, []),
    ),
  };
}
