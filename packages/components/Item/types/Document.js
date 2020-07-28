import React from 'react';
import { Title, Note, Attachments } from '../../ItemFields/view';
import { Row } from '../../ItemFields/common';
import { Meta, OwnerAndInvitation } from '../components';

export const Document = ({
  item,
  itemSubject,
  onClickAcceptEdit,
  onClickShare,
  isSharedItem,
}) => {
  const {
    data: { name, note, attachments = [] },
  } = item;

  return (
    <>
      <Title value={name} onClickAcceptEdit={onClickAcceptEdit} />
      {!isSharedItem && (
        <OwnerAndInvitation
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
          itemSubject={itemSubject}
          onClickAcceptEdit={onClickAcceptEdit}
        />
      </Row>
      <Meta item={item} />
    </>
  );
};
