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
  DOMAIN_HOSTNAME,
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

export const FINGERPRINT = 'trustedDevice';

export const PORTAL_ID = 'portal';

export const DEFAULT_IDLE_TIMEOUT = 5 * 60 * 1000;
export const DEFAULT_CORES_COUNT = 4;

export const DECRYPTION_CHUNK_SIZE = 25;
export const ENCRYPTION_CHUNK_SIZE = 25;
export const IMPORT_CHUNK_SIZE = 100;
export const REMOVE_CHUNK_SIZE = 50;

export const LIST_TYPE = {
  INBOX: 'inbox',
  LIST: 'list',
  TRASH: 'trash',
  DEFAULT: 'default',
  FAVORITES: 'favorites',
};

export const NOT_SELECTABLE_LIST_TYPES = [
  LIST_TYPE.INBOX,
  LIST_TYPE.TRASH,
  LIST_TYPE.FAVORITES,
];

export const DEFAULT_LIST_TYPES_ARRAY = [
  ...NOT_SELECTABLE_LIST_TYPES,
  LIST_TYPE.DEFAULT,
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
  SYSTEM: 'system',
  KEYPAIR: 'keypair',
};

export const ITEM_TYPES_ARRAY = [
  ITEM_TYPE.CREDENTIALS,
  ITEM_TYPE.CREDIT_CARD,
  ITEM_TYPE.DOCUMENT,
];

export const ITEM_CONTENT_TYPE = {
  [ITEM_TYPE.CREDENTIALS]: 'credential',
  [ITEM_TYPE.DOCUMENT]: 'note',
};

export const ITEM_TEXT_TYPE = {
  [ITEM_TYPE.CREDENTIALS]: 'password',
  [ITEM_TYPE.DOCUMENT]: 'secure note',
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
  SECURE: '/secure',
  SECURE_MESSAGE: '/s/m/[id]',
  SHARE: '/share',
  INVITE: '/invite',
  DASHBOARD: '/',
  SETTINGS: '/settings',
  IMPORT: '/import',
  TEAM: '/team',
  USERS: '/users',
  CREATE: '/create',
  BOOTSTRAP: '/user/security/bootstrap',
  TWOFA: '/auth/2fa',
  PREREFENCES: '/preferences',
};

export const DOMAIN_SECURE_ROUTE = IS_SECURE_APP ? ROUTES.MAIN : ROUTES.SECURE;

export const SHARED_ROUTES = [ROUTES.SHARE, ROUTES.INVITE];

// require bootstrap
// TODO: figure out better naming

export const LOCKED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.IMPORT,
  ROUTES.PREREFENCES,
  ROUTES.TEAM,
  ROUTES.USERS,
  ROUTES.CREATE,
  ROUTES.BOOTSTRAP,
  ROUTES.TWOFA,
];

// don't require bootstrap routes
// TODO: figure out better naming
export const UNLOCKED_ROUTES = [
  ROUTES.SIGN_IN,
  ROUTES.SIGN_UP,
  ROUTES.RESETTING,
  ROUTES.SECURE_MESSAGE,
  ROUTES.SECURE,
  ROUTES.SHARE,
  ROUTES.INVITE,
];

export const TECH_ROUTES = [ROUTES.LOGOUT];

export const ENTITY_TYPE = {
  ITEM: 'item',
  LIST: 'list',
  TEAM: 'team',
  MEMBER: 'member',
  USER: 'user',
  SYSTEM: 'system',
  SHARE: 'share',
  KEYPAIR: 'keypair',
};

export const COMMON_PROGRESS_NOTIFICATION = 'In progress...';
export const ENCRYPTING_ITEM_NOTIFICATION = 'Encryption in progress...';
export const DECRYPTING_ITEM_NOTIFICATION = 'Decryption in progress...';
export const VERIFICATION_IN_PROGRESS_NOTIFICATION =
  'Verification in progress...';
