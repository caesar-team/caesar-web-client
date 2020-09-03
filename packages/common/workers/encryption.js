import { expose } from 'threads/worker';
import { encryptItem } from '@caesar/common/utils/cipherUtils';

// eslint-disable-next-line
self.window = self;

const encryption = {
  async encryptAll(pairs) {
    // eslint-disable-next-line
    return await Promise.all(
      pairs.map(async ({ item, user }) => {
        const {
          id,
          data,
          raws = {},
        } = item;
        const encryptedItemData = await encryptItem(data, user.publicKey);

        const encryptedItem = {
          data: encryptedItemData,
          raws: Object.keys(raws).length
            ? await encryptItem(raws, user.publicKey)
            : null,
        };

        return {
          itemId: id,
          userId: user.id,
          teamId: user.teamId,
          secret: JSON.stringify(encryptedItem),
        };
      }),
    );
  },
};

expose(encryption);
