import { Box, Stack } from '@mui/material';
import HashbuzzLogo from '../../SVGR/HashbuzzLogo';
import HeaderMenu from './HeaderMenu';
// import HeaderMenu from "../Components/HeaderMenu";

const Header = () => {
  return (
    <Box sx={{ position: 'relative' }}>
      <Stack alignItems={'center'} justifyContent='center' direction={'row'}>
        <HashbuzzLogo height={160} />
      </Stack>
      <HeaderMenu />
    </Box>
  );
};

export default Header;
