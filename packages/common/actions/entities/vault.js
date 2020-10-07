export const FETCH_VAULTS_REQUEST = '@team/FETCH_VAULTS_REQUEST';
export const FETCH_VAULTS_SUCCESS = '@team/FETCH_VAULTS_SUCCESS';
export const FETCH_VAULTS_FAILURE = '@team/FETCH_VAULTS_FAILURE';

export const FETCH_VAULT_REQUEST = '@team/FETCH_VAULT_REQUEST';
export const FETCH_VAULT_SUCCESS = '@team/FETCH_VAULT_SUCCESS';
export const FETCH_VAULT_FAILURE = '@team/FETCH_VAULT_FAILURE';

export const CREATE_VAULT_REQUEST = '@team/CREATE_VAULT_REQUEST';
export const CREATE_VAULT_SUCCESS = '@team/CREATE_VAULT_SUCCESS';
export const CREATE_VAULT_FAILURE = '@team/CREATE_VAULT_FAILURE';

export const CREATE_VAULT_KEYS_REQUEST = '@team/CREATE_VAULT_KEYS_REQUEST';
export const CREATE_VAULT_KEYS_SUCCESS = '@team/CREATE_VAULT_KEYS_SUCCESS';
export const CREATE_VAULT_KEYS_FAILURE = '@team/CREATE_VAULT_KEYS_FAILURE';

export const EDIT_VAULT_REQUEST = '@team/EDIT_VAULT_REQUEST';
export const EDIT_VAULT_SUCCESS = '@team/EDIT_VAULT_SUCCESS';
export const EDIT_VAULT_FAILURE = '@team/EDIT_VAULT_FAILURE';

export const REMOVE_VAULT_REQUEST = '@team/REMOVE_VAULT_REQUEST';
export const REMOVE_VAULT_SUCCESS = '@team/REMOVE_VAULT_SUCCESS';
export const REMOVE_VAULT_FAILURE = '@team/REMOVE_VAULT_FAILURE';

export const UPDATE_VAULT_MEMBERS_WITH_ROLES =
  '@team/UPDATE_VAULT_MEMBERS_WITH_ROLES';

export const UPDATE_VAULT_MEMBER_ROLE_REQUEST =
  '@team/UPDATE_VAULT_MEMBER_ROLE_REQUEST';
export const UPDATE_VAULT_MEMBER_ROLE_SUCCESS =
  '@team/UPDATE_VAULT_MEMBER_ROLE_SUCCESS';
export const UPDATE_VAULT_MEMBER_ROLE_FAILURE =
  '@team/UPDATE_VAULT_MEMBER_ROLE_FAILURE';

export const ADD_VAULT_MEMBERS_BATCH_REQUEST =
  '@team/ADD_VAULT_MEMBERS_BATCH_REQUEST';
export const ADD_VAULT_MEMBERS_BATCH_SUCCESS =
  '@team/ADD_VAULT_MEMBERS_BATCH_SUCCESS';
export const ADD_VAULT_MEMBERS_BATCH_FAILURE =
  '@team/ADD_VAULT_MEMBERS_BATCH_FAILURE';

export const REMOVE_VAULT_MEMBER_REQUEST = '@team/REMOVE_VAULT_MEMBER_REQUEST';
export const REMOVE_VAULT_MEMBER_SUCCESS = '@team/REMOVE_VAULT_MEMBER_SUCCESS';
export const REMOVE_VAULT_MEMBER_FAILURE = '@team/REMOVE_VAULT_MEMBER_FAILURE';

export const ADD_VAULTS_BATCH = '@team/ADD_VAULTS_BATCH';
export const ADD_VAULT_MEMBER = '@team/ADD_VAULT_MEMBER';

export const fetchVaultsRequest = () => ({
  type: FETCH_VAULTS_REQUEST,
});

export const fetchVaultsSuccess = vaultsById => ({
  type: FETCH_VAULTS_SUCCESS,
  payload: {
    vaultsById,
  },
});

export const fetchVaultsFailure = () => ({
  type: FETCH_VAULTS_FAILURE,
});

export const fetchVaultRequest = teamId => ({
  type: FETCH_VAULT_REQUEST,
  payload: {
    teamId,
  },
});

