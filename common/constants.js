import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const {
  API_URL,
  API_BASE_PATH,
  APP_URL,
  AUTH_ENDPOINT,
  REDIRECT_AUTH_ENDPOINT,
  MAX_UPLOADING_FILE_SIZE,
} = publicRuntimeConfig;

export const DEFAULT_IDLE_TIMEOUT = 5 * 60 * 1000;

export const ROOT_TYPE = 'root';
export const INBOX_TYPE = 'inbox';
export const LIST_TYPE = 'list';
export const TRASH_TYPE = 'trash';
export const LIST_TYPES = {
  ROOT_TYPE,
  INBOX_TYPE,
  LIST_TYPE,
  TRASH_TYPE,
};

export const POST_REVIEW_MODE = 'review';
export const POST_WORKFLOW_EDIT_MODE = 'edit';
export const POST_WORKFLOW_CREATE_MODE = 'create';
export const POST_MODES = {
  POST_REVIEW_MODE,
  POST_WORKFLOW_EDIT_MODE,
  POST_WORKFLOW_CREATE_MODE,
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
export const POST_CREDENTIALS_TYPE = 'credentials';
export const POST_CREDIT_CARD_TYPE = 'card';
export const POST_TYPES = {
  POST_CREDENTIALS_TYPE,
  POST_CREDIT_CARD_TYPE,
};
