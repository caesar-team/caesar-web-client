import React from 'react';
import styled from 'styled-components';
import { Icon, Uploader } from '@caesar/components';
import IconTeam1 from '@caesar/assets/icons/svg/icon-team-ava-1.svg';
import IconTeam2 from '@caesar/assets/icons/svg/icon-team-ava-2.svg';
import IconTeam3 from '@caesar/assets/icons/svg/icon-team-ava-3.svg';
import IconTeam4 from '@caesar/assets/icons/svg/icon-team-ava-4.svg';
import IconTeam5 from '@caesar/assets/icons/svg/icon-team-ava-5.svg';
import { TEAM_AVATAR_MAX_SIZE } from '@caesar/common/constants';
import { ERROR } from '@caesar/common/validation';

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
    &:after {
      content: '';
      border: 2px solid ${({ theme }) => theme.color.black};
      height: 62px;
      border-radius: 100%;
      width: 62px;
    }
  }
`;

const IconStyled = styled(Icon)`
  width: 60px;
  height: 60px;
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

const UploaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  width: 60px;
  height: 60px;
  border: 1px solid ${({ theme }) => theme.color.gallery};
  cursor: pointer;
`;

const UploadedImageWrapper = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
`;

const UploadedImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
`;

const IconPlus = styled(Icon)`
  width: 20px;
  height: 20px;
`;

const Error = styled.div`
  width: 100%;
  margin-top: 8px;
  color: ${({ theme }) => theme.color.red};
`;

export const renderTeamAvatars = ({ icon }, setFieldValue) => {
  const renderedAvatars = Object.keys(IMAGE_NAME_BASE64_MAP).map(name => {
    const currentIcon = IMAGE_NAME_BASE64_MAP[name];
    const isActive = icon && currentIcon === icon.raw;

    return (
      <IconWrapper
        key={name}
        onClick={() => setFieldValue('icon', { name, raw: currentIcon })}
      >
        <IconStyled name={name} />
        {isActive && (
          <SelectedIconWrapper>
            <TopIconStyled name="checkmark" />
          </SelectedIconWrapper>
        )}
      </IconWrapper>
    );
  });

  const shouldShowUploader =
    (icon && IMAGE_BASE64_LIST.includes(icon.raw)) || !icon;

  const showErrors = rejectedFiles => {
    if (rejectedFiles.length > 0) {
      const errors = [];

      if (!rejectedFiles[0].type.includes('image/')) {
        errors.push(<Error>{ERROR.IMAGE_UPLOAD}</Error>);
      }

      if (rejectedFiles[0].size > TEAM_AVATAR_MAX_SIZE) {
        errors.push(
          <Error>
            {ERROR.FILE_SIZE(
              `${Math.round(TEAM_AVATAR_MAX_SIZE / 1024 / 1024)}MB`,
            )}
          </Error>
        );
      }

      return errors;
    }

    return null;
  };

  return (
    <AvatarsWrapper>
      {renderedAvatars}
      {shouldShowUploader ? (
        <Uploader
          asPreview
          name="icon"
          accept="image/*"
          maxSize={TEAM_AVATAR_MAX_SIZE}
          files={icon ? [icon] : []}
          onChange={(_, file) => setFieldValue('icon', file)}
        >
          {({ getRootProps, getInputProps, isDragActive, rejectedFiles }) => (
            <>
              <UploaderWrapper {...getRootProps()} isDragActive={isDragActive}>
                <input {...getInputProps()} />
                <IconPlus name="plus" />
              </UploaderWrapper>
              {showErrors(rejectedFiles)}
            </>
          )}
        </Uploader>
      ) : (
        <UploadedImageWrapper>
          <UploadedImage src={icon.raw} />
          <SelectedIconWrapper>
            <TopIconStyled name="checkmark" />
          </SelectedIconWrapper>
        </UploadedImageWrapper>
      )}
    </AvatarsWrapper>
  );
};
