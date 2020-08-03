import React, { useState, useEffect, useRef } from 'react';
import ContentEditable from 'react-contenteditable';

export const ContentEditableComponent = ({
  content: contentProp = '',
  disabled = false,
  handleFocus = Function.prototype,
  handleClick = Function.prototype,
  className,
}) => {
  const [getContent, setContent] = useState(contentProp);
  const contentEditable = useRef(null);

  const handleChange = e => {
    setContent(e.target.value);
  };

  const handleReadOnlyFocus = e => {
    e.target.blur();
  };

  useEffect(() => {
    setContent(contentProp);
  }, [contentProp]);

  return (
    <ContentEditable
      style={{ outline: 'none' }}
      onCut={event => event.preventDefault()}
      onPaste={event => event.preventDefault()}
      onKeyDown={event => {
        return !event.metaKey ? event.preventDefault() : true;
      }}
      className={className}
      innerRef={contentEditable}
      html={getContent}
      disabled={disabled}
      onChange={handleChange}
      onClick={handleClick}
      onFocus={disabled ? handleReadOnlyFocus : handleFocus}
    />
  );
};

export default ContentEditableComponent;
