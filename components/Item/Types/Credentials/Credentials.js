import React, { Component } from 'react';
import styled from 'styled-components';
import { Avatar, AvatarsList, Button, File, Icon, Label } from 'components';
import { downloadFile } from 'common/utils/file';
import { formatDate } from 'common/utils/dateFormatter';
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

const InviteRow = styled(Row)`
  margin-top: 10px;
`;

const StyledButton = styled(Button)`
  margin-left: 20px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.div`
  padding: 4px 0;
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

const InviteButton = styled(Button)`
  text-transform: uppercase;
`;

const EditButton = styled(Button)`
  padding-right: 13px;
  padding-left: 13px;
  text-transform: uppercase;
`;

const StyledEyeIcon = styled(Icon)`
  margin-right: 20px;
  cursor: pointer;
  fill: ${({ theme }) => theme.gray};
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 55px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.gallery};
  margin-bottom: 24px;
  padding-bottom: 5px;

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
  padding: 0 15px;
  margin-top: 12px;
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
  fill: ${({ theme }) => theme.gray};
`;

const StyledWebsiteLink = styled.a`
  text-decoration: none;
  cursor: pointer;
  color: inherit;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.emperor};
  }
`;

const AttachmentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 52px;
`;

const AttachmentsHeaderRow = styled(Row)`
  align-items: flex-start;
`;

const Attachments = styled.div`
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
  margin-bottom: 24px;
`;

const StyledDownloadIcon = styled(Icon)`
  margin-right: 10px;
  vertical-align: baseline;
  transition: all 0.2s;
`;

const DownloadAll = styled.div`
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.black};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.emperor};

    svg {
      fill: ${({ theme }) => theme.emperor};
    }
  }
`;

const StyledFile = styled(File)`
  margin-bottom: 30px;
  margin-right: auto;
  padding-right: 10px;
  cursor: pointer;
  transition: all 0.2s;

  &:last-child {
    margin-bottom: 30px;
  }
`;

const FavoriteButton = styled.button`
  align-self: flex-start;
  margin-top: 20px;
  padding: 0;
  cursor: pointer;
  background: none;
  border: none;
  transition: 0.3s;

  &:hover {
    opacity: 0.75;
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
      onClickCloseItem,
      onClickRemovePost,
      onClickEditPost,
      onClickInvite,
      onClickRestorePost,
      post: {
        listId,
        lastUpdated,
        shared,
        favorite,
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
        <Row>
          <UpdatedDate>Last updated {formatDate(lastUpdated)}</UpdatedDate>
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
              <EditButton color="white" icon="pencil" onClick={onClickEditPost}>
                Edit
              </EditButton>
            )}
            <StyledButton
              color="white"
              icon="close"
              onClick={onClickCloseItem}
            />
          </Row>
        </Row>
        <Row>
          <Title>{name}</Title>
          <FavoriteButton>
            <Icon
              name={favorite ? 'favorite-active' : 'favorite'}
              width={20}
              height={20}
            />
          </FavoriteButton>
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
              <InviteButton color="black" onClick={onClickInvite}>
                Invite
              </InviteButton>
            )}
          </Row>
        </InviteRow>
        <FieldWrapper>
          <Field>
            <Label>Login</Label>
            <Row>
              <FieldValue>
                {login}
                <StyledIcon
                  name="copy"
                  width={19}
                  height={19}
                  onClick={this.handleCopy('login')}
                />
              </FieldValue>
            </Row>
          </Field>
          <Field>
            <Label>Password</Label>
            <Row>
              <FieldValue>
                {pwd}
                <Row>
                  <StyledEyeIcon
                    name={eyeIconName}
                    width={20}
                    height={20}
                    onClick={this.handleTogglePasswordVisibility}
                  />
                  <StyledIcon
                    name="copy"
                    width={19}
                    height={19}
                    onClick={this.handleCopy('pass')}
                  />
                </Row>
              </FieldValue>
            </Row>
          </Field>
          {shouldShowWebsite && (
            <Field>
              <Label>Website</Label>
              <FieldValue>
                <StyledWebsiteLink href={website} target="_blank">
                  {website}
                </StyledWebsiteLink>
              </FieldValue>
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
            <AttachmentsHeaderRow>
              <Attachments>Attachments</Attachments>
              <Row>
                <DownloadAll onClick={this.handleClickDownloadFiles}>
                  <StyledDownloadIcon name="download" width={14} height={14} />
                  Download {attachments.length} files
                </DownloadAll>
              </Row>
            </AttachmentsHeaderRow>
            {renderedAttachments}
          </AttachmentsWrapper>
        )}
      </Wrapper>
    );
  }
}

export default Credentials;
