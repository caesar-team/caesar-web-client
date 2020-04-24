import OnePasswordImg from '@caesar/assets/images/1password.png';
import OnePasswordImg2x from '@caesar/assets/images/1password@2x.png';
import LastPassImg from '@caesar/assets/images/lastpass.png';
import LastPassImg2x from '@caesar/assets/images/lastpass@2x.png';
import FileCSVImg from '@caesar/assets/images/csv.png';
import FileCSVImg2x from '@caesar/assets/images/csv@2x.png';

export const ONEPASSWORD_TYPE = 'ONEPASSWORD_TYPE';
export const LASTPASS_TYPE = 'LASTPASS_TYPE';
export const CSV_TYPE = 'CSV_TYPE';

export const TABS = [
  {
    name: ONEPASSWORD_TYPE,
    title: '1Password',
    description: '*.csv files',
    icon: OnePasswordImg,
    icon2: OnePasswordImg2x,
  },
  {
    name: LASTPASS_TYPE,
    title: 'LastPass',
    description: 'Export script',
    icon: LastPassImg,
    icon2: LastPassImg2x,
  },
  {
    name: CSV_TYPE,
    title: 'CSV',
    description: '*.csv files',
    icon: FileCSVImg,
    icon2: FileCSVImg2x,
  },
];

export const FILE_STEP = 'FILE_STEP';
export const FIELDS_STEP = 'FIELDS_STEP';
export const DATA_STEP = 'DATA_STEP';
export const IMPORTING_STEP = 'IMPORTING_STEP';

export const STEPS = [
  { name: FILE_STEP, text: 'File' },
  { name: FIELDS_STEP, text: 'Fields' },
  { name: DATA_STEP, text: 'Data' },
  { name: IMPORTING_STEP, text: 'Importing' },
];

export const FILE_TYPE_MAP = {
  [ONEPASSWORD_TYPE]: {
    type: '1Password',
  },
  [LASTPASS_TYPE]: {
    type: 'LastPass',
  },
  [CSV_TYPE]: {
    type: 'csv',
  },
};
