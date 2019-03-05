import React, { Component } from 'react';
import styled from 'styled-components';
import { getList } from 'common/api';
import { matchStrict } from 'common/utils/match';
import { Layout, Credentials, Document, withNotification } from 'components';
import {
  ITEM_CREDENTIALS_TYPE,
  ITEM_DOCUMENT_TYPE,
  ITEM_REVIEW_MODE,
} from 'common/constants';
import { getPrivateKeyObj, decryptItem } from 'common/utils/cipherUtils';

const Wrapper = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const getInboxItem = list => {
  if (!list || !list[0] || !list[0].children || !list[0].children[0]) {
    return null;
  }

  return list[0].children[0];
};

class Sharing extends Component {
  state = this.prepareInitialState();

  async componentDidMount() {
    const { privateKey, password } = this.props;

    const { data: list } = await getList();

    const item = getInboxItem(list);

    const privateKeyObj = await getPrivateKeyObj(privateKey, password);
    const decryptedSecret = await decryptItem(item.secret, privateKeyObj);

    this.setState({
      item: { ...item, secret: decryptedSecret, mode: ITEM_REVIEW_MODE },
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
        [ITEM_CREDENTIALS_TYPE]: (
          <Credentials isSharedItem item={item} notification={notification} />
        ),
        [ITEM_DOCUMENT_TYPE]: (
          <Document isSharedItem item={item} notification={notification} />
        ),
      },
      null,
    );

    return (
      <Layout>
        <Wrapper>{renderedItem}</Wrapper>
      </Layout>
    );
  }
}

export default withNotification(Sharing);
