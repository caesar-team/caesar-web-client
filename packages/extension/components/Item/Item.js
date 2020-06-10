import React, { Fragment } from 'react';
import styled from 'styled-components';
import { ITEM_TYPE } from '@caesar-utils/constants';
import { matchStrict } from '@caesar-utils/utils/match';
import { Scrollbar } from '@caesar-ui';
import EmptyItem from './EmptyItem';
import { Credentials, Document } from './Types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  margin-top: 10px;
`;

const Item = ({ item }) => {
  if (!item) {
    return <EmptyItem />;
  }

  const { type } = item;

  const renderedItem = matchStrict(
    type,
    {
      [ITEM_TYPE.CREDENTIALS]: <Credentials item={item} />,
      [ITEM_TYPE.DOCUMENT]: <Document item={item} />,
    },
    null,
  );

  return (
    <Fragment>
      <Scrollbar>
        <Wrapper>{renderedItem}</Wrapper>
      </Scrollbar>
    </Fragment>
  );
};

export default Item;
