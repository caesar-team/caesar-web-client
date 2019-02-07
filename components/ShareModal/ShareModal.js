import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import TagsInput from 'react-tagsinput';
import Toggle from 'react-toggle';
import { Icon, Modal, ModalTitle, Button, Scrollbar } from 'components';
import { formatDate } from 'common/utils/dateFormatter';
import 'common/styles/react-tagsinput.css';
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

const SharedListTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.lightGray};
  margin-top: 32px;
  margin-bottom: 10px;
  text-transform: uppercase;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;

  &:before,
  &:after {
    content: '';
    border-top: 2px solid;
    margin: 0 20px 0 0;
    flex: 1 0 20px;
  }

  &:after {
    margin: 0 0 0 20px;
  }
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

export class ShareModal extends Component {
  state = {
    shareByLinkIsShown: false,
    tags: [],
  };

  handleChange = tags => {
    this.setState({ tags });
  };

  handleShareByLinkChange = () => {
    this.setState(prevState => ({
      shareByLinkIsShown: !prevState.shareByLinkIsShown,
    }));
  };

  handleShare = () => {
    const { onShare } = this.props;
    const { tags } = this.state;

    return onShare && onShare(tags);
  };

  renderMembers() {
    const { shared, members, onRemove } = this.props;

    if (!shared.length) {
      return null;
    }

    console.log(shared, members);

    const renderedMembers = shared.map(({ id, userId, lastUpdated }) => (
      <SharedItem key={id}>
        <SharedItemEmail>ajackson@gmail.com</SharedItemEmail>
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
        <SharedListTitle>Shared ({shared.length})</SharedListTitle>
        <SharedList>
          <Scrollbar>{renderedMembers}</Scrollbar>
        </SharedList>
      </Fragment>
    );
  }

  render() {
    const { onCancel } = this.props;
    const { tags, shareByLinkIsShown } = this.state;

    return (
      <Modal
        isOpen
        minWidth={560}
        onRequestClose={onCancel}
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
      >
        <ModalTitle>Share</ModalTitle>
        <ModalDescription>
          Share item will be available in read mode
        </ModalDescription>
        <Row>
          <TagsInput
            value={tags}
            onChange={this.handleChange}
            inputProps={{ placeholder: 'Enter email addresses…' }}
          />
        </Row>
        {this.renderMembers()}
        <Row>
          <ToggleLabel>
            <Toggle
              defaultChecked={shareByLinkIsShown}
              icons={false}
              onChange={this.handleShareByLinkChange}
            />
            <ToggleLabelText>Enable access via link</ToggleLabelText>
          </ToggleLabel>
        </Row>
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
