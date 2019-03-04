import atob from 'atob';
import { parseBase64 } from 'common/utils/file';

export function parseFile(base64str) {
  const content = atob(parseBase64(base64str).data);
}
