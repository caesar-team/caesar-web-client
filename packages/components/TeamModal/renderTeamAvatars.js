import React, { useState, useMemo, useCallback } from 'react';
import { useUpdateEffect } from 'react-use';
import styled from 'styled-components';
import IconTeam1 from '@caesar/assets/icons/svg/icon-team-ava-1.svg';
import IconTeam2 from '@caesar/assets/icons/svg/icon-team-ava-2.svg';
import IconTeam3 from '@caesar/assets/icons/svg/icon-team-ava-3.svg';
import IconTeam4 from '@caesar/assets/icons/svg/icon-team-ava-4.svg';
import IconTeam5 from '@caesar/assets/icons/svg/icon-team-ava-5.svg';
import { TextError as Error } from '../Error';
import { Icon } from '../Icon';
import { Uploader } from '../Uploader';
import { CropModal } from '../CropModal';

const IMAGE_BASE64_LIST = [
  IconTeam1,
  IconTeam2,
  IconTeam3,
  IconTeam4,
  IconTeam5,
];

const IMAGE_NAME_BASE64_MAP = {
  'team-ava-1': IconTeam1,
  'team-ava-2': IconTeam2,
  'team-ava-3': IconTeam3,
  'team-ava-4': IconTeam4,
  'team-ava-5': IconTeam5,
};

const AvatarsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 16px;
`;

const IconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 62px;
  height: 62px;

  &:hover {
    &::after {
      content: '';
      border: 2px solid ${({ theme }) => theme.color.black};
      height: 62px;
      border-radius: 100%;
      width: 62px;
    }
  }
`;

const IconStyled = styled(Icon)`
  width: 56px;
  height: 56px;
  cursor: pointer;
  position: absolute;
`;

const SelectedIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.color.black};
`;

const AddImgIcon = styled(Icon)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const UploaderWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border: 1px dashed ${({ theme }) => theme.color.gallery};
  border-radius: 50%;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.color.black};

    ${AddImgIcon} {
      color: ${({ theme }) => theme.color.black};
    }
  }
`;

const UploadedImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
`;

const UploadedImage = styled.img`
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 50%;
`;

const UploaderHoverableWrapper = styled.div`
  position: relative;
  width: 56px;
  height: 56px;

  ${UploaderWrapper} {
    display: ${({ shouldShowUploader }) =>
      shouldShowUploader ? 'block' : 'none'};
  }

  ${UploadedImageWrapper} {
    ${({ shouldShowUploader }) => shouldShowUploader && 'display: none;'}
  }

  &:hover {
    ${UploaderWrapper} {
      display: ${({ shouldShowUploader, shouldShowEdit }) =>
        shouldShowUploader || shouldShowEdit ? 'flex' : 'none'};
    }

    ${UploadedImageWrapper} {
      display: ${({ shouldShowUploader, shouldShowEdit }) =>
        shouldShowUploader || shouldShowEdit ? 'none' : 'flex'};
    }
  }
`;

const RenderedAvatars = ({ icon, handleChangeIcon }) =>
  Object.keys(IMAGE_NAME_BASE64_MAP).map(name => {
    const currentIcon = IMAGE_NAME_BASE64_MAP[name];
    const isActive = icon && currentIcon === icon.raw;

    return (
      <IconWrapper
        key={name}
        onClick={() => handleChangeIcon({ name, raw: currentIcon })}
      >
        <IconStyled name={name} />
        {isActive && (
          <SelectedIconWrapper>
            <Icon name="checkmark" width={12} height={12} color="white" />
          </SelectedIconWrapper>
        )}
      </IconWrapper>
    );
  });

export const renderTeamAvatars = ({
  touched = {},
  values: { icon = {} } = {},
  errors = {},
  setFieldValue,
  setFieldTouched,
}) => {
  const initValue = useMemo(() => icon.raw, []);
  const [isCropModalOpened, setCropModalOpened] = useState(false);
  const [uploadedImageSrc, setUploadedImageSrc] = useState(icon.raw || null);
  const [cropModalSrc, setCropModalSrc] = useState(null);
  const isDefaultIcon = icon.raw && IMAGE_BASE64_LIST.includes(icon.raw);
  const isCustomIcon = icon.raw && !isDefaultIcon;
  const shouldShowUploader = isDefaultIcon || !uploadedImageSrc;

  const handleChangeIcon = useCallback(value => {
    setCropModalSrc(null);
    setFieldValue('icon', value, true);
    setFieldTouched('icon');

    if (!IMAGE_BASE64_LIST.includes(value.raw)) {
      setCropModalSrc(value.raw);
      setCropModalOpened(true);
    }
  }, []);

  const handleAcceptCroppedImage = raw => {
    setFieldValue('icon', { raw }, true);
    setFieldTouched('icon');
    setUploadedImageSrc(raw);
    setCropModalOpened(false);
    setCropModalSrc(null);
  };

  const handleCloseCropModal = () => {
    setCropModalOpened(false);
    setCropModalSrc(null);
    setFieldValue('icon', { raw: initValue || null }, true);
    setFieldTouched('icon', false);
  };

  useUpdateEffect(() => {
    if (errors?.icon?.raw) {
      setCropModalOpened(false);
      setCropModalSrc(null);
    }
  }, [errors]);

  return (
    <>
      <AvatarsWrapper>
        <RenderedAvatars icon={icon} handleChangeIcon={handleChangeIcon} />
        <UploaderHoverableWrapper
          shouldShowUploader={shouldShowUploader}
          shouldShowEdit={isCustomIcon}
        >
          <Uploader
            name="icon"
            accept="image/*"
            files={icon?.raw ? [icon] : []}
            onChange={(_, file) => handleChangeIcon(file)}
          >
            {({ getRootProps, getInputProps, isDragActive }) => (
              <UploaderWrapper {...getRootProps()} isDragActive={isDragActive}>
                <input {...getInputProps()} />
                {isCustomIcon ? (
                  <AddImgIcon
                    name="pencil"
                    color="gray"
                    width={16}
                    height={16}
                  />
                ) : (
                  <AddImgIcon name="plus" color="gray" width={16} height={16} />
                )}
              </UploaderWrapper>
            )}
          </Uploader>
          <UploadedImageWrapper>
            <UploadedImage src={uploadedImageSrc} />
            <SelectedIconWrapper>
              <Icon name="checkmark" width={12} height={12} color="white" />
            </SelectedIconWrapper>
          </UploadedImageWrapper>
        </UploaderHoverableWrapper>
      </AvatarsWrapper>
      {touched?.icon && errors?.icon?.raw && <Error>{errors?.icon?.raw}</Error>}
      {isCropModalOpened && (
        <CropModal
          src={cropModalSrc}
          handleChangeIcon={handleChangeIcon}
          handleClickAccept={handleAcceptCroppedImage}
          onCancel={handleCloseCropModal}
        />
      )}
    </>
  );
};
