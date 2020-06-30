import React from 'react';
import {
  Wrapper,
  Title,
  OwnerAndInvitation,
  Row,
  Input,
  Password,
  Website,
  Note,
  Attachments,
  RemoveButton,
} from '../../ItemFields';

export const Credentials = ({ item, handleClickAcceptEdit, onClickRemove }) => {
  const {
    data: { name, login, pass, website, note, attachments = [] },
  } = item;

  return (
    <Wrapper>
      <Title value={name} handleClickAcceptEdit={handleClickAcceptEdit} />
      <OwnerAndInvitation />
      <Row>
        <Input
          label="Login"
          name="login"
          value={login}
          handleClickAcceptEdit={handleClickAcceptEdit}
        />
      </Row>
      <Row>
        <Password value={pass} handleClickAcceptEdit={handleClickAcceptEdit} />
      </Row>
      <Row>
        <Website
          value={website}
          handleClickAcceptEdit={handleClickAcceptEdit}
        />
      </Row>
      <Row marginBottom={24}>
        <Note value={note} handleClickAcceptEdit={handleClickAcceptEdit} />
      </Row>
      <Row marginBottom={24}>
        <Attachments
          attachments={attachments}
          handleClickAcceptEdit={handleClickAcceptEdit}
        />
      </Row>
      <Row>
        <RemoveButton onClick={onClickRemove} />
      </Row>
    </Wrapper>
  );
};
