import React from 'react';
import ContentEditable from 'react-contenteditable';

class ReadOnlyContentEditable extends React.Component {
  constructor(props) {
    super(props);
    this.contentEditable = React.createRef();
    this.state = { html: props.html || '' };
  }

  handleChange = evt => {
    this.setState({ html: evt.target.value });
  };

  render = () => {
    return (
      <ContentEditable
        style={{ outline: 'none' }}
        onCut={() => false}
        onPaste={() => false}
        onKeyDown={event => {
          return !event.metaKey ? event.preventDefault() : true;
        }}
        innerRef={this.contentEditable}
        html={this.state.html}
        disabled={false}
        onChange={this.handleChange}
      />
    );
  };
}

export default ReadOnlyContentEditable;
