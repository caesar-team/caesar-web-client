import React, { Component, createRef } from 'react';
import styled from 'styled-components';
import { KEY_CODES } from 'common/constants';
import { elementIsFocused } from 'common/utils/domUtils';
import { Icon } from '../Icon';
import Overlay from './Overlay';

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 0;
  cursor: pointer;
  background: none;
  border: none;
  transition: 0.35s;
  outline: none;

  &:hover {
    opacity: 0.75;
  }
`;

const StyledIcon = styled(Icon)`
  fill: ${({ theme }) => theme.gray};
`;

const ContentWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => theme.white};
  border-radius: 3px;
  outline: none;
  padding: 30px 40px 40px;

  ${({ minWidth }) => minWidth && `min-width: ${minWidth}px`};
`;

class Portal extends Component {
  state = {
    isOpen: false,
    afterOpen: false,
    beforeClose: false,
  };

  shouldClose = null;

  overlayRef = createRef();

  contentRef = createRef();

  componentDidMount() {
    if (this.props.isOpen) {
      this.open();
    }

    document.addEventListener('keyup', event => {
      if (event.keyCode === KEY_CODES.ESC) this.requestClose(event);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isOpen && !prevProps.isOpen) {
      this.open();
    } else if (!this.props.isOpen && prevProps.isOpen) {
      this.close();
    }

    if (this.state.isOpen && !prevState.isOpen) {
      this.focus();
    }
  }

  componentWillUnmount() {
    this.afterClose();
  }

  setOverlayRef = ref => {
    this.overlayRef = ref;
  };

  setContentRef = ref => {
    this.contentRef = ref;
  };

  focus = () =>
    this.contentRef &&
    this.contentRef.current &&
    !elementIsFocused(this.contentRef) &&
    this.contentRef.current.focus();

  open = () => {
    this.beforeOpen();

    if (this.state.afterOpen && this.state.beforeClose) {
      this.setState({ beforeClose: false });
    } else {
      this.setState({ isOpen: true }, () => {
        this.setState({ afterOpen: true });

        if (this.props.isOpen && this.props.onAfterOpen) {
          this.props.onAfterOpen();
        }
      });
    }
  };

  close = () => {
    this.setState(
      {
        beforeClose: false,
        isOpen: false,
        afterOpen: false,
      },
      this.afterClose,
    );
  };

  handleKeyDown = event => {
    if (this.props.shouldCloseOnEsc && event.keyCode === KEY_CODES.ESC) {
      event.stopPropagation();
      this.requestClose(event);
    }
  };

  handleClickOverlay = event => {
    if (this.shouldClose === null) {
      this.shouldClose = true;
    }

    if (this.shouldClose && this.props.shouldCloseOnOverlayClick) {
      if (this.props.onRequestClose) {
        this.requestClose(event);
      } else {
        this.focus();
      }
    }

    this.shouldClose = null;
  };

  handleClickCloseButton = event => {
    if (this.shouldClose === null) {
      this.shouldClose = true;
    }

    if (this.shouldClose && this.props.onRequestClose) {
      this.requestClose(event);
    }

    this.shouldClose = null;
  };

  handleMouseDownOverlay = event => {
    if (
      !this.props.shouldCloseOnOverlayClick &&
      event.target === this.overlayRef.current
    ) {
      event.preventDefault();
    }
  };

  handleClickContent = () => {
    this.shouldClose = false;
  };

  requestClose = event =>
    this.props.onRequestClose && this.props.onRequestClose(event);

  afterClose = () => {
    const { bodyOpenClassName } = this.props;

    if (document.body) {
      document.body.classList.remove(bodyOpenClassName);
    }
  };

  beforeOpen() {
    const { bodyOpenClassName } = this.props;

    if (document.body) {
      document.body.classList.add(bodyOpenClassName);
    }
  }

  render() {
    const { isOpen, beforeClose } = this.state;
    const { children, onRequestClose, shouldCloseOnEsc, ...props } = this.props;

    const shouldBeClosed = !isOpen && !beforeClose;

    if (shouldBeClosed) {
      return null;
    }

    return (
      <Overlay
        ref={this.setOverlayRef}
        onClick={this.handleClickOverlay}
        onMouseDown={this.handleMouseDownOverlay}
      >
        <ContentWrapper
          ref={this.setContentRef}
          onClick={this.handleClickContent}
          onKeyDown={this.handleKeyDown}
          {...props}
        >
          <CloseButton onClick={this.handleClickCloseButton}>
            <StyledIcon name="close" width="20" height="20" />
          </CloseButton>
          {children}
        </ContentWrapper>
      </Overlay>
    );
  }
}

Portal.Overlay = Overlay;
Portal.Content = ContentWrapper;

export default Portal;
