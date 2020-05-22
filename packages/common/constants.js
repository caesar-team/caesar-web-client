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
  AUTHORIZATION_ENABLE,
  APP_TYPE,
  APP_VERSION,
  IS_PROD,
} = publicRuntimeConfig;

export const PWA_WINDOW_SIZE = {
  width: '600',
  height: '750',
};
export const IS_AUTHORIZATION_ENABLE =
  typeof AUTHORIZATION_ENABLE === 'undefined' ? true : AUTHORIZATION_ENABLE;

export const IS_SECURE_APP = APP_TYPE === 'secure';
export const IS_EXTENSION_APP = APP_TYPE === 'extension';
export const IS_GENERAL_APP = APP_TYPE === 'general';

export const PORTAL_ID = 'portal';

export const DEFAULT_IDLE_TIMEOUT = 5 * 60 * 1000;
export const DEFAULT_CORES_COUNT = 4;

export const DECRYPTION_CHUNK_SIZE = 25;
export const ENCRYPTION_CHUNK_SIZE = 25;

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

export const ROUTES = {
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  LOGOUT: '/logout',
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

export const ENCRYPTING_ITEM_NOTIFICATION = 'Encryption in progress...';
export const CREATING_ITEM_NOTIFICATION = 'The item is being created...';
export const SHARING_IN_PROGRESS_NOTIFICATION = 'Sharing in progress...';
export const CREATING_ITEMS_NOTIFICATION =
  'Import in progress. The items are being created..';
export const MOVING_IN_PROGRESS_NOTIFICATION = 'Moving in progress...';
export const REMOVING_IN_PROGRESS_NOTIFICATION = 'Removing in progress...';
export const NOOP_NOTIFICATION = '';

export const ENTITIES = {
  CHILD_ITEM_ENTITY_TYPE,
  ITEM_ENTITY_TYPE,
  LIST_ENTITY_TYPE,
  TEAM_ENTITY_TYPE,
  MEMBER_ENTITY_TYPE,
};

// casl permissions
export const CRUD_PERMISSION = 'crud';
export const CREATE_PERMISSION = 'create';
export const READ_PERMISSION = 'read';
export const UPDATE_PERMISSION = 'update';
export const DELETE_PERMISSION = 'delete';

// custom permissions
export const CHANGE_TEAM_MEMBER_ROLE_PERMISSION = 'changeRole';
export const JOIN_MEMBER_TO_TEAM = 'joinMember';
export const LEAVE_MEMBER_FROM_TEAM = 'leaveMember';
export const MOVE_ITEM_PERMISSION = 'moveItem';
export const SHARE_ITEM_PERMISSION = 'share';

export const PERMISSIONS = {
  CRUD_PERMISSION,
  CREATE_PERMISSION,
  READ_PERMISSION,
  UPDATE_PERMISSION,
  DELETE_PERMISSION,

  CHANGE_TEAM_MEMBER_ROLE_PERMISSION,
  MOVE_ITEM_PERMISSION,
  JOIN_MEMBER_TO_TEAM,
  LEAVE_MEMBER_FROM_TEAM,
  SHARE_ITEM_PERMISSION,
};
