import React, { memo } from 'react';
import styled from 'styled-components';
import { Hint } from '@caesar/components/Hint';
import { Icon } from '@caesar/components/Icon';

const RevokeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background-color: ${({ theme }) => theme.color.black};
  border: none;
  border-radius: 50%;
  outline: none;
  cursor: pointer;
`;

const MinusIcon = styled.div`
  width: 14px;
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
    <Hint text="Resend">
      <ResendIcon name="update" />
    </Hint>
  ) : (
    <Hint text="Revoke access">
      <RevokeButton className={className} onClick={onClickRevoke}>
        <MinusIcon />
      </RevokeButton>
    </Hint>
  );

export const RevokeAccessControl = memo(RevokeAccessControlComponent);
