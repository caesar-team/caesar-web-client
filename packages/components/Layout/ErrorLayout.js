import React from 'react';
import styled from 'styled-components';
import { media } from '@caesar/assets/styles/media';
import LayoutConstructor from './LayoutConstructor';

const LayoutConstructorStyled = styled(LayoutConstructor)`
  ${LayoutConstructor.Wrapper} {
    padding: 0;
  }

  ${LayoutConstructor.TopWrapper} {
    justify-content: space-between;
    margin-bottom: 100px;
  }
  
  ${LayoutConstructor.MainWrapper} {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &:before {
      display: block;
      content: '';
      width: 844px;
      height: 552px;
      background-image: url('/images/error-left.png'),
        url('/images/error-right.png');
      background-repeat: no-repeat, no-repeat;
      background-position: left top, right calc(100% - 15px);
    }
    
    @media (min-resolution: 144dpi) and (min-resolution: 1.5dppx) {
      &:before {
        background-image: url('/images/error-left@2x.png'),
          url('/images/error-right@2x.png');
      }  
    }
    
    ${media.desktop`
      &:before {
        width: 732px;
        height: 480px;
        background-size: 256px 470px, 270px 381px;
      }
    `}
    
    ${media.wideMobile`
      &:before {
        width: 610px;
        height: 400px;
        background-size: 216px 396px, 220px 310px;
      }
    `}
    
    ${media.middleMobile`
      &:before {
        width: 432px;
        height: 487px;
        background-size: 190px 357px, 170px 240px;
        background-position: left top, right bottom;
      }
    `}
    
    ${media.narrowMobile`
      &:before {
        width: 288px;
        height: 418px;
        background-size: 140px 256px, 120px 169px;
      }
    `} 
  }
`;

const ErrorLayout = props => <LayoutConstructorStyled {...props} />;

export default ErrorLayout;
