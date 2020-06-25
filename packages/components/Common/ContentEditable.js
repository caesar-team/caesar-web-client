import React, { useState, useEffect } from 'react';
import ContentEditable from 'react-contenteditable';

export const ContentEditableComponent = ({
  html = '',
  disabled = false,
  handleFocus = () => {},
  handleClick = () => {},
}) => {
  const [getHtml, setHtml] = useState(html);
  const contentEditable = React.createRef();

  const handleChange = e => {
    setHtml(e.target.value);
  };

  const handleReadOnlyFocus = e => {
    e.target.blur();
  };

  useEffect(() => {
    setHtml(html);
  });

  return (
    <>
      <ContentEditable
        style={{ outline: 'none' }}
        onCut={() => false}
        onPaste={() => false}
        onKeyDown={event => {
          return !event.metaKey ? event.preventDefault() : true;
        }}
        innerRef={contentEditable}
        html={getHtml}
        disabled={disabled}
        onChange={handleChange}
        onClick={handleClick}
        onFocus={disabled ? handleReadOnlyFocus : handleFocus}
      />
    </>
  );
};

export default ContentEditableComponent;
