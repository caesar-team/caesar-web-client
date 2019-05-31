import React from 'react';
// eslint-disable-next-line
import { default as InputTags } from 'react-tagsinput';
import AutosizeInput from 'react-input-autosize';

import 'react-tagsinput/react-tagsinput.css';
import './react-tagsinput.overrides.css';

function autosizingRenderInput({ addTag, ...props }) {
  const { onChange, value, ...other } = props;

  return (
    <AutosizeInput type="text" autoComplete="off" onChange={onChange} value={value} {...other} />
  );
}

const TagsInput = props => (
  <InputTags {...props} renderInput={autosizingRenderInput} />
);

export default TagsInput;
