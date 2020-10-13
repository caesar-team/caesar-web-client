import React, { Component, memo } from 'react';
import { getLists } from '@caesar/common/api';
import { SharingLayout } from '@caesar/components';
import { ItemByType } from '@caesar/components/Item/ItemByType';
import { LIST_TYPE, PERMISSION_ENTITY } from '@caesar/common/constants';
import {
  unsealPrivateKeyObj,
  decryptItem,
} from '@caesar/common/utils/cipherUtils';

const getInboxItem = list => {
  const inbox = list.find(({ type }) => type === LIST_TYPE.INBOX);

  if (!inbox || !inbox.children) {
    return null;
  }

  return inbox.children[0];
};

class SharingComponent extends Component {
  state = this.prepareInitialState();

  async componentDidMount() {
    const { privateKey, password } = this.props;

    const { data: list } = await getLists();

    const item = getInboxItem(list);

    const privateKeyObj = await unsealPrivateKeyObj(privateKey, password);
    const decryptedSecret = await decryptItem(item.secret, privateKeyObj);

    this.setState({
      item: { ...item, data: decryptedSecret },
    });
  }

  prepareInitialState() {
    return {
      item: null,
    };
  }

  render() {
    const { item } = this.state;

    if (!item) {
      return null;
    }

    const itemSubject = {
      __typename: PERMISSION_ENTITY.ITEM,
    };

    return (
      <SharingLayout>
        <ItemByType item={item} itemSubject={itemSubject} isSharedItem />
      </SharingLayout>
    );
  }
}

const Sharing = memo(SharingComponent);

export default Sharing;
