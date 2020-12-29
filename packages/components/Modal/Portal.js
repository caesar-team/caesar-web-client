import React, { Component, createRef } from 'react';
import styled from 'styled-components';
import { KEY_CODES } from '@caesar/common/constants';
import { elementIsFocused } from '@caesar/common/utils/domUtils';
import { Icon } from '../Icon';
import { Overlay } from './Overlay';

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 0;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
`;

const CloseIcon = styled(Icon)`
  color: ${({ theme }) => theme.color.gray};

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

const ContentWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 40px;
  background: ${({ theme }) => theme.color.white};
  border-radius: 4px;
  transform: translate(-50%, -50%);
  outline: none;

  ${({ width }) => width && `width: ${width}px`};
  max-height: 95%;
`;

class Portal extends Component {
  state = {
    isOpened: false,
    afterOpen: false,
    beforeClose: false,
  };

  shouldClose = null;

  contentRef = createRef();

  componentDidMount() {
    if (this.props.isOpened) {
      this.open();
    }

    document.addEventListener('keyup', event => {
      if (event.keyCode === KEY_CODES.ESC) this.requestClose(event);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isOpened && !prevProps.isOpened) {
      this.open();
    } else if (!this.props.isOpened && prevProps.isOpened) {
      this.close();
    }

    if (this.state.isOpened && !prevState.isOpened) {
      this.focus();
    }
  }

  componentWillUnmount() {
    this.afterClose();
  }

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
      this.setState({ isOpened: true }, () => {
        this.setState({ afterOpen: true });

        if (this.props.isOpened && this.props.onAfterOpen) {
          this.props.onAfterOpen();
        }
      });
    }
  };

  close = () => {
    this.setState(
      {
        beforeClose: false,
        isOpened: false,
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

  requestClose = () => this.props.onRequestClose && this.props.onRequestClose();

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
    const { isOpened, beforeClose } = this.state;
    const { children, onRequestClose, shouldCloseOnEsc, ...props } = this.props;

    const shouldBeClosed = !isOpened && !beforeClose;

    if (shouldBeClosed) {
      return null;
    }

    return (
      <Overlay
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
            <CloseIcon name="close" width={12} height={12} />
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
