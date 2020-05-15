import React from 'react';
import styled from 'styled-components';
import { Checkbox } from '../../Checkbox';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ShareControl = () => {
  return (
    <Wrapper>
      {isInvited ? (
        <>
          <Checkbox checked={!!isReadOnly} onChange={onClickPermissionChange}>
            View only
          </Checkbox>
          <IconWrapper isFilled onClick={onClickRemove}>
            <StyledIcon isFilled name="checkmark" width={14} height={14} />
          </IconWrapper>
        </>
      ) : (
        <IconWrapper onClick={onClickAdd}>
          <StyledIcon name="plus" width={14} height={14} />
        </IconWrapper>
      )}
    </Wrapper>
  );
};

export default ShareControl;
