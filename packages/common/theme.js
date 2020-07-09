const theme = {
  color: {
    black: '#000',
    emperor: '#505050',
    gray: '#888',
    lightGray: '#ccc',
    gallery: '#eaeaea',
    alto: '#f5f5f5',
    snow: '#fbf9f9',
    white: '#fff',
    red: '#ff3355',
    // TODO: The below colors are redundant. Need to get rid of them
    darkGray: '#363636',
    middleGray: '#979797',
    blue: '#3385ff',
    lightBlue: '#f5f6f7',
    lightRed: 'rgba(255, 51, 85, 0.1)',
  },
  font: {
    size: {
      big: '30px',
      main: '16px',
      small: '14px',
      xs: '12px',
    },
    lineHeight: {
      big: 1.2,
      main: 1.5,
      small: 1.14,
      xs: 1.33,
    },
  },
  zIndex: {
    hidden: -1,
    basic: 11,
    upBasic: 12,
    overlay: 13,
    dropdown: 14,
    modal: 15,
    notification: 16,
  },
};

export default theme;
