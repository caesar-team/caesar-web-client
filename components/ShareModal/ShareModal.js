import React, { Component } from 'react';
import styled from 'styled-components';
import {
  Icon,
  Modal,
  ModalTitle,
  Button,
  Checkbox,
  ShareInput,
  Toggle,
} from 'components';
import { copyToClipboard } from 'common/utils/clipboard';
import { base64ToObject, objectToBase64 } from 'common/utils/cipherUtils';
import { generateSharingUrl } from 'common/utils/sharing';

const ModalDescription = styled.div`
  padding-bottom: 20px;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.black};
`;

const Row = styled.div`
  margin-bottom: 20px;
`;

const LinkRow = styled.div`
  margin-top: 20px;
`;

const ToggleLabel = styled.label`
  display: inline-flex;
  align-items: center;
`;

const ToggleLabelText = styled.span`
  padding-left: 10px;
  font-size: 14px;
`;

const SharedItem = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 15px;
  background-color: ${({ theme }) => theme.snow};
  margin-bottom: 5px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SharedItemEmail = styled.div`
  margin-right: auto;
  font-size: 16px;
  color: ${({ theme }) => theme.black};
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SharedItemRemove = styled.button`
  border: none;
  background: none;
  padding: 4px;
  margin-left: 20px;
  color: ${({ theme }) => theme.gray};
  cursor: pointer;
  transition: 0.25s;

  &:hover {
    color: ${({ theme }) => theme.black};
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledButton = styled(Button)`
  margin-left: 20px;
  text-transform: uppercase;
`;

const SharedLinkWrapper = styled.div`
  max-width: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.snow};
  border-radius: 3px;
`;

const SharedLink = styled.div`
  position: relative;
  padding: 15px 20px;
  background-color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.gallery};
  border-radius: 3px;
  word-break: break-all;
  white-space: pre-wrap;
`;

const SharedLinkActions = styled.div`
  display: flex;
  align-items: center;
  padding-top: 20px;
`;

const SharedLinkActionsButtons = styled.div`
  display: flex;
  margin-left: auto;
`;

const SharedLinkActionsButton = styled(Button)`
  text-transform: uppercase;
  margin-left: 20px;
`;

const EmailBox = styled(SharedItem)`
  background-color: ${({ theme }) => theme.lightBlue};
`;

const getEncryption = link => link.match(/\/([\w|+-]+)$/)[1];
const getShareId = link => link.match(/share\/(.+)\//)[1];

const getAnonymousLink = shared =>
  (shared.find(({ link }) => !!link) || {}).link;

export class ShareModal extends Component {
  state = this.prepareInitialState();

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.isLoading && !!getAnonymousLink(nextProps.shared)) {
      return {
        isLoading: false,
      };
    }

    return null;
  }

  handleShareByLinkChange = () => {
    const {
      shared,
      onActivateSharedByLink,
      onDeactivateSharedByLink,
    } = this.props;

    const link = getAnonymousLink(shared);

    if (!link) {
      this.setState(
        {
          isLoading: true,
        },
        onActivateSharedByLink,
      );
    } else {
      onDeactivateSharedByLink();
    }
  };

  handleToggleSeparateLink = () => {
    this.setState(prevState => ({
      isUseMasterPassword: !prevState.isUseMasterPassword,
    }));
  };

  handleCopySharedLink = () => {
    const { isUseMasterPassword } = this.state;
    const { notification, shared } = this.props;

    copyToClipboard(
      this.generateLinkText(getAnonymousLink(shared), isUseMasterPassword),
    );

    notification.show({
      text: `Shared link has copied.`,
    });
  };

  handleShare = () => {
    const { onShare } = this.props;
    const { emails } = this.state;

    return onShare && onShare(emails);
  };

  handleAddEmail = email => {
    this.setState(prevState => ({
      emails: [...prevState.emails, email],
    }));
  };

  handleRemoveEmail = email => () => {
    this.setState(prevState => ({
      emails: prevState.emails.filter(oldEmail => oldEmail !== email),
    }));
  };

  generateLinkText(link, isUseMasterPassword) {
    const linkObj = base64ToObject(getEncryption(link));

    if (!isUseMasterPassword) {
      return link;
    }

    const { mp, ...linkData } = linkObj;

    return `${generateSharingUrl(
      getShareId(link),
      objectToBase64(linkData),
    )}\nMaster password: ${mp}`;
  }

  prepareInitialState() {
    return {
      emails: [],
      isUseMasterPassword: false,
      isLoading: false,
    };
  }

  renderEmails() {
    const { emails } = this.state;

    return emails.map((email, index) => (
      <EmailBox key={index}>
        <SharedItemEmail>{email}</SharedItemEmail>
        <SharedItemRemove>
          <Icon
            name="close"
            width={14}
            height={14}
            isInButton
            onClick={this.handleRemoveEmail(email)}
          />
        </SharedItemRemove>
      </EmailBox>
    ));
  }

  render() {
    const { isUseMasterPassword, isLoading } = this.state;
    const { onCancel, shared } = this.props;

    const link = getAnonymousLink(shared);
    const switcherText = link ? 'Link access enabled' : 'Link access disabled';
    const linkText = link
      ? this.generateLinkText(link, isUseMasterPassword)
      : '';

    return (
      <Modal
        isOpen
        width={640}
        onRequestClose={onCancel}
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
      >
        <ModalTitle>Share</ModalTitle>
        <ModalDescription>
          Share item will be available in read mode
        </ModalDescription>
        <Row>
          <ShareInput onChange={this.handleAddEmail} />
        </Row>
        {this.renderEmails()}
        {/* {this.renderWaitingUsers()} */}
        {/* {this.renderSharedUsers()} */}
        <LinkRow>
          <ToggleLabel>
            <Toggle
              value={!!link}
              isLoading={isLoading}
              onChange={this.handleShareByLinkChange}
            />
            <ToggleLabelText>{switcherText}</ToggleLabelText>
          </ToggleLabel>
        </LinkRow>
        {link && (
          <Row>
            <SharedLinkWrapper>
              <SharedLink>{linkText}</SharedLink>
              <SharedLinkActions>
                <Checkbox
                  checked={isUseMasterPassword}
                  onChange={this.handleToggleSeparateLink}
                >
                  Use master password
                </Checkbox>
                <SharedLinkActionsButtons>
                  {/* <SharedLinkActionsButton color="white" icon="mail"> */}
                  {/* Send email */}
                  {/* </SharedLinkActionsButton> */}
                  <SharedLinkActionsButton
                    color="white"
                    icon="copy"
                    onClick={this.handleCopySharedLink}
                  >
                    Copy
                  </SharedLinkActionsButton>
                </SharedLinkActionsButtons>
              </SharedLinkActions>
            </SharedLinkWrapper>
          </Row>
        )}
        <ButtonsWrapper>
          <StyledButton color="white" onClick={onCancel}>
            Cancel
          </StyledButton>
          <StyledButton color="black" onClick={this.handleShare}>
            Done
          </StyledButton>
        </ButtonsWrapper>
      </Modal>
    );
  }
}
