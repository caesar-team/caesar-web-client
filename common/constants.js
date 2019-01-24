import getConfig from 'next/config';

let publicRuntimeConfig = {};

const config = getConfig();

if (config) {
  // eslint-disable-next-line
  publicRuntimeConfig = config.publicRuntimeConfig;
}

export const {
  API_URL,
  API_BASE_PATH,
  APP_URL,
  AUTH_ENDPOINT,
  REDIRECT_AUTH_ENDPOINT,
  MAX_UPLOADING_FILE_SIZE,
  LENGTH_KEY,
} = publicRuntimeConfig;

export const PORTAL_ID = 'portal';
export const DEFAULT_IDLE_TIMEOUT = 5 * 60 * 1000;
export const MAX_SIZE_RANDOM_BUFFER = 60000;

export const ROOT_TYPE = 'root';
export const INBOX_TYPE = 'inbox';
export const LIST_TYPE = 'list';
export const TRASH_TYPE = 'trash';
export const FAVORITES_TYPE = 'favorites';
export const LIST_TYPES = {
  ROOT_TYPE,
  INBOX_TYPE,
  LIST_TYPE,
  TRASH_TYPE,
};

export const ITEM_REVIEW_MODE = 'review';
export const ITEM_WORKFLOW_EDIT_MODE = 'edit';
export const ITEM_WORKFLOW_CREATE_MODE = 'create';
export const ITEM_MODES = {
  ITEM_REVIEW_MODE,
  ITEM_WORKFLOW_EDIT_MODE,
  ITEM_WORKFLOW_CREATE_MODE,
};

export const LIST_REVIEW_MODE = 'review';
export const LIST_WORKFLOW_EDIT_MODE = 'edit';
export const LIST_WORKFLOW_CREATE_MODE = 'create';
export const LIST_MODES = {
  LIST_REVIEW_MODE,
  LIST_WORKFLOW_EDIT_MODE,
  LIST_WORKFLOW_CREATE_MODE,
};

// mb some types are not included here, don't have enough information
export const ITEM_CREDENTIALS_TYPE = 'credentials';
export const ITEM_CREDIT_CARD_TYPE = 'card';
export const ITEM_TYPES = {
  ITEM_CREDENTIALS_TYPE,
  ITEM_CREDIT_CARD_TYPE,
};

export const KEY_CODES = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  ESC: 27,
  SPACE: 32,
  ARROW_UP: 38,
  ARROW_LEFT: 37,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40,
};
