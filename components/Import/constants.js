import OnePasswordImg from 'static/images/1password.png';
import OnePasswordImg2x from 'static/images/1password@2x.png';
import LastPassImg from 'static/images/lastpass.png';
import LastPassImg2x from 'static/images/lastpass@2x.png';
import FileCSVImg from 'static/images/csv.png';
import FileCSVImg2x from 'static/images/csv@2x.png';

export const TABS = [
  {
    name: 'onepassword',
    title: '1Password',
    description: '*.1pif files',
    icon: OnePasswordImg,
    icon2: OnePasswordImg2x,
  },
  {
    name: 'lastpassword',
    title: 'LastPass',
    description: 'Export script',
    icon: LastPassImg,
    icon2: LastPassImg2x,
  },
  {
    name: 'csv',
    title: 'CSV',
    description: '*.csv files',
    icon: FileCSVImg,
    icon2: FileCSVImg2x,
  },
];

export const FILE_STEP = 'FILE_STEP';
export const DATA_STEP = 'DATA_STEP';
export const IMPORTING_STEP = 'IMPORTING_STEP';

export const STEPS = [
  { name: FILE_STEP, text: 'File' },
  { name: DATA_STEP, text: 'Data' },
  { name: IMPORTING_STEP, text: 'Importing' },
];
