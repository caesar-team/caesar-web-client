import React from 'react';
import styled from 'styled-components';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { Icon } from '../Icon';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  margin-left: 16px;
  font-weight: 600;
  text-transform: uppercase;
`;

const Description = styled.div`
  color: ${({ theme }) => theme.color.emperor};
  margin: 16px 0;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledButton = styled(Button)`
  margin-right: 20px;
`;

export const ConfirmModal = ({
  isOpened,
  title = 'Warning',
  description,
  icon,
  confirmBtnText = 'Confirm',
  onClickConfirm,
  onClickCancel,
}) => (
  <Modal
    isOpened={isOpened}
    shouldCloseOnEsc
    shouldCloseOnOverlayClick
    onRequestClose={onClickCancel}
  >
    <Wrapper>
      <Header>
        <Icon name="warning" width={20} height={20} color="black" />
        <Title>{title}</Title>
      </Header>
      <Description>{description}</Description>
      <ButtonsWrapper>
        <StyledButton color="white" onClick={onClickCancel}>
          Cancel
        </StyledButton>
        <Button icon={icon} onClick={onClickConfirm}>
          {confirmBtnText}
        </Button>
      </ButtonsWrapper>
    </Wrapper>
  </Modal>
);
