import React, { Component } from 'react';
import { getLists } from '@caesar/common/api';
import { matchStrict } from '@caesar/common/utils/match';
import {
  SharingLayout,
  Credentials,
  Document,
  withNotification,
} from '@caesar/components';
import { LIST_TYPE, ITEM_TYPE, ITEM_MODE } from '@caesar/common/constants';
import {
  getPrivateKeyObj,
  decryptItem,
} from '@caesar/common/utils/cipherUtils';

const getInboxItem = list => {
  const inbox = list.find(({ type }) => type === LIST_TYPE.INBOX);

  if (!inbox || !inbox.children) {
    return null;
  }

  return inbox.children[0];
};

class Sharing extends Component {
  state = this.prepareInitialState();

  async componentDidMount() {
    const { privateKey, password } = this.props;

    const { data: list } = await getLists();

    const item = getInboxItem(list);

    const privateKeyObj = await getPrivateKeyObj(privateKey, password);
    const decryptedSecret = await decryptItem(item.secret, privateKeyObj);

    this.setState({
      item: { ...item, data: decryptedSecret, mode: ITEM_MODE.REVIEW },
    });
  }

  prepareInitialState() {
    return {
      item: null,
      user: null,
    };
  }

  render() {
    const { notification } = this.props;
    const { item } = this.state;

    if (!item) {
      return null;
    }

    const renderedItem = matchStrict(
      item.type,
      {
        [ITEM_TYPE.CREDENTIALS]: (
          <Credentials isSharedItem item={item} notification={notification} />
        ),
        [ITEM_TYPE.DOCUMENT]: (
          <Document isSharedItem item={item} notification={notification} />
        ),
      },
      null,
    );

    return <SharingLayout>{renderedItem}</SharingLayout>;
  }
}

export default withNotification(Sharing);
