import React from 'react';
import styled from 'styled-components';
import copy from 'copy-text-to-clipboard';
import { APP_URI } from 'common/constants';
import { Button, withNotification } from 'components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Text = styled.div`
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
  margin-bottom: 20px;
`;

const Link = styled.div`
  position: relative;
  padding: 15px 20px;
  background-color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.gallery};
  border-radius: 3px;
  word-break: break-all;
  white-space: pre-wrap;
  margin-bottom: 20px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const getLinkText = (link, password) => `Follow the link and enter the password
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
URL: ${APP_URI}/message/${link}
Password: ${password}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Securely created with https://caesarapp.4xxi.com
`;

const SecureMessageLink = ({
  notification,
  link = '4cc372f3-0a84-4d64-8f09-f14cb8d9ca22',
  password = 'yXzLy&73-',
  onClickReturn,
}) => {
  const handleClickCopy = () => {
    copy(getLinkText(link, password));

    notification.show({
      text: 'Link has copied.',
    });
  };

  return (
    <Wrapper>
      <Text>Use the temporary encrypted link below to retrieve the secret</Text>
      <Link>{getLinkText(link, password)}</Link>
      <ButtonsWrapper>
        <Button onClick={handleClickCopy}>Copy All</Button>
        <Button onClick={onClickReturn}>Create New Secure Message</Button>
      </ButtonsWrapper>
    </Wrapper>
  );
};

export default withNotification(SecureMessageLink);