export const CREATING_ITEM_NOTIFICATION = 'The item is being created...';
export const SHARING_IN_PROGRESS_NOTIFICATION = 'Sharing in progress...';
export const CREATING_ITEMS_NOTIFICATION =
  'Import in progress. The items are being created...';
export const FEATURE_IS_UNDER_DEVELOPMENT =
  'Caution! This feature is under development';
export const MOVING_IN_PROGRESS_NOTIFICATION = 'Moving in progress...';
export const REMOVING_IN_PROGRESS_NOTIFICATION = 'Removing in progress...';
export const REDIRECT_NOTIFICATION = 'Redirecting...';
export const SAVE_NOTIFICATION = 'Saving...';
export const NOOP_NOTIFICATION = '';

export const UUID_REGEXP = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;
export const SECURE_MESSAGE_REGEXP = /(\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b)+,(.*)/;

export const GOOD_PASSWORD_SCORE = 3;

export const DEFAULT_ERROR_MESSAGE = 'Something wrong. Please, try again';

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
  MULTISELECT: 'multiselect',
  CRUD: 'crud',
  PIN: 'pin',
  LEAVE: 'leave',
};

export const PERMISSION_ENTITY = {
  TEAM: 'team',
  TEAM_MEMBER: 'team_member',
  LIST: 'list',
  TEAM_LIST: 'team_list',
  ITEM: 'item',
  TEAM_ITEM: 'team_item',
  DOMAIN: 'domain',
};

export const TEAM_ROLES = {
  ROLE_ADMIN: 'ROLE_ADMIN',
  ROLE_MEMBER: 'ROLE_MEMBER',
  ROLE_GUEST: 'ROLE_GUEST',
};

export const TEAM_ROLES_LABELS = {
  ROLE_ADMIN: 'Admin',
  ROLE_MEMBER: 'Member',
  ROLE_GUEST: 'Guest',
};

export const DOMAIN_ROLES = {
  ROLE_ADMIN: 'ROLE_ADMIN',
  ROLE_MANAGER: 'ROLE_MANAGER',
  ROLE_USER: 'ROLE_USER',
  ROLE_READ_ONLY_USER: 'ROLE_READ_ONLY_USER',
  ROLE_ANONYMOUS_USER: 'ROLE_ANONYMOUS_USER',
};

export const DOMAIN_ROLES_LABELS = {
  ROLE_ADMIN: 'Admin',
  ROLE_MANAGER: 'Manager',
  ROLE_USER: 'Member',
  ROLE_READ_ONLY_USER: 'Guest',
  ROLE_ANONYMOUS_USER: 'Anonym',
};

export const TEAM_ROLES_OPTIONS = [
  {
    value: TEAM_ROLES.ROLE_ADMIN,
    label: TEAM_ROLES_LABELS.ROLE_ADMIN,
  },
  {
    value: TEAM_ROLES.ROLE_MEMBER,
    label: TEAM_ROLES_LABELS.ROLE_MEMBER,
  },
];

export const PERMISSION_MESSAGES = {
  FORBIDDEN_SELECT: "You don't have permissions to select the item",
};

export const KEY_TYPE = {
  PERSONAL: 'personal',
  ENTITY: 'entity',
  TEAMS: 'teams',
  SHARES: 'shares',
  ANONYMOUS: 'anonymous',
};

export const TEAM_MESSAGES = {
  PIN: 'Enable/disable display the team in the list',
};

export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const REGEXP_TESTER = {
  SYSTEM: {
    IS_SHARE: name =>
      /\b(share)-[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/.test(
        name,
      ),
    IS_TEAM: name =>
      /\b(team)-[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/.test(
        name,
      ),
  },
};

export const REGEXP_MATCHER = {
  SYSTEM: {
    ITEM_ID: stringData =>
      stringData
        ? stringData?.match(
            /\b(share|team)-([0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12})\b/,
          )[1] || null
        : null,
  },
};

export const REGEXP_EXCTRACTOR = {
  ID: stringData =>
    stringData ? stringData?.match(UUID_REGEXP)[0] || null : null,
};

export const IMPORT_PROGRESS_THRESHOLD = 0.99999;
