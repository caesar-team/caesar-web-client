import React from 'react';
import {
  Wrapper,
  Title,
  OwnerAndInvitation,
  Row,
  Input,
  Note,
} from '../../ItemFields';

export const Credentials = ({ item }) => {
  const {
    data: { name, login, pass, website, note },
  } = item;

  return (
    <Wrapper>
      <Title value={name} />
      <OwnerAndInvitation />
      <Row>
        <Input label="Login" value={login} />
      </Row>
      <Row>
        <Input label="Password" value={pass} />
      </Row>
      <Row>
        <Input label="Website" value={website} />
      </Row>
      <Row marginBottom={24}>
        <Note value={note} />
      </Row>
    </Wrapper>
  );
};
