import React from 'react';
import styled from 'styled-components';
import { Modal } from '../Modal';
import { Button } from '../Button';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background-color: ${({ theme }) => theme.color.black};
  border-radius: 50%;

  &:before {
    content: '!';
    position: absolute;
    color: ${({ theme }) => theme.color.white};
    top: -2px;
    left: 6px;
  }
`;

const Title = styled.div`
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.color.black};
  margin-left: 10px;
  text-transform: uppercase;
`;

const Description = styled.div`
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.color.emperor};
  margin-top: 26px;
  margin-bottom: 35px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledButton = styled(Button)`
  margin-right: 20px;
`;

const ConfirmModal = ({
  isOpen,
  title = 'Warning',
  description,
  onClickOk,
  onClickCancel,
}) => (
  <Modal
    isOpen={isOpen}
    shouldCloseOnEsc
    shouldCloseOnOverlayClick
    onRequestClose={onClickCancel}
  >
    <Wrapper>
      <Header>
        <Icon />
        <Title>{title}</Title>
      </Header>
      <Description>{description}</Description>
      <ButtonsWrapper>
        <StyledButton color="white" onClick={onClickCancel}>
          CANCEL
        </StyledButton>
        <Button icon="trash" onClick={onClickOk}>
          REMOVE
        </Button>
      </ButtonsWrapper>
    </Wrapper>
  </Modal>
);

export default ConfirmModal;
