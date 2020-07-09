import React, { useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import styled from 'styled-components';
import { Input } from '../../Input';
import { Icon } from '../../Icon';
import { withNotification } from '../../Notification';

const Wrapper = styled.div`
  ${({ withLabel }) => withLabel && 'padding-top: 20px;'}
`;

const Label = styled.div`
  position: absolute;
  top: -20px;
  left: 16px;
  font-size: ${({ theme }) => theme.font.size.small};
  color: ${({ theme }) => theme.color.gray};
`;

const ValueInner = styled.div`
  display: flex;
  align-items: center;
  margin-right: auto;
  overflow: hidden;
`;

const Value = styled.div`
  ${({ withEllipsis }) =>
    withEllipsis &&
    `
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `}
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

const PencilIcon = styled(StyledIcon)`
  flex: 0 0 20px;
  margin-left: 16px;
`;

const CopyIcon = styled(StyledIcon)`
  margin-left: 8px;
  opacity: 0;
  transition: opacity 0.2s, color 0.2s;
`;

const ValueWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 16px;
  font-size: ${({ theme }) => theme.font.size.main};
  border-bottom: 1px solid ${({ theme }) => theme.color.gallery};
  transition: border-color 0.2s;

  ${({ withMinHeight }) => withMinHeight && 'min-height: 43px;'}

  &:hover {
    border-bottom: 1px solid ${({ theme }) => theme.color.black};

    ${CopyIcon} {
      opacity: 1;
    }
  }
`;

const InputComponent = ({
  type,
  label,
  name,
  placeholder,
  value: propValue,
  originalValue,
  autoComplete,
  withCopyButton = true,
  withEllipsis,
  notification,
  addonIcons,
  addonPostfix,
  onClickAcceptEdit,
  className,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [value, setValue] = useState(originalValue || propValue);
  const [, copyToClipboard] = useCopyToClipboard();

  const handleClickCopy = () => {
    copyToClipboard(originalValue || propValue);
    notification.show({
      text: `The ${label.toLowerCase()} has been copied.`,
    });
  };

  const handleClickClose = () => {
    setValue(propValue);
    setIsEdit(false);
  };

  return (
    <Wrapper withLabel={label} className={className}>
      {isEdit ? (
        <Input
          autoFocus
          type={type}
          label={label}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          isAcceptIconDisabled={!value}
          onChange={e => setValue(e.target.value)}
          onClickAcceptEdit={() => {
            onClickAcceptEdit({ name, value });
            setIsEdit(false);
          }}
          onClickClose={handleClickClose}
          onClickAway={handleClickClose}
          withBorder
          postfix={addonPostfix}
        />
      ) : (
        <ValueWrapper withMinHeight={!value}>
          {label && <Label>{label}</Label>}
          <ValueInner>
            <Value withEllipsis={withEllipsis}>{propValue}</Value>
            {withCopyButton && propValue && (
              <CopyIcon
                name="copy"
                width={20}
                height={20}
                color="gray"
                onClick={handleClickCopy}
              />
            )}
          </ValueInner>
          {addonIcons}
          {onClickAcceptEdit && (
            <PencilIcon
              name="pencil"
              width={20}
              height={20}
              color="gray"
              onClick={() => setIsEdit(true)}
            />
          )}
        </ValueWrapper>
      )}
    </Wrapper>
  );
};

const InputField = withNotification(InputComponent);

InputField.ValueWrapper = ValueWrapper;
InputField.ValueInner = ValueInner;
InputField.Value = Value;
InputField.PencilIcon = PencilIcon;
InputField.InputField = Input.InputField;

export { InputField as Input };
