import React, { Component } from 'react';
import styled from 'styled-components';
import { copyToClipboard } from '@caesar-utils/utils/clipboard';
import {
  Wrapper,
  Row,
  FieldWrapper,
  Field,
  FieldValue,
  Title,
} from '@caesar/components';
import { Icon, Label } from '@caesar-ui';

const StyledEyeIcon = styled(Icon)`
  margin-right: 20px;
  cursor: pointer;
  fill: ${({ theme }) => theme.color.gray};
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
  fill: ${({ theme }) => theme.color.gray};
`;

const StyledWebsiteLink = styled.a``;

class Credentials extends Component {
  state = {
    isPasswordVisible: false,
  };

  handleTogglePasswordVisibility = () => {
    this.setState(prevState => ({
      isPasswordVisible: !prevState.isPasswordVisible,
    }));
  };

  handleCopy = field => () => {
    const {
      item: { data },
    } = this.props;

    copyToClipboard(data[field]);
  };

  render() {
    const { isPasswordVisible } = this.state;

    const {
      item: {
        data: { name, login, pass, website, note },
      },
    } = this.props;

    const site =
      website.startsWith('http://', 0) || website.startsWith('https://', 0)
        ? website
        : `http://${website}`;
    const pwd = isPasswordVisible ? pass : pass.replace(/./g, '*');
    const eyeIconName = isPasswordVisible ? 'eye-off' : 'eye-on';

    const shouldShowWebsite = !!website;
    const shouldShowNote = !!note;

    return (
      <Wrapper>
        <Title>{name}</Title>
        <FieldWrapper>
          <Field>
            <Label>Login</Label>
            <Row>
              <FieldValue>
                {login}
                <StyledIcon
                  name="copy"
                  width={19}
                  height={19}
                  onClick={this.handleCopy('login')}
                />
              </FieldValue>
            </Row>
          </Field>
          <Field>
            <Label>Password</Label>
            <Row>
              <FieldValue>
                {pwd}
                <Row>
                  <StyledEyeIcon
                    name={eyeIconName}
                    width={20}
                    height={20}
                    onClick={this.handleTogglePasswordVisibility}
                  />
                  <StyledIcon
                    name="copy"
                    width={19}
                    height={19}
                    onClick={this.handleCopy('pass')}
                  />
                </Row>
              </FieldValue>
            </Row>
          </Field>
          {shouldShowWebsite && (
            <Field>
              <Label>Website</Label>
              <FieldValue>
                {website}
                <StyledWebsiteLink href={site} target="_newtab">
                  <Icon name="arrow" width={18} height={10} />
                </StyledWebsiteLink>
              </FieldValue>
            </Field>
          )}
          {shouldShowNote && (
            <Field>
              <Label>Note</Label>
              <FieldValue>{note}</FieldValue>
            </Field>
          )}
        </FieldWrapper>
      </Wrapper>
    );
  }
}

export default Credentials;
