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
  LOG_LEVEL,
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

export const LIST_TYPE = {
  ROOT: 'root',
  INBOX: 'inbox',
  LIST: 'list',
  TRASH: 'trash',
  DEFAULT: 'default',
  FAVORITES: 'favorites',
};

export const DEFAULT_LIST_TYPES_ARRAY = [
  LIST_TYPE.ROOT,
  LIST_TYPE.INBOX,
  LIST_TYPE.TRASH,
  LIST_TYPE.DEFAULT,
  LIST_TYPE.FAVORITES,
];

export const LIST_TYPES_ARRAY = [...DEFAULT_LIST_TYPES_ARRAY, LIST_TYPE.LIST];

export const TEAM_TYPE = {
  DEFAULT: 'default',
  PERSONAL: 'personal',
};

export const TEAM_TEXT_TYPE = {
  [TEAM_TYPE.DEFAULT]: 'All users',
  [TEAM_TYPE.PERSONAL]: 'Personal',
};

export const DASHBOARD_MODE = {
  DEFAULT: 'DEFAULT_MODE',
  SEARCH: 'SEARCH_MODE',
  TOOL: 'SECURE_MESSAGE_MODE',
};

// mb some types are not included here, don't have enough information
export const ITEM_TYPE = {
  CREDENTIALS: 'credentials',
  CREDIT_CARD: 'card',
  DOCUMENT: 'document',
};

export const ITEM_TYPES_ARRAY = [
  ITEM_TYPE.CREDENTIALS,
  ITEM_TYPE.CREDIT_CARD,
  ITEM_TYPE.DOCUMENT,
];

export const ITEM_TEXT_TYPE = {
  [ITEM_TYPE.CREDENTIALS]: 'credential',
  [ITEM_TYPE.DOCUMENT]: 'note',
};

export const ITEM_ICON_TYPE = {
  [ITEM_TYPE.CREDENTIALS]: 'key',
  [ITEM_TYPE.DOCUMENT]: 'securenote',
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

export const INVITE_TYPE = 'invite';
export const SHARE_TYPE = 'share';

export const ROUTES = {
  MAIN: '/',
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  LOGOUT: '/logout',
  RESETTING: '/resetting',
  MESSAGE: '/message',
  SECURE: '/secure',
  SHARE: '/share',
  INVITE: '/invite',
  DASHBOARD: '/',
  SETTINGS: '/settings',
  IMPORT: '/import',
  TEAM: '/team',
  CREATE: '/create',
};

export const SHARED_ROUTES = [ROUTES.SHARE, ROUTES.INVITE];

// require bootstrap
// TODO: figure out better naming
export const LOCKED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.IMPORT,
  ROUTES.TEAM,
  ROUTES.CREATE,
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

export const TECH_ROUTES = [ROUTES.LOGOUT];

export const ENTITY_TYPE = {
  CHILD_ITEM: 'childItem',
  ITEM: 'item',
  LIST: 'list',
  TEAM: 'team',
  MEMBER: 'member',
};

export const ENCRYPTING_ITEM_NOTIFICATION = 'Encryption in progress...';
export const DECRYPTING_ITEM_NOTIFICATION = 'Decryption in progress...';
export const VERIFICATION_IN_PROGRESS_NOTIFICATION =
  'Verification in progress...';
export const CREATING_ITEM_NOTIFICATION = 'The item is being created...';
export const SHARING_IN_PROGRESS_NOTIFICATION = 'Sharing in progress...';
export const CREATING_ITEMS_NOTIFICATION =
  'Import in progress. The items are being created...';
export const MOVING_IN_PROGRESS_NOTIFICATION = 'Moving in progress...';
export const REMOVING_IN_PROGRESS_NOTIFICATION = 'Removing in progress...';
export const REDIRECT_NOTIFICATION = 'Redirecting...';
export const SAVE_NOTIFICATION = 'Saving...';
export const NOOP_NOTIFICATION = '';

export const UUID_REGEXP = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;

export const TEAM_AVATAR_MAX_SIZE = 8 * 1024 * 1024;

export const DEFAULT_ERROR_MESSAGE = 'Something wrong. Please try again';

export const PERMISSION = {
  CREATE: 'create',
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete',
  SORT: 'sort',
  MOVE: 'move',
  SHARE: 'share',
  FAVORITE: 'favorite',
  TRASH: 'trash',
  RESTORE: 'restore',
};

export const PERMISSION_ENTITY = {
  TEAM: 'team',
  TEAM_MEMBER: 'team_member',
  LIST: 'list',
  TEAM_LIST: 'team_list',
  ITEM: 'item',
  TEAM_ITEM: 'team_item',
};

export const PERMISSION_READ = 'read';
export const PERMISSION_WRITE = 'write';

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
