import React, { Component } from 'react';
import styled from 'styled-components';
import {
  Avatar,
  AvatarsList,
  Breadcrumbs,
  Button,
  File,
  Icon,
  Label,
} from 'components';
import { downloadFile } from 'common/utils/file';
import { copyToClipboard } from 'common/utils/clipboard';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TopRow = styled(Row)`
  padding: 4px 0;
`;

const InviteRow = styled(Row)`
  margin-top: 28px;
`;

const StyledButton = styled(Button)`
  margin-left: 20px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 36px;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.black};
`;

const UpdatedDate = styled.div`
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.emperor};
`;

const Owner = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 15px;
`;

const OwnerName = styled.div`
  font-size: 16px;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.black};
`;

const OwnerStatus = styled.div`
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.gray};
`;

const StyledAvatarsList = styled(AvatarsList)`
  margin-right: 30px;
`;

const StyledEyeIcon = styled(Icon)`
  margin-right: 22px;
  cursor: pointer;
  fill: ${({ theme }) => theme.gray};
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 36px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.gallery};
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FieldValue = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
  width: 100%;
  padding-left: 15px;
  margin-top: 12px;
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
  fill: ${({ theme }) => theme.gray};
`;

const AttachmentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 52px;
`;

const Attachments = styled.div`
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
  margin-bottom: 24px;
`;

const DownloadAll = styled.div`
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.black};
  cursor: pointer;
  margin-left: 10px;
`;

const StyledFile = styled(File)`
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 30px;
  }
`;

class Credentials extends Component {
  state = {
    isPasswordVisible: false,
  };

  handleTogglePasswordVisibility = () => {
    this.setState(prevState => ({
      isPasswordVisible: !prevState.isPasswordVisible,
    }));
  };

  handleCopy = field => () => {
    const {
      post: { secret },
    } = this.props;

    copyToClipboard(secret[field]);
  };

  handleClickDownloadFiles = () => {
    const {
      post: {
        secret: { attachments },
      },
    } = this.props;

    attachments.forEach(({ name, raw }) => downloadFile(raw, name));
  };

  handleClickDownloadFile = index => () => {
    const {
      post: {
        secret: { attachments },
      },
    } = this.props;

    const { raw, name } = attachments[index];

    downloadFile(raw, name);
  };

  render() {
    const { isPasswordVisible } = this.state;

    const {
      isTrashItem,
      allLists,
      members,
      itemPath,
      onClickCloseItem,
      onClickRemovePost,
      onClickEditPost,
      onClickInvite,
      onClickRestorePost,
      post: {
        listId,
        shared,
        owner: isOwner,
        secret: { name, login, pass, website, note, attachments },
      },
    } = this.props;

    const pwd = isPasswordVisible ? pass : pass.replace(/./g, '*');
    const avatars = shared.map(userId => members[userId]);
    const listName = allLists.find(({ id }) => id === listId).label;
    const eyeIconName = isPasswordVisible ? 'eye-off' : 'eye-on';

    const shouldShowWebsite = !!website;
    const shouldShowNote = !!note;
    const shouldShowAttachments = attachments.length > 0;

    const renderedAttachments = attachments.map((attachment, index) => (
      <StyledFile
        key={index}
        onClick={this.handleClickDownloadFile(index)}
        {...attachment}
      />
    ));

    return (
      <Wrapper>
        <TopRow>
          <Breadcrumbs list={itemPath} />
          <Row>
            {isTrashItem ? (
              <ButtonsWrapper>
                <Button color="white" onClick={onClickRestorePost}>
                  Restore
                </Button>
                <StyledButton
                  color="white"
                  icon="trash"
                  onClick={onClickRemovePost}
                >
                  Remove
                </StyledButton>
              </ButtonsWrapper>
            ) : (
              <Button color="white" icon="pencil" onClick={onClickEditPost}>
                Edit
              </Button>
            )}
            <StyledButton
              color="white"
              icon="close"
              onClick={onClickCloseItem}
            />
          </Row>
        </TopRow>
        <Row>
          <TitleWrapper>
            <Title>{name}</Title>
            <UpdatedDate>Last updated Nov 16, 2018 12:30 PM </UpdatedDate>
          </TitleWrapper>
          {/* TODO: Uncomment to show favorite icon */}
          {/* <Icon name="favorite" width={20} height={20} fill="#888" /> */}
        </Row>
        <InviteRow>
          <Row>
            <Avatar name="dspiridonov@4xxi.com" />
            <Owner>
              <OwnerName>James White</OwnerName>
              <OwnerStatus>owner</OwnerStatus>
            </Owner>
          </Row>
          <Row>
            <StyledAvatarsList avatars={avatars} />
            {!isTrashItem && (
              <Button color="black" onClick={onClickInvite}>
                INVITE
              </Button>
            )}
          </Row>
        </InviteRow>
        <FieldWrapper>
          <Field>
            <Label>Login</Label>
            <Row>
              <FieldValue>{login}</FieldValue>
              <StyledIcon
                name="copy"
                width={20}
                height={20}
                onClick={this.handleCopy('login')}
              />
            </Row>
          </Field>
          <Field>
            <Label>Password</Label>
            <Row>
              <FieldValue>{pwd}</FieldValue>
              <Row>
                <StyledEyeIcon
                  name={eyeIconName}
                  width={20}
                  height={20}
                  onClick={this.handleTogglePasswordVisibility}
                />
                <StyledIcon
                  name="copy"
                  width={20}
                  height={20}
                  onClick={this.handleCopy('pass')}
                />
              </Row>
            </Row>
          </Field>
          {shouldShowWebsite && (
            <Field>
              <Label>Website</Label>
              <FieldValue>{website}</FieldValue>
            </Field>
          )}
          <Field>
            <Label>List</Label>
            <FieldValue>{listName}</FieldValue>
          </Field>
          {shouldShowNote && (
            <Field>
              <Label>Note</Label>
              <FieldValue>{note}</FieldValue>
            </Field>
          )}
        </FieldWrapper>
        {shouldShowAttachments && (
          <AttachmentsWrapper>
            <Row>
              <Attachments>Attachments</Attachments>
              <Row>
                <Icon name="download" width={14} height={14} />
                <DownloadAll onClick={this.handleClickDownloadFiles}>
                  Download {attachments.length} files
                </DownloadAll>
              </Row>
            </Row>
            {renderedAttachments}
          </AttachmentsWrapper>
        )}
      </Wrapper>
    );
  }
}

export default Credentials;