export const fetchVaultSuccess = team => ({
  type: FETCH_VAULT_SUCCESS,
  payload: {
    team,
  },
});

export const fetchVaultFailure = () => ({
  type: FETCH_VAULT_FAILURE,
});

export const createVaultRequest = (
  title,
  icon,
  handleCloseModal,
  setSubmitting,
  setErrors,
) => ({
  type: CREATE_VAULT_REQUEST,
  payload: {
    title,
    icon,
  },
  meta: {
    handleCloseModal,
    setSubmitting,
    setErrors,
  },
});

export const createVaultSuccess = team => ({
  type: CREATE_VAULT_SUCCESS,
  payload: {
    team,
  },
});

export const createVaultFailure = () => ({
  type: CREATE_VAULT_FAILURE,
});

export const createVaultKeysRequest = team => {
  return {
    type: CREATE_VAULT_KEYS_REQUEST,
    payload: {
      team,
    },
  };
};

export const createVaultKeysSuccess = vault => ({
  type: CREATE_VAULT_KEYS_SUCCESS,
  payload: {
    vault,
  },
});

export const createVaultKeysFailure = () => ({
  type: CREATE_VAULT_KEYS_FAILURE,
});

export const editVaultRequest = (
  teamId,
  title,
  icon,
  handleCloseModal,
  setSubmitting,
  setErrors,
) => ({
  type: EDIT_VAULT_REQUEST,
  payload: {
    teamId,
    title,
    icon,
  },
  meta: {
    handleCloseModal,
    setSubmitting,
    setErrors,
  },
});

export const editVaultSuccess = team => ({
  type: EDIT_VAULT_SUCCESS,
  payload: {
    team,
  },
});

export const editVaultFailure = () => ({
  type: EDIT_VAULT_FAILURE,
});

export const removeVaultRequest = teamId => ({
  type: REMOVE_VAULT_REQUEST,
  payload: {
    teamId,
  },
});

export const removeVaultSuccess = teamId => ({
  type: REMOVE_VAULT_SUCCESS,
  payload: {
    teamId,
  },
});

export const removeVaultFailure = () => ({
  type: REMOVE_VAULT_FAILURE,
});

export const updateVaultMemberRoleRequest = (teamId, userId, role) => ({
  type: UPDATE_VAULT_MEMBER_ROLE_REQUEST,
  payload: {
    teamId,
    userId,
    role,
  },
});

export const updateVaultMemberRoleSuccess = (teamId, userId, role) => ({
  type: UPDATE_VAULT_MEMBER_ROLE_SUCCESS,
  payload: {
    teamId,
    userId,
    role,
  },
});

export const updateVaultMemberRoleFailure = () => ({
  type: UPDATE_VAULT_MEMBER_ROLE_FAILURE,
});

export const addVaultMembersBatchRequest = (teamId, members) => ({
  type: ADD_VAULT_MEMBERS_BATCH_REQUEST,
  payload: {
    teamId,
    members,
  },
});

export const addVaultMembersBatchSuccess = (teamId, members) => ({
  type: ADD_VAULT_MEMBERS_BATCH_SUCCESS,
  payload: {
    teamId,
    members,
  },
});

export const addVaultMembersBatchFailure = () => ({
  type: ADD_VAULT_MEMBERS_BATCH_FAILURE,
});

export const removeVaultMemberRequest = (teamId, userId) => ({
  type: REMOVE_VAULT_MEMBER_REQUEST,
  payload: {
    teamId,
    userId,
  },
});

export const removeVaultMemberSuccess = (teamId, userId) => ({
  type: REMOVE_VAULT_MEMBER_SUCCESS,
  payload: {
    teamId,
    userId,
  },
});

export const removeVaultMemberFailure = () => ({
  type: REMOVE_VAULT_MEMBER_FAILURE,
});

export const addVaultsBatch = vaultsById => ({
  type: ADD_VAULTS_BATCH,
  payload: {
    vaultsById,
  },
});

export const addMemberToVaultList = (teamId, userId, role) => ({
  type: ADD_VAULT_MEMBER,
  payload: {
    teamId,
    userId,
    role,
  },
});

export const updateVaultMembersWithRoles = (teamId, members) => ({
  type: UPDATE_VAULT_MEMBERS_WITH_ROLES,
  payload: {
    teamId,
    members,
  },
});
