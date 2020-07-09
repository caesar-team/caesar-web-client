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
} from '../../ItemFields';

export const Credentials = ({ item }) => {
  const {
    data: { name, login, pass, website, note, attachments = [] },
  } = item;

  return (
    <Wrapper>
      <Title value={name} />
      <OwnerAndInvitation />
      <Row>
        <Input label="Login" value={login} />
      </Row>
      <Row>
        <Password value={pass} />
      </Row>
      <Row>
        <Website value={website} />
      </Row>
      <Row marginBottom={24}>
        <Note value={note} />
      </Row>
      <Row marginBottom={24}>
        <Attachments attachments={attachments} />
      </Row>
    </Wrapper>
  );
};
