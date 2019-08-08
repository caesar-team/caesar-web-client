import React from 'react';
import styled from 'styled-components';
import copy from 'copy-text-to-clipboard';
import { APP_URI } from 'common/constants';
import { Button, withNotification } from 'components';
import ReadOnlyContentEditable from '../Common/ContentEditable';

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
const stripHtml = html => {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const getLinkText = (link, password) => `Please, follow the link and enter the password
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
URL: <strong>${APP_URI}/message/${link}</strong>
Password: <strong>${password}</strong>
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Securely created with ${APP_URI}`;

const SecureMessageLink = ({
  notification,
  link = '',
  password = '',
  onClickReturn,
}) => {
  const handleClickCopy = (data, notify) => {
    copy(stripHtml(data));

    notification.show({
      text: notify,
    });
    return false;
  };

  return (
    <Wrapper>
      <Text>Use the temporary encrypted link below to retrieve the secret</Text>
      <Link>
        <ReadOnlyContentEditable html={getLinkText(link, password)} />
      </Link>
      <ButtonsWrapper>
        <Button
          onClick={() =>
            handleClickCopy(
              getLinkText(link, password),
              'The link and password have copied!',
            )
          }
        >
          Copy All
        </Button>
        <Button
          onClick={() =>
            handleClickCopy(
              `${APP_URI}/message/${link}`,
              'The link have copied!',
            )
          }
        >
          Copy The Link
        </Button>
        <Button onClick={onClickReturn}>Create New Secure Message</Button>
      </ButtonsWrapper>
    </Wrapper>
  );
};

export default withNotification(SecureMessageLink);
