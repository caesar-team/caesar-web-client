import { call } from '@redux-saga/core/effects';
import { generateInviteUrl } from '@caesar/common/utils/sharing';
import { objectToBase64 } from '@caesar/common/utils/base64';
import { postInvitationBatch } from '@caesar/common/api';

export function* inviteNewUserBatchSaga({ payload: { users } }) {
  try {
    const invites = users.map(
      ({ email, plainPassword: password, masterPassword }) => ({
        email,
        url: generateInviteUrl(
          objectToBase64({
            e: email,
            p: password,
            m: masterPassword,
          }),
        ),
      }),
    );

    yield call(postInvitationBatch, { messages: invites });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
