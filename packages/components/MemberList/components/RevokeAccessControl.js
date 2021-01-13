import React, { memo } from 'react';
import styled from 'styled-components';
import { Hint, HINT_POSITION } from '@caesar/components/Hint';
import { Icon } from '@caesar/components/Icon';

const RevokeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: ${({ theme }) => theme.color.black};
  border: none;
  border-radius: 50%;
  outline: none;
  cursor: pointer;
`;

const MinusIcon = styled.div`
  width: 12px;
  height: 2px;
  background-color: ${({ theme }) => theme.color.white};
  cursor: pointer;
`;

const ResendIcon = styled(Icon)`
  width: 20px;
  height: 20px;
`;

const RevokeAccessControlComponent = ({
  isAddedToRevoke,
  onClickRevoke,
  className,
}) => isAddedToRevoke
  ? (
    <Hint text="Resend" position={HINT_POSITION.CENTER_LEFT}>
      <ResendIcon name="update" onClick={onClickRevoke} />
    </Hint>
  ) : (
    <Hint text="Revoke access" position={HINT_POSITION.CENTER_LEFT}>
      <RevokeButton className={className} onClick={onClickRevoke}>
        <MinusIcon />
      </RevokeButton>
    </Hint>
  );

export const RevokeAccessControl = memo(RevokeAccessControlComponent);
