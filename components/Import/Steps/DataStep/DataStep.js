import React, { Component } from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { Checkbox, DataTable } from 'components';
import { Input } from '../../../Input';
import { Icon } from '../../../Icon';
import { Button } from '../../../Button';

const Wrapper = styled.div`
  width: 100%;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.6px;
  margin-bottom: 20px;
`;

const StyledInput = styled(Input)`
  border: 1px solid ${({ theme }) => theme.gallery};
  margin-bottom: 10px;

  ${Input.InputField} {
    padding: 10px 0 10px 50px;
    background: ${({ theme }) => theme.white};

    &:hover {
      background: ${({ theme }) => theme.white};
    }
  }
`;

const StyledIcon = styled(Icon)`
  fill: ${({ theme }) => theme.gallery};
`;

const BottomWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0;
`;

const SelectedItems = styled.div`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.4px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
`;

const StyledButton = styled(Button)`
  margin-right: 20px;
`;

const COLUMNS = [
  { name: 'Title', selector: 'name', sortable: true },
  { name: 'Website', selector: 'website', sortable: true },
  { name: 'Login', selector: 'login', sortable: true },
];

const DATA = [
  { name: 'Behance', website: 'becance.com', login: 'dspiridonov@4xxi.com' },
  {
    name: 'Avacode Profile',
    website: 'avacode.io',
    login: 'dspiridonov@4xxi.com',
  },
  { name: 'Medium', website: 'medium.com', login: 'dspiridonov@4xxi.com' },
  { name: 'Dribble', website: 'dribble.com', login: 'dspiridonov@4xxi.com' },
  {
    name: 'Pinterest',
    website: 'pinterest.com',
    login: 'dspiridonov@4xxi.com',
  },
];

class DataStep extends Component {
  state = this.prepareInitialState();

  handleSearch = event => {
    event.preventDefault();

    console.log(event.target.value);
  };

  handleChange = data => {
    console.log(data);
  };

  prepareInitialState() {
    return {
      searchPattern: '',
      data: DATA,
    };
  }

  render() {
    const { data } = this.state;
    const { onSubmit } = this.props;

    return (
      <Formik
        key="dataStep"
        onSubmit={onSubmit}
        render={({
          values,
          errors,
          touched,
          handleSubmit,
          setFieldValue,
          setFieldTouched,
          isSubmitting,
          isValid,
        }) => (
          <Wrapper>
            <Title>Select items to import 1Password data into Caesar </Title>
            <StyledInput
              prefix={<StyledIcon name="search" width={18} height={18} />}
              placeholder="Search"
              onChange={this.handleSearch}
            />
            <DataTable
              noHeader
              columns={COLUMNS}
              data={data}
              selectableRows
              selectableRowsComponent={Checkbox}
              onTableUpdate={this.handleChange}
            />
            <BottomWrapper>
              <SelectedItems>
                Selected items: {data.length} / {DATA.length}
              </SelectedItems>
              <ButtonsWrapper>
                <StyledButton>CANCEL</StyledButton>
                <Button>IMPORT</Button>
              </ButtonsWrapper>
            </BottomWrapper>
          </Wrapper>
        )}
      />
    );
  }
}

export default DataStep;
