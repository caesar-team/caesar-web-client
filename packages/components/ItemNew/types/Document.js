import React from 'react';
import { Title, Note, Attachments } from '../../ItemFields/view';
import { Row } from '../../ItemFields/common';
import { Wrapper, OwnerAndInvitation, RemoveButton, Meta } from '../components';

export const Document = ({
  item,
  onClickAcceptEdit,
  onClickShare,
  onClickMoveToTrash,
}) => {
  const {
    data: { name, note, attachments = [] },
  } = item;

  return (
    <Wrapper>
      <Title value={name} onClickAcceptEdit={onClickAcceptEdit} />
      <OwnerAndInvitation onClickShare={onClickShare} />
      <Row marginBottom={24}>
        <Note value={note} onClickAcceptEdit={onClickAcceptEdit} />
      </Row>
      <Row marginBottom={24}>
        <Attachments
          attachments={attachments}
          onClickAcceptEdit={onClickAcceptEdit}
        />
      </Row>
      <Meta item={item} />
      {onClickMoveToTrash && (
        <Row>
          <RemoveButton onClick={onClickMoveToTrash} />
        </Row>
      )}
    </Wrapper>
  );
};
