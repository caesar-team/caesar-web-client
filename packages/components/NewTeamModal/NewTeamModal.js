import React, { Component } from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import {
  Modal,
  FormInput,
  Button,
  Label,
  Icon,
  Uploader,
} from '@caesar/components';
import { checkError } from '@caesar/common/utils/formikUtils';
import IconTeam1 from '@caesar/assets/icons/svg/icon-team-ava-1.svg';
import IconTeam2 from '@caesar/assets/icons/svg/icon-team-ava-2.svg';
import IconTeam3 from '@caesar/assets/icons/svg/icon-team-ava-3.svg';
import IconTeam4 from '@caesar/assets/icons/svg/icon-team-ava-4.svg';
import IconTeam5 from '@caesar/assets/icons/svg/icon-team-ava-5.svg';
import { schema } from './schema';

const FormTitle = styled.div`
  padding-bottom: 25px;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.black};
  text-transform: uppercase;
`;

const GroupAvatarsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const GroupAvatarsTitle = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.color.emperor};
`;

const GroupAvatarsTip = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.color.gray};
`;

const AvatarsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const ButtonWrapper = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
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
  border-radius: 100%;
`;

const UploadedImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
`;

const IconPlus = styled(Icon)`
  width: 20px;
  height: 20px;
`;

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

class NewTeamModal extends Component {
  createInitialValue = () => ({ title: '', icon: undefined });

  handleSubmit = ({ title, icon }) => {
    const { onSubmit } = this.props;

    onSubmit({ title, icon: icon.raw });
  };

  renderTeamAvatars({ icon }, setFieldValue) {
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

    return (
      <AvatarsWrapper>
        {renderedAvatars}
        {shouldShowUploader ? (
          <Uploader
            asPreview
            name="icon"
            files={icon ? [icon] : []}
            onChange={(_, file) => setFieldValue('icon', file)}
          >
            {({ getRootProps, getInputProps, isDragActive }) => (
              <UploaderWrapper {...getRootProps()} isDragActive={isDragActive}>
                <input {...getInputProps()} />
                <IconPlus name="plus" />
              </UploaderWrapper>
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
  }

  render() {
    const { onCancel = Function.prototype } = this.props;

    return (
      <Modal
        isOpen
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
        width="560"
        onRequestClose={onCancel}
      >
        <FormTitle>Add Team</FormTitle>
        <Formik
          key="editTeamForm"
          initialValues={this.createInitialValue()}
          onSubmit={this.handleSubmit}
          validationSchema={schema}
        >
          {({
            values,
            errors,
            touched,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            isValid,
          }) => (
            <form onSubmit={handleSubmit}>
              <Label>Group name</Label>
              <FastField name="title">
                {' '}
                {({ field }) => (
                  <FormInput
                    autoFocus
                    withBorder
                    {...field}
                    error={checkError(touched, errors, 'title')}
                  />
                )}
              </FastField>
              <GroupAvatarsWrapper>
                <GroupAvatarsTitle>Group avatar</GroupAvatarsTitle>
                <GroupAvatarsTip>
                  Choose an avatar or upload (160x160 pixels, not more than 8
                  MB)
                </GroupAvatarsTip>
                {this.renderTeamAvatars(values, setFieldValue)}
              </GroupAvatarsWrapper>
              <ButtonWrapper>
                <Button
                  disabled={isSubmitting || !isValid}
                  color="black"
                  onClick={handleSubmit}
                >
                  CREATE
                </Button>
              </ButtonWrapper>
            </form>
          )}
        </Formik>
      </Modal>
    );
  }
}

export default NewTeamModal;
