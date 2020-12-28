import React, { useRef, memo } from 'react';
import Cropper from 'react-cropper';
import styled from 'styled-components';
import { Modal, ModalTitle } from '../Modal';
import { Button } from '../Button';

import 'cropperjs/dist/cropper.css';
import './cropper.overrides.css';

const ImageWrapper = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
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

const getRoundedCanvas = sourceCanvas => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const { width, height } = sourceCanvas;

  canvas.width = width;
  canvas.height = height;
  context.imageSmoothingEnabled = true;
  context.drawImage(sourceCanvas, 0, 0, width, height);
  context.globalCompositeOperation = 'destination-in';
  context.beginPath();
  context.arc(
    width / 2,
    height / 2,
    Math.min(width, height) / 2,
    0,
    2 * Math.PI,
    true,
  );
  context.fill();

  return canvas;
};

const CropModalComponent = ({
  src = null,
  handleClickAccept = Function.prototype,
  onCancel = Function.prototype,
}) => {
  const handleChoosePicture = () => {
    // TODO
    console.log('handleChoosePicture');
  };

  const resultRef = useRef(null);
  const cropperRef = useRef(null);

  const onCrop = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;

    let croppedCanvas = null;
    let roundedCanvas = null;
    let roundedImage = null;

    // Crop
    croppedCanvas = cropper.getCroppedCanvas();

    // Round
    roundedCanvas = getRoundedCanvas(croppedCanvas);

    // Show
    roundedImage = document.createElement('img');
    roundedImage.src = roundedCanvas.toDataURL();

    resultRef.current.innerHTML = '';
    resultRef.current.appendChild(roundedImage);

    // TODO
    // handleClickAccept()
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
      <ImageWrapper>
        <Cropper
          src={src}
          style={{
            width: '100%',
          }}
          guides={false}
          // TODO: Add custom cropper by max width or height of image
          aspectRatio={1 / 1}
          viewMode={2}
          background={false}
          ref={cropperRef}
        />
      </ImageWrapper>
      <ButtonsWrapper>
        <LeftButton color="white" onClick={handleChoosePicture}>
          Choose a picture
        </LeftButton>
        <StyledButton color="white" onClick={onCancel}>
          Cancel
        </StyledButton>
        <StyledButton onClick={onCrop}>Accept</StyledButton>
      </ButtonsWrapper>
      <div ref={resultRef} />
    </Modal>
  );
};

export const CropModal = memo(CropModalComponent);
