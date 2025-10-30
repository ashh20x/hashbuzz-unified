import React from 'react';
import * as SC from './styled';
import Logo from '../../components/Logo/Logo';
import HashbuzzLogoMainTransparent from '../../SVGR/HashbuzzLogo';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <SC.Footer>
      <SC.FooterContiner className='footer'>
        <SC.FooterColumn className='footer-column'>
          <HashbuzzLogoMainTransparent
            colors={{ color1: '#fff', color2: '#fff' }}
            height={80}
          />
        </SC.FooterColumn>
        <SC.FooterColumn className='footer-column'>
          <Link to={'/privacy-policy'}>Privacy Policy</Link>
        </SC.FooterColumn>
        <SC.FooterColumn className='footer-column'>
          <Link to={'/terms-of-use'}>Terms of use</Link>
        </SC.FooterColumn>
        <SC.FooterColumn className='footer-column'>
          &copy; 2024 Hashbuzz Social
        </SC.FooterColumn>
      </SC.FooterContiner>
    </SC.Footer>
  );
};

export default Footer;
