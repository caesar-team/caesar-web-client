import React, { memo } from 'react';
import { SCHEMA } from '@caesar/common/validation';
import { TEAM_TYPE } from '@caesar/common/constants';
import { Title, Note, Attachments } from '../../ItemFields/view';
import { Row } from '../../ItemFields/common';
import { OwnerAndShares } from '../components';
import { DummyDocument } from './DummyDocument';

const DocumentComponent = ({
  isDummy,
  item,
  itemSubject,
  onClickAcceptEdit,
  onClickShare,
  isSharedItem = false,
  isVisibleDragZone,
}) => {
  if (isDummy || !item.data) {
    return <DummyDocument isSharedItem />;
  }

  const { name, note, attachments, raws } = item.data;

  return (
    <>
      <Title
        value={name}
        itemSubject={itemSubject}
        schema={SCHEMA.REQUIRED_LIMITED_STRING()}
        onClickAcceptEdit={onClickAcceptEdit}
        marginBottom={isSharedItem ? 24 : 0}
      />
      {!isSharedItem && (
        <OwnerAndShares
          showShares={item.teamId === TEAM_TYPE.PERSONAL}
          invited={item.invited}
          itemSubject={itemSubject}
          onClickShare={onClickShare}
        />
      )}
      <Row marginBottom={24}>
        <Note
          value={note}
          itemSubject={itemSubject}
          onClickAcceptEdit={onClickAcceptEdit}
        />
      </Row>
      <Row marginBottom={24}>
        <Attachments
          attachments={attachments}
          raws={raws}
          itemSubject={itemSubject}
          onClickAcceptEdit={onClickAcceptEdit}
          isVisibleDragZone={isVisibleDragZone}
        />
      </Row>
    </>
  );
};

export const Document = memo(DocumentComponent);
