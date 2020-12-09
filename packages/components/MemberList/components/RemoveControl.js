import React, { memo } from 'react';
import styled from 'styled-components';
import { Hint } from '../../Hint';
import { Icon } from '../../Icon';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const CloseIcon = styled(Icon)`
  margin-left: 16px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

const StyledHint = styled(Hint)`
  margin-left: 16px;
`;

const WarningIcon = styled(Icon)`
  cursor: pointer;
`;

const RemoveControlComponent = ({ member, onClick, className }) => (
  <Wrapper>
    {member.isNew && (
      <StyledHint
        text="User isn’t registered in your domain"
        position="center_left"
      >
        <WarningIcon name="warning" width={20} height={20} />
      </StyledHint>
    )}
    <CloseIcon
      name="close"
      width={16}
      height={16}
      color="gray"
      className={className}
      onClick={onClick}
    />
  </Wrapper>
);

export const RemoveControl = memo(RemoveControlComponent);
