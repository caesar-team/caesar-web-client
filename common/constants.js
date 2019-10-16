import getConfig from 'next/config';

const { publicRuntimeConfig = {} } = getConfig() || {};

export const {
  API_URI,
  API_BASE_PATH,
  APP_URI,
  AUTH_ENDPOINT,
  REDIRECT_AUTH_ENDPOINT,
  MAX_UPLOADING_FILE_SIZE,
  TOTAL_MAX_UPLOADING_FILES_SIZES,
  LENGTH_KEY,
} = publicRuntimeConfig;

export const PORTAL_ID = 'portal';
export const DEFAULT_IDLE_TIMEOUT = 5 * 60 * 1000;
export const DEFAULT_CORES_COUNT = 4;

export const DECRYPTION_CHUNK_SIZE = 10;
export const ENCRYPTION_CHUNK_SIZE = 5;

export const ROOT_TYPE = 'root';
export const INBOX_TYPE = 'inbox';
export const LIST_TYPE = 'list';
export const DEFAULT_LIST_TYPE = 'default';
export const TRASH_TYPE = 'trash';
export const FAVORITES_TYPE = 'favorites';
export const LIST_TYPES = {
  ROOT_TYPE,
  INBOX_TYPE,
  LIST_TYPE,
  TRASH_TYPE,
};

export const DEFAULT_TEAM_TYPE = 'default';

export const DASHBOARD_DEFAULT_MODE = 'DEFAULT_MODE';
export const DASHBOARD_SEARCH_MODE = 'SEARCH_MODE';
export const DASHBOARD_TOOL_MODE = 'SECURE_MESSAGE_MODE';

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
export const ITEM_DOCUMENT_TYPE = 'document';
export const ITEM_TYPES_ARRAY = [
  ITEM_CREDENTIALS_TYPE,
  ITEM_CREDIT_CARD_TYPE,
  ITEM_DOCUMENT_TYPE,
];
export const ITEM_TYPES = {
  ITEM_CREDENTIALS_TYPE,
  ITEM_CREDIT_CARD_TYPE,
  ITEM_DOCUMENT_TYPE,
};

export const ITEM_ICON_TYPES = {
  [ITEM_CREDENTIALS_TYPE]: 'key',
  [ITEM_DOCUMENT_TYPE]: 'securenote',
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

export const PERMISSION_READ = 'read';
export const PERMISSION_WRITE = 'write';

export const INVITE_TYPE = 'invite';
export const SHARE_TYPE = 'share';

export const USER_ROLE_ADMIN = 'admin';
export const USER_ROLE_MEMBER = 'member';

export const COMMANDS_ROLES = {
  USER_ROLE_ADMIN,
  USER_ROLE_MEMBER,
};

export const ROLE_USER = 'ROLE_USER';
export const ROLE_ADMIN = 'ROLE_ADMIN';
export const ROLE_READ_ONLY_USER = 'ROLE_READ_ONLY_USER';
export const ROLE_ANONYMOUS_USER = 'ROLE_ANONYMOUS_USER';

export const DOMAIN_ROLES = {
  ROLE_USER,
  ROLE_ADMIN,
  ROLE_READ_ONLY_USER,
  ROLE_ANONYMOUS_USER,
};

export const LOADING = 'LOADING';
export const SUCCESS = 'SUCCESS';
export const FAILURE = 'FAILURE';

export const ROUTES = {
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  RESETTING: '/resetting',
  MESSAGE: '/message',
  SECURE: '/secure',
  SHARE: '/share',
  INVITE: '/invite',
  DASHBOARD: '/',
  MANAGE: '/manage',
  IMPORT: '/import',
  TEAM: '/team',
};

export const SHARED_ROUTES = [ROUTES.SHARE, ROUTES.INVITE];

// require bootstrap
// TODO: figure out better naming
export const LOCKED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.MANAGE,
  ROUTES.IMPORT,
  ROUTES.TEAM,
];

// don't require bootstrap routes
// TODO: figure out better naming
export const UNLOCKED_ROUTES = [
  ROUTES.SIGN_IN,
  ROUTES.SIGN_UP,
  ROUTES.RESETTING,
  ROUTES.MESSAGE,
  ROUTES.SECURE,
  ROUTES.SHARE,
  ROUTES.INVITE,
];

export const CHILD_ITEM_ENTITY_TYPE = 'ChildItem';
export const ITEM_ENTITY_TYPE = 'Item';
export const LIST_ENTITY_TYPE = 'List';
export const TEAM_ENTITY_TYPE = 'Team';
export const MEMBER_ENTITY_TYPE = 'Member';

export const ENTITIES = {
  CHILD_ITEM_ENTITY_TYPE,
  ITEM_ENTITY_TYPE,
  LIST_ENTITY_TYPE,
  TEAM_ENTITY_TYPE,
  MEMBER_ENTITY_TYPE,
};

export const CRUD_PERMISSION = 'crud';
export const CREATE_PERMISSION = 'create';
export const READ_PERMISSION = 'read';
export const UPDATE_PERMISSION = 'update';
export const DELETE_PERMISSION = 'delete';

export const PERMISSIONS = {
  CRUD_PERMISSION,
  CREATE_PERMISSION,
  READ_PERMISSION,
  UPDATE_PERMISSION,
  DELETE_PERMISSION,
};

export const MOVE_EXTRA_ACTION = 'move';
export const SHARE_EXTRA_ACTION = 'share';
export const UPDATE_COMMAND_ROLE_EXTRA_ACTION = 'updateCommandRole';

export const EXTRA_ACTIONS = {
  MOVE_EXTRA_ACTION,
  SHARE_EXTRA_ACTION,
  UPDATE_COMMAND_ROLE_EXTRA_ACTION,
};
