import React from 'react';
// eslint-disable-next-line
import { default as Datatable } from 'react-data-table-component';

const THEME = {
  header: {
    fontSize: '14px',
    color: '#888888',
    backgroundColor: '#fbf9f9',
    height: '40px',
  },
  cells: {
    fontSize: '16px',
    letterSpacing: '0.6px',
  },
  rows: {
    fontSize: '16px',
  },
};

const DataTable = props => <Datatable {...props} customTheme={THEME} />;

export default DataTable;
