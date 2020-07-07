import React from 'react';
import {
  Title,
  Input,
  Password,
  Website,
  Note,
  Attachments,
} from '../../ItemFields/view';
import { Wrapper, OwnerAndInvitation, Row, RemoveButton } from '../components';

export const Credentials = ({
  item,
  onClickAcceptEdit,
  onClickShare,
  onClickMoveToTrash,
}) => {
  const {
    data: { name, login, pass, website, note, attachments = [] },
  } = item;

  return (
    <Wrapper>
      <Title value={name} onClickAcceptEdit={onClickAcceptEdit} />
      <OwnerAndInvitation onClickShare={onClickShare} />
      <Row>
        <Input
          label="Login"
          name="login"
          value={login}
          onClickAcceptEdit={onClickAcceptEdit}
        />
      </Row>
      <Row>
        <Password value={pass} onClickAcceptEdit={onClickAcceptEdit} />
      </Row>
      <Row>
        <Website value={website} onClickAcceptEdit={onClickAcceptEdit} />
      </Row>
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
