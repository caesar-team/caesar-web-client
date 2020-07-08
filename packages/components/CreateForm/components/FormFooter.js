import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { ROUTES } from '@caesar/common/constants';
import { AppVersion } from '../../AppVersion';
import { Button } from '../../Button';

const Wrapper = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 24px;
  background-color: ${({ theme }) => theme.color.white};
`;

const StyledAppVersion = styled(AppVersion)`
  position: absolute;
  left: 24px;
  bottom: 24px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  max-width: 848px;
  padding: 0 24px;
  margin: 0 auto;
`;

const StyledButton = styled(Button)`
  margin-right: 16px;
`;

export const FormFooter = ({ onSubmit }) => {
  const { push } = useRouter();

  const handleClickCancel = () => {
    push(ROUTES.DASHBOARD);
  };

  return (
    <Wrapper>
      <StyledAppVersion />
      <ButtonsWrapper>
        <StyledButton color="white" onClick={handleClickCancel}>
          Cancel
        </StyledButton>
        <Button onClick={onSubmit}>Create</Button>
      </ButtonsWrapper>
    </Wrapper>
  );
};
