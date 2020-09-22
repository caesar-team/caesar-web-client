const theme = {
  color: {
    black: '#000',
    emperor: '#505050',
    gray: '#888',
    lightGray: '#ccc',
    lighterGray: 'rgba(136, 136, 136, 0.3)',
    gallery: '#eaeaea',
    alto: '#f5f5f5',
    snow: '#fbf9f9',
    white: '#fff',
    red: '#ff3355',
    lightRed: 'rgba(255, 51, 85, 0.1)',
    blackBoxShadow: 'rgba(0, 0, 0, 0.08)',
    // TODO: The below colors are redundant. Need to get rid of them
    darkGray: '#363636',
  },
  font: {
    size: {
      large: '36px',
      big: '30px',
      middle: '24px',
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
    basic: 1,
    upBasic: 2,
    overlay: 3,
    dropdown: 4,
    modal: 5,
    notification: 6,
  },
  borderRadius: '3px',
};

export default theme;
