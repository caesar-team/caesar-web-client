export const INIT_WORKFLOW = '@workflow/INIT_WORKFLOW';
export const INIT_TEAMS = '@workflow/INIT_TEAMS';
export const INIT_SETTINGS = '@workflow/INIT_SETTINGS';
export const INIT_CREATE_PAGE = '@workflow/INIT_CREATE_PAGE';
export const INIT_DASHBOARD = '@workflow/INIT_DASHBOARD';
export const FINISH_PROCESSING_KEYPAIRS =
  '@workflow/FINISH_PROCESSING_KEYPAIRS';

export const FINISH_IS_LOADING = '@workflow/FINISH_IS_LOADING';
export const VAULTS_ARE_READY = '@workflow/VAULTS_ARE_READY';

export const SET_WORK_IN_PROGRESS_ITEM = '@workflow/SET_WORK_IN_PROGRESS_ITEM';
export const UPDATE_WORK_IN_PROGRESS_ITEM =
  '@workflow/UPDATE_WORK_IN_PROGRESS_ITEM';
export const UPDATE_WORK_IN_PROGRESS_ITEM_RAWS =
  '@workflow/UPDATE_WORK_IN_PROGRESS_ITEM_RAWS';
export const SET_WORK_IN_PROGRESS_ITEM_IDS =
  '@workflow/SET_WORK_IN_PROGRESS_ITEM_IDS';
export const SET_WORK_IN_PROGRESS_LIST_ID =
  '@workflow/SET_WORK_IN_PROGRESS_LIST_ID';

export const RESET_WORK_IN_PROGRESS_ITEM_IDS =
  '@workflow/RESET_WORK_IN_PROGRESS_ITEM_IDS';
export const RESET_WORKFLOW_STATE = '@workflow/RESET_WORKFLOW_STATE';

export const DECRYPTION = '@workflow/DECRYPTION';
export const DECRYPTION_END = '@workflow/DECRYPTION_END';
export const ENCRYPTION = '@workflow/ENCRYPTION';
export const ENCRYPTION_END = '@workflow/ENCRYPTION_END';

export const OPEN_VAULT = '@workflow/OPEN_VAULT';
export const OPEN_CURRENT_VAULT = '@workflow/OPEN_CURRENT_VAULT';

export const initWorkflow = (withDecryption = true) => ({
  type: INIT_WORKFLOW,
  payload: {
    withDecryption,
  },
});

export const initCreatePage = () => ({
  type: INIT_CREATE_PAGE,
});

export const initTeams = () => ({
  type: INIT_TEAMS,
});

export const initSettings = () => ({
  type: INIT_SETTINGS,
});

export const initDashboard = () => ({
  type: INIT_DASHBOARD,
});

export const finishProcessingKeyPairs = () => ({
  type: FINISH_PROCESSING_KEYPAIRS,
});

export const openVault = teamId => ({
  type: UPDATE_WORK_IN_PROGRESS_ITEM,
  payload: {
    teamId,
  },
});

export const openCurrentVault = () => ({
  type: OPEN_CURRENT_VAULT,
});

export const finishIsLoading = () => ({
  type: FINISH_IS_LOADING,
});

export const vaultsReady = () => ({
  type: VAULTS_ARE_READY,
});

export const setWorkInProgressItem = item => ({
  type: SET_WORK_IN_PROGRESS_ITEM,
  payload: {
    item,
  },
});

export const updateWorkInProgressItem = itemId => ({
  type: UPDATE_WORK_IN_PROGRESS_ITEM,
  payload: {
    itemId,
  },
});

export const updateWorkInProgressItemRaws = raws => ({
  type: UPDATE_WORK_IN_PROGRESS_ITEM_RAWS,
  payload: {
    raws,
  },
});

export const setWorkInProgressItemIds = itemIds => ({
  type: SET_WORK_IN_PROGRESS_ITEM_IDS,
  payload: {
    itemIds,
  },
});

export const setWorkInProgressListId = listId => ({
  type: SET_WORK_IN_PROGRESS_LIST_ID,
  payload: {
    listId,
  },
});

export const resetWorkInProgressItemIds = () => ({
  type: RESET_WORK_IN_PROGRESS_ITEM_IDS,
});

export const resetWorkflowState = () => ({
  type: RESET_WORKFLOW_STATE,
});

export const decryption = ({ items, raws, key, masterPassword }) => ({
  type: DECRYPTION,
  payload: {
    items,
    raws,
    key,
    masterPassword,
  },
});

export const decryptionEnd = (id, coresCount) => ({
  type: DECRYPTION_END,
  payload: {
    id,
    coresCount,
  },
});

export const encryption = ({ items }) => ({
  type: ENCRYPTION,
  payload: {
    items,
  },
});

export const encryptionEnd = (id, coresCount) => ({
  type: ENCRYPTION_END,
  payload: {
    id,
    coresCount,
  },
});
