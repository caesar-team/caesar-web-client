import React from 'react';
import {
  Wrapper,
  Title,
  OwnerAndInvitation,
  Row,
  Note,
  Attachments,
  RemoveButton,
} from '../../ItemFields';

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
      {onClickMoveToTrash && (
        <Row>
          <RemoveButton onClick={onClickMoveToTrash} />
        </Row>
      )}
    </Wrapper>
  );
};
