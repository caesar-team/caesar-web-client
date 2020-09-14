import React, { useState, memo } from 'react';
import { useAsync, useUpdateEffect } from 'react-use';
import copy from 'copy-text-to-clipboard';
import equal from 'fast-deep-equal';
import styled from 'styled-components';
import { PERMISSION } from '@caesar/common/constants';
import { useNotification } from '@caesar/common/hooks';
import { makeObject } from '@caesar/common/utils/object';
import { Can } from '../../Ability';
import { Input } from '../../Input';
import { Icon } from '../../Icon';

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
  margin-left: 8px;
  opacity: 0;
  transition: opacity 0.2s, color 0.2s;
`;

const CopyIcon = styled(StyledIcon)`
  flex: 0 0 20px;
  margin-left: 16px;
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

    ${PencilIcon} {
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
  itemSubject,
  schema,
  originalValue,
  autoComplete,
  withCopyButton = true,
  withEllipsis,
  addonIcons,
  addonPostfix,
  onClickAcceptEdit,
  onChange = Function.prototype,
  className,
}) => {
  const [isEdit, setEdit] = useState(false);
  const [value, setValue] = useState(propValue);
  const notification = useNotification();

  useUpdateEffect(() => {
    if (propValue !== value) {
      setValue(propValue);
      onChange(propValue);
    }
  }, [propValue]);

  const handleClickCopy = () => {
    copy(propValue);
    notification.show({
      text: `The ${label.toLowerCase()} has been copied`,
    });
  };

  const handleClickClose = () => {
    setValue(originalValue);
    onChange(originalValue);
    setEdit(false);
  };

  const handleChange = e => {
    const val = e.target.value;

    setValue(val);
    onChange(val);
  };

  const validationState = useAsync(async () => {
    if (!schema) return null;

    const result = await schema.validate(value);

    return result;
  }, [value, schema]);

  return (
    <Wrapper withLabel={label} className={className}>
      {isEdit ? (
        <Input
          autoFocus
          type={type}
          label={label}
          value={value}
          error={validationState?.error?.message}
          placeholder={placeholder}
          autoComplete={autoComplete}
          isAcceptIconDisabled={!value || validationState?.error?.message}
          onChange={handleChange}
          onClickAcceptEdit={() => {
            onClickAcceptEdit(makeObject(name, value));
            setEdit(false);
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
            <Value withEllipsis={withEllipsis}>
              {type === 'password' ? '********' : propValue}
            </Value>
            <Can I={PERMISSION.EDIT} an={itemSubject}>
              {onClickAcceptEdit && (
                <PencilIcon
                  name="pencil"
                  width={20}
                  height={20}
                  color="gray"
                  onClick={() => setEdit(true)}
                />
              )}
            </Can>
          </ValueInner>
          {addonIcons}
          {withCopyButton && propValue && (
            <CopyIcon
              name="copy"
              width={20}
              height={20}
              color="gray"
              onClick={handleClickCopy}
            />
          )}
        </ValueWrapper>
      )}
    </Wrapper>
  );
};

const InputWithPermissions = ({ value, itemSubject, ...props }) => {
  return value ? (
    <InputComponent value={value} itemSubject={itemSubject} {...props} />
  ) : (
    <Can I={PERMISSION.EDIT} an={itemSubject}>
      <InputComponent value={value} itemSubject={itemSubject} {...props} />
    </Can>
  );
};

const InputField = memo(InputWithPermissions, (prevProps, nextProps) =>
  equal(
    [
      prevProps.itemSubject,
      prevProps.type,
      prevProps.label,
      prevProps.name,
      prevProps.value,
      prevProps.originalValue,
    ],
    [
      nextProps.itemSubject,
      nextProps.type,
      nextProps.label,
      nextProps.name,
      nextProps.value,
      nextProps.originalValue,
    ],
  ),
);

InputField.ValueWrapper = ValueWrapper;
InputField.ValueInner = ValueInner;
InputField.Value = Value;
InputField.PencilIcon = PencilIcon;
InputField.InputField = Input.InputField;

export { InputField as Input };
