import React, { useRef, memo } from 'react';
import Cropper from 'react-cropper';
import styled from 'styled-components';
import { Modal, ModalTitle } from '../Modal';
import { Button } from '../Button';
import { Uploader } from '../Uploader';

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
  handleChangeIcon = Function.prototype,
  handleClickAccept = Function.prototype,
  onCancel = Function.prototype,
}) => {
  const cropperRef = useRef(null);

  const onCrop = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;

    const croppedCanvas = cropper.getCroppedCanvas();
    const roundedCanvas = getRoundedCanvas(croppedCanvas);

    handleClickAccept(roundedCanvas.toDataURL());
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
            minWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
          guides={false}
          aspectRatio={1 / 1}
          viewMode={2}
          background={false}
          ref={cropperRef}
        />
      </ImageWrapper>
      <ButtonsWrapper>
        <Uploader
          name="icon"
          accept="image/*"
          files={[]}
          onChange={(_, file) => handleChangeIcon(file)}
        >
          {({ getRootProps, getInputProps }) => (
            <LeftButton color="white" {...getRootProps()}>
              <input {...getInputProps()} />
              Choose a picture
            </LeftButton>
          )}
        </Uploader>
        <StyledButton color="white" onClick={onCancel}>
          Cancel
        </StyledButton>
        <StyledButton onClick={onCrop}>Accept</StyledButton>
      </ButtonsWrapper>
    </Modal>
  );
};

export const CropModal = memo(CropModalComponent);
