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

const IMAGE_NAME_BASE64_MAP = [
  { name: 'team-ava-1', raw: IconTeam1 },
  { name: 'team-ava-2', raw: IconTeam2 },
  { name: 'team-ava-3', raw: IconTeam3 },
  { name: 'team-ava-4', raw: IconTeam4 },
  { name: 'team-ava-5', raw: IconTeam5 },
];

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

const TopIconStyled = styled(Icon)`
  width: 12px;
  height: 12px;
  fill: ${({ theme }) => theme.color.white};
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
  IMAGE_NAME_BASE64_MAP.map(({ name, raw }) => {
    const isActive = raw === icon;

    return (
      <IconWrapper key={name} onClick={() => handleChangeIcon({ raw })}>
        <IconStyled name={name} />
        {isActive && (
          <SelectedIconWrapper>
            <TopIconStyled name="checkmark" />
          </SelectedIconWrapper>
        )}
      </IconWrapper>
    );
  });

export const renderTeamAvatars = ({
  touched = {},
  values: { icon = null } = {},
  errors = {},
  setFieldValue,
  setFieldTouched,
}) => {
  const initValue = useMemo(() => icon, []);
  const [isCropModalOpened, setCropModalOpened] = useState(false);
  const [uploadedImageSrc, setUploadedImageSrc] = useState(icon);
  const [cropModalSrc, setCropModalSrc] = useState(null);
  const isDefaultIcon = icon && IMAGE_BASE64_LIST.includes(icon);
  const isCustomIcon = icon && !isDefaultIcon;
  const shouldShowUploader = isDefaultIcon || !uploadedImageSrc;
  const customIconError = useMemo(
    () => (touched?.icon ? errors?.icon || null : null),
    [touched, errors],
  );

  const handleChangeIcon = useCallback(
    value => {
      const { raw } = value;

      if (raw === icon) return;

      setCropModalSrc(null);
      setFieldValue('icon', raw, true);
      setFieldTouched('icon');

      if (!IMAGE_BASE64_LIST.includes(raw)) {
        setCropModalSrc(raw);
        setCropModalOpened(true);
      }
    },
    [icon],
  );

  const handleAcceptCroppedImage = raw => {
    setFieldValue('icon', raw, true);
    setFieldTouched('icon');
    setUploadedImageSrc(raw);
    setCropModalOpened(false);
    setCropModalSrc(null);
  };

  const handleCloseCropModal = () => {
    setCropModalOpened(false);
    setCropModalSrc(null);
    setFieldValue('icon', initValue || null, true);
    setFieldTouched('icon', false);
  };

  useUpdateEffect(() => {
    if (customIconError) {
      setCropModalOpened(false);
      setCropModalSrc(null);
    }
  }, [customIconError]);

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
            files={icon ? [icon] : []}
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
              <TopIconStyled name="checkmark" />
            </SelectedIconWrapper>
          </UploadedImageWrapper>
        </UploaderHoverableWrapper>
      </AvatarsWrapper>
      {customIconError && <Error>{customIconError}</Error>}
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
