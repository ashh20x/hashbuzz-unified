import { Button, ButtonProps, SxProps, Theme } from '@mui/material';

export const primaryButtonV2Styles: SxProps<Theme> = {
  backgroundColor: '#5265FF',
  textTransform: 'capitalize',
  borderRadius: '8px',
  padding: '0.5rem 1.5rem',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#5265FF',
  },
};

const PrimaryButtonV2 = ({
  sx,
  size = 'medium',
  ...restProps
}: Omit<ButtonProps, 'color|variant|disableElevation'>) => {
  return (
    <Button
      sx={{ ...primaryButtonV2Styles, ...sx }}
      disableElevation
      size={size}
      variant='contained'
      color='primary'
      {...restProps}
    />
  );
};

export default PrimaryButtonV2;
