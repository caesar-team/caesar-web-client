import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { AvatarsList } from '../AvatarsList';

const ControlPanel = styled.div`
  display: flex;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 32px;
`;

const StyledAvatarsList = styled(AvatarsList)`
  margin-right: 20px;
`;

const AvatarsWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const ButtonsInnerWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const StyledButton = styled(Button)`
  margin-left: 20px;
`;

const Panel = ({
  isTrashPost = false,
  isOwner = false,
  avatars = [],
  onClickRestorePost = Function.prototype,
  onClickRemovePost = Function.prototype,
  onClickEditPost = Function.prototype,
  onClickShare = Function.prototype,
}) => (
  <ControlPanel>
    {avatars.length > 0 && (
      <AvatarsWrapper>
        <StyledAvatarsList avatars={avatars} />
      </AvatarsWrapper>
    )}
    <ButtonsWrapper>
      {isOwner ? (
        <Button type="primary" size="large" onClick={onClickShare}>
          Invite
        </Button>
      ) : (
        <div />
      )}
      {isTrashPost ? (
        <ButtonsInnerWrapper>
          <Button size="large" icon="redo" onClick={onClickRestorePost}>
            Restore
          </Button>
          <StyledButton
            type="danger"
            size="large"
            icon="delete"
            onClick={onClickRemovePost}
          >
            Remove
          </StyledButton>
        </ButtonsInnerWrapper>
      ) : (
        <Button size="large" icon="edit" onClick={onClickEditPost}>
          Edit
        </Button>
      )}
    </ButtonsWrapper>
  </ControlPanel>
);

export default Panel;
