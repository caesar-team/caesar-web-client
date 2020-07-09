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
  handleClickAcceptEdit,
  onClickShare,
  onClickMoveToTrash,
}) => {
  const {
    data: { name, note, attachments = [] },
  } = item;

  return (
    <Wrapper>
      <Title value={name} handleClickAcceptEdit={handleClickAcceptEdit} />
      <OwnerAndInvitation onClickShare={onClickShare} />
      <Row marginBottom={24}>
        <Note value={note} handleClickAcceptEdit={handleClickAcceptEdit} />
      </Row>
      <Row marginBottom={24}>
        <Attachments
          attachments={attachments}
          handleClickAcceptEdit={handleClickAcceptEdit}
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
