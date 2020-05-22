import React from 'react';
import styled from 'styled-components';
import copy from 'copy-text-to-clipboard';
import { APP_URI } from '@caesar/common/constants';
import { media } from '@caesar/assets/styles/media';
import { Button, withNotification } from '@caesar/components';
import ReadOnlyContentEditable from '../Common/ContentEditable';

const Text = styled.div`
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.black};
`;

const Link = styled.div`
  position: relative;
  padding: 16px;
  margin-bottom: 24px;
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.gallery};
  border-radius: 4px;
  word-break: break-all;
  white-space: pre-wrap;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${media.wideMobile`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 16px;
  `}

  ${media.mobile`
    grid-template-columns: 1fr;
  `}
`;

const CopyAllButton = styled(Button)`
  margin-right: 24px;

  ${media.wideMobile`
    margin-right: 0;
  `}
`;

const CreateNewButton = styled(Button)`
  grid-area: 2 / 1 / 3 / 3;
  margin-left: auto;
  font-weight: 600;

  ${media.wideMobile`
    margin-left: 0;
  `}

  ${media.mobile`
    grid-area: auto;
  `}
`;

const stripHtml = html => {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const getLinkText = (
  link,
  password,
) => `Please, follow the link and enter the password
- - - - - - - - - - - - - - - - - - - - - - - - - -
URL: <strong>${APP_URI}/message/${link}</strong>
Password: <strong>${password}</strong>
- - - - - - - - - - - - - - - - - - - - - - - - - -
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
    <>
      <Text>Use the temporary encrypted link below to retrieve the secret</Text>
      <Link>
        <ReadOnlyContentEditable html={getLinkText(link, password)} />
      </Link>
      <ButtonsWrapper>
        <CopyAllButton
          icon="copy"
          onClick={() =>
            handleClickCopy(
              getLinkText(link, password),
              'The link and the password have been copied!',
            )
          }
        >
          Copy All
        </CopyAllButton>
        <Button
          icon="link"
          color="white"
          onClick={() =>
            handleClickCopy(
              `${APP_URI}/message/${link}`,
              'The link has been copied!',
            )
          }
        >
          Copy Link
        </Button>
        <CreateNewButton color="transparent" onClick={onClickReturn}>
          Create New Secure Message
        </CreateNewButton>
      </ButtonsWrapper>
    </>
  );
};

export default withNotification(SecureMessageLink);
