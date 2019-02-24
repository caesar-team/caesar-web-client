import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import Toggle from 'react-toggle';
import {
  Icon,
  Modal,
  ModalTitle,
  Button,
  Scrollbar,
  Checkbox,
  ShareInput,
  TextWithLines,
} from 'components';
import {
  ANONYMOUS_USER_ROLE,
  SHARED_ACCEPTED_STATUS,
  SHARED_WAITING_STATUS,
} from 'common/constants';
import { formatDate } from 'common/utils/dateFormatter';
import { copyToClipboard } from 'common/utils/clipboard';
import { base64ToObject, objectToBase64 } from 'common/utils/cipherUtils';
import { generateSharingUrl } from 'common/utils/sharing';
import 'common/styles/react-toggle.css';

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

const SharedList = styled.div`
  margin-bottom: 30px;
  height: 200px;
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

const SharedItemDate = styled.div`
  flex-shrink: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.gray};
  padding-left: 20px;
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

export class ShareModal extends Component {
  state = this.prepareInitialState();

  handleShareByLinkChange = () => {
    const {
      item: { link },
      onActivateSharedByLink,
      onDeactivateSharedByLink,
    } = this.props;

    if (!link) {
      onActivateSharedByLink(false);
    } else {
      onDeactivateSharedByLink();
    }
  };

  handleToggleSeparateLink = isUseMasterPassword => {
    const { shared } = this.props;

    const anonymousShare = shared.find(
      ({ role }) => role === ANONYMOUS_USER_ROLE,
    );

    this.setState({
      isUseMasterPassword,
      linkText: this.generateLinkText(anonymousShare.link, isUseMasterPassword),
    });
  };

  handleCopySharedLink = () => {
    const {
      notification,
      item: { link },
    } = this.props;

    copyToClipboard(link.url);

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
    const linkObj = base64ToObject(link);

    if (!isUseMasterPassword) {
      return link;
    }

    const { masterPassword, ...linkData } = linkObj;

    return `${generateSharingUrl(
      objectToBase64(linkData),
    )}\nMaster password: ${masterPassword}`;
  }

  prepareInitialState() {
    const { shared } = this.props;

    const anonymousShare = shared.find(
      ({ role }) => role === ANONYMOUS_USER_ROLE,
    );

    return {
      emails: [],
      isUseMasterPassword: false,
      linkText: anonymousShare
        ? this.generateLinkText(anonymousShare.link, false)
        : '',
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

  renderWaitingUsers() {
    const {
      item: { shared },
      onRemove,
      onResend,
    } = this.props;

    if (!shared || !shared.length) {
      return null;
    }

    const waitingList = shared.filter(
      ({ status }) => status === SHARED_WAITING_STATUS,
    );

    const renderedUsers = waitingList.map(({ id, email }) => (
      <SharedItem key={id}>
        <SharedItemEmail>{email}</SharedItemEmail>
        <SharedItemRemove>
          <Icon
            name="close"
            width={14}
            height={14}
            isInButton
            onClick={onRemove(id)}
          />
        </SharedItemRemove>
      </SharedItem>
    ));

    return (
      <Fragment>
        <TextWithLines>Waiting ({waitingList.length})</TextWithLines>
        <SharedList>
          <Scrollbar>{renderedUsers}</Scrollbar>
        </SharedList>
      </Fragment>
    );
  }

  renderSharedUsers() {
    const {
      item: { shared },
      onRemove,
    } = this.props;

    if (!shared || !shared.length) {
      return null;
    }

    const acceptedList = shared.filter(
      ({ status }) => status === SHARED_ACCEPTED_STATUS,
    );

    const renderedUsers = acceptedList.map(({ id, email, lastUpdated }) => (
      <SharedItem key={id}>
        <SharedItemEmail>{email}</SharedItemEmail>
        <SharedItemDate>{formatDate(lastUpdated)}</SharedItemDate>
        <SharedItemRemove>
          <Icon
            name="close"
            width={14}
            height={14}
            isInButton
            onClick={onRemove(id)}
          />
        </SharedItemRemove>
      </SharedItem>
    ));

    return (
      <Fragment>
        <TextWithLines>Shared ({acceptedList.length})</TextWithLines>
        <SharedList>
          <Scrollbar>{renderedUsers}</Scrollbar>
        </SharedList>
      </Fragment>
    );
  }

  render() {
    const { isUseMasterPassword, linkText } = this.state;
    const { onCancel, shared } = this.props;

    const anonymousShare = shared.find(
      ({ role }) => role === ANONYMOUS_USER_ROLE,
    );

    const switcherText = anonymousShare
      ? 'Link access enabled'
      : 'Link access disabled';

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
        {this.renderWaitingUsers()}
        {this.renderSharedUsers()}
        <LinkRow>
          <ToggleLabel>
            <Toggle
              checked={!!anonymousShare}
              icons={false}
              onChange={() => this.handleShareByLinkChange(false)}
            />
            <ToggleLabelText>{switcherText}</ToggleLabelText>
          </ToggleLabel>
        </LinkRow>
        {anonymousShare && (
          <Row>
            <SharedLinkWrapper>
              <SharedLink>{linkText}</SharedLink>
              <SharedLinkActions>
                <Checkbox
                  isChecked={isUseMasterPassword}
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
