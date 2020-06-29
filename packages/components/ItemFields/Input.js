import React, { useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import styled from 'styled-components';
import { FormInput } from '../Input';
import { Icon } from '../Icon';
import { withNotification } from '../Notification';

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

  &:hover {
    border-bottom: 1px solid ${({ theme }) => theme.color.black};

    ${CopyIcon} {
      opacity: 1;
    }
  }
`;

const InputComponent = ({
  label,
  apiLabel,
  placeholder,
  value: propValue,
  valueToCopy,
  withCopyButton = true,
  withEllipsis,
  notification,
  addonIcons,
  handleClickAcceptEdit = Function.prototype,
  className,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [value, setValue] = useState(propValue);
  const [, copyToClipboard] = useCopyToClipboard();

  const handleClickCopy = () => {
    copyToClipboard(valueToCopy || propValue);
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
        <FormInput
          label={label}
          value={value}
          placeholder={placeholder}
          isAcceptIconDisabled={!value}
          handleChange={e => setValue(e.target.value)}
          handleClickAcceptEdit={() => {
            handleClickAcceptEdit({
              label: apiLabel || label.toLowerCase(),
              value,
            });
            setIsEdit(false);
          }}
          handleClickClose={handleClickClose}
          handleClickAway={handleClickClose}
          withBorder
        />
      ) : (
        <ValueWrapper>
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
          <PencilIcon
            name="pencil"
            width={20}
            height={20}
            color="gray"
            onClick={() => setIsEdit(true)}
          />
        </ValueWrapper>
      )}
    </Wrapper>
  );
};

const Input = withNotification(InputComponent);

Input.ValueWrapper = ValueWrapper;
Input.ValueInner = ValueInner;
Input.Value = Value;
Input.PencilIcon = PencilIcon;
Input.InputField = FormInput.InputField;

export { Input };
