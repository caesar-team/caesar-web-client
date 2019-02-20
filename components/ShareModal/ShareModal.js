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
import { formatDate } from 'common/utils/dateFormatter';
import { copyToClipboard } from 'common/utils/clipboard';
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
  state = {
    emails: [],
  };

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
    const { onToggleSeparateLink } = this.props;
    onToggleSeparateLink(isUseMasterPassword);
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
      item: { waiting },
      onRemove,
      onResend,
    } = this.props;

    if (!waiting || !waiting.length) {
      return null;
    }

    const renderedUsers = waiting.map(({ id, email }) => (
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
        <TextWithLines>Waiting ({waiting.length})</TextWithLines>
        <SharedList>
          <Scrollbar>{renderedUsers}</Scrollbar>
        </SharedList>
      </Fragment>
    );
  }

  renderSharedUsers() {
    const {
      item: { invited },
      onRemove,
    } = this.props;

    if (!invited.length) {
      return null;
    }

    const renderedUsers = invited.map(({ id, email, lastUpdated }) => (
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
        <TextWithLines>Shared ({invited.length})</TextWithLines>
        <SharedList>
          <Scrollbar>{renderedUsers}</Scrollbar>
        </SharedList>
      </Fragment>
    );
  }

  render() {
    const {
      onCancel,
      item: { link },
    } = this.props;
    const isUseMasterPassword = link && link.isUseMasterPassword;
    const switcherText = link ? 'Link access enabled' : 'Link access disabled';

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
        <Row>
          <ToggleLabel>
            <Toggle
              checked={!!link}
              icons={false}
              onChange={() => this.handleShareByLinkChange(false)}
            />
            <ToggleLabelText>{switcherText}</ToggleLabelText>
          </ToggleLabel>
        </Row>
        {link && (
          <Row>
            <SharedLinkWrapper>
              <SharedLink>{link.url}</SharedLink>
              <SharedLinkActions>
                <Checkbox
                  isChecked={isUseMasterPassword}
                  onChange={this.handleToggleSeparateLink}
                >
                  Use master password
                </Checkbox>
                <SharedLinkActionsButtons>
                  {/*<SharedLinkActionsButton color="white" icon="mail">*/}
                    {/*Send email*/}
                  {/*</SharedLinkActionsButton>*/}
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
