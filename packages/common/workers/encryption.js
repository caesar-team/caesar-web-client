import { expose } from 'threads/worker';
import { encryptData } from '@caesar/common/utils/cipherUtils';
import { isGeneralItem } from '../utils/item';

// eslint-disable-next-line
self.window = self;

const encryption = {
  async encryptAll(items) {
    // eslint-disable-next-line
    return await Promise.all(
      items.map(async ({ item, user }) => {
        const { id, data, raws = {} } = item;
        const encryptedItemData = await encryptData(data, user.publicKey);

        if (isGeneralItem(item)) {
          return {
            itemId: id,
            userId: user.id,
            teamId: user.teamId,
            secret: JSON.stringify({ data: encryptedItemData }),
            raws: Object.keys(raws).length
              ? await encryptData(raws, user.publicKey)
              : null,
          };
        }

        return {
          itemId: id,
          userId: user.id,
          teamId: user.teamId,
          secret: JSON.stringify({
            data: encryptedItemData,
            raws: Object.keys(raws).length
              ? await encryptData(raws, user.publicKey)
              : null,
          }),
        };
      }),
    );
  },
};

expose(encryption);
