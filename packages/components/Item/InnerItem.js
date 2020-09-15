/* eslint-disable camelcase */
import React from 'react';
import styled from 'styled-components';
import { PERMISSION } from '@caesar/common/constants';
import { Can } from '../Ability';
import { Scrollbar } from '../Scrollbar';
import { Row } from '../ItemFields/common';
import { ItemByType } from './ItemByType';
import { InnerWrapper, RemoveButton, Meta } from './components';

const StyledInnerWrapper = styled(InnerWrapper)`
  transition: opacity 0.2s, filter 0.2s;

  ${({ isDragActive }) =>
    isDragActive &&
    `
      opacity: 60%;
      filter: blur(20px);
  `}
`;

export const InnerItem = ({
  item,
  itemSubject,
  isTrashItem,
  isDragActive,
  handleClickAcceptEdit,
  onClickShare,
  onClickMoveToTrash,
}) => (
  <StyledInnerWrapper isDragActive={isDragActive}>
    <Scrollbar>
      <ItemByType
        item={item}
        itemSubject={itemSubject}
        onClickAcceptEdit={!isTrashItem && handleClickAcceptEdit}
        onClickShare={onClickShare}
      />
      <Meta item={item} />
      <Can I={PERMISSION.TRASH} an={itemSubject}>
        {!isTrashItem && (
          <Row>
            <RemoveButton onClick={onClickMoveToTrash} />
          </Row>
        )}
      </Can>
    </Scrollbar>
  </StyledInnerWrapper>
);
