import HashbuzzLogo from '../../SVGR/HashbuzzLogo';
import { LogoContainer } from './Logo.styles';
export const Logo = () => {
  return (
    <LogoContainer>
      <HashbuzzLogo height={125} />
    </LogoContainer>
  );
};

export default Logo;
