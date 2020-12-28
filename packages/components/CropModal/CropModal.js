import React, { memo } from 'react';
import styled from 'styled-components';
import { Modal, ModalTitle } from '../Modal';
import { Button } from '../Button';

const ImageWrapper = styled.div`
  width: 100%;
  height: 400px;
  border: 1px solid black; // TODO: Remove this prop
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 16px;
`;

const LeftButton = styled(Button)`
  margin-right: auto;
`;

const StyledButton = styled(Button)`
  margin-left: 16px;
`;

const CropModalComponent = ({
  handleClickAccept = Function.prototype,
  onCancel = Function.prototype,
}) => {
  const handleChoosePicture = () => {
    console.log('handleChoosePicture');
  };

  return (
    <Modal
      isOpened
      onRequestClose={onCancel}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
      width={640}
    >
      <ModalTitle>Crop the image</ModalTitle>
      <ImageWrapper />
      <ButtonsWrapper>
        <LeftButton color="white" onClick={handleChoosePicture}>
          Choose a picture
        </LeftButton>
        <StyledButton color="white" onClick={onCancel}>
          Cancel
        </StyledButton>
        <StyledButton onClick={handleClickAccept}>Accept</StyledButton>
      </ButtonsWrapper>
    </Modal>
  );
};

export const CropModal = memo(CropModalComponent);
