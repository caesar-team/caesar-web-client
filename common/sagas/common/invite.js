import { call } from '@redux-saga/core/effects';
import { generateInviteUrl } from 'common/utils/sharing';
import { objectToBase64 } from 'common/utils/base64';
import { postInvitationBatch } from 'common/api';

export function* inviteNewMemberBatchSaga({ payload: { members } }) {
  console.log('inviteNewMemberBatchSaga', members);

  try {
    const invites = members.map(({ email, password, masterPassword }) => ({
      email,
      url: generateInviteUrl(
        objectToBase64({
          e: email,
          p: password,
          mp: masterPassword,
        }),
      ),
    }));

    yield call(postInvitationBatch, { messages: invites });
  } catch (error) {
    console.log(error);
  }
}
