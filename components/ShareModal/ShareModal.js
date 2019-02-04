import React, { Component } from 'react';
import styled from 'styled-components';
import TagsInput from 'react-tagsinput';
import Toggle from 'react-toggle';
import { Icon, Modal, ModalTitle, Button } from 'components';
import 'common/styles/react-tagsinput.css';
import 'common/styles/react-toggle.css';

const ModalDescription = styled.div`
  padding-bottom: 20px;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.emperor};
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
  font-size: 18px;
  color: ${({ theme }) => theme.emperor};
  padding-bottom: 3px;
`;

const SharedList = styled.div`
  margin-bottom: 30px;
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
        <SharedListTitle>Shared with </SharedListTitle>
        <SharedList>
          <SharedItem>
            <SharedItemEmail>ajackson@gmail.com</SharedItemEmail>
            <SharedItemDate>Nov 16, 2018 02:00 PM</SharedItemDate>
            <SharedItemRemove>
              <Icon name="close" width={14} height={14} isInButton />
            </SharedItemRemove>
          </SharedItem>
          <SharedItem>
            <SharedItemEmail>ajackson@gmail.com</SharedItemEmail>
            <SharedItemDate>Nov 16, 2018 02:00 PM</SharedItemDate>
            <SharedItemRemove>
              <Icon name="close" width={14} height={14} isInButton />
            </SharedItemRemove>
          </SharedItem>
          <SharedItem>
            <SharedItemEmail>ajackson@gmail.com</SharedItemEmail>
            <SharedItemDate>Nov 16, 2018 02:00 PM</SharedItemDate>
            <SharedItemRemove>
              <Icon name="close" width={14} height={14} isInButton />
            </SharedItemRemove>
          </SharedItem>
          <SharedItem>
            <SharedItemEmail>ajackson@gmail.com</SharedItemEmail>
            <SharedItemDate>Nov 16, 2018 02:00 PM</SharedItemDate>
            <SharedItemRemove>
              <Icon name="close" width={14} height={14} isInButton />
            </SharedItemRemove>
          </SharedItem>
        </SharedList>
        <ButtonsWrapper>
          <StyledButton color="white" onClick={onCancel}>
            Cancel
          </StyledButton>
          <StyledButton color="black">Share</StyledButton>
        </ButtonsWrapper>
      </Modal>
    );
  }
}
