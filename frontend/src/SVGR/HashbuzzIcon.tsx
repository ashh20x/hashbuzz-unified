import React from 'react';
import { Box } from '@mui/material';

interface Props {
  className?: string;
  fontSize?: number;
  size?: number;
  color?: string;
}

const HashbuzzIcon = ({ className, size, fontSize, color }: Props) => {
  return (
    <Box
      component={'svg'}
      sx={{
        '& > .cls-1': {
          fill: color ?? '#5265ff',
        },
      }}
      id='Layer_1'
      viewBox='0 0 512 512'
      className={className ?? ''}
      height={(fontSize || size) ?? 48}
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs />
      <g>
        <path
          fill={color ?? '#5265ff'}
          d='m250.21,69.49l-153.37,88.55c-3.39,1.96-5.48,5.57-5.48,9.48v69.57s197.53-114.04,197.53-114.04v-37.56s-27.73-16.01-27.73-16.01c-3.39-1.95-7.56-1.95-10.95,0Z'
        />
        <path
          fill={color ?? '#5265ff'}
          d='m157.53,274.79l.02,75.9v38.45l-33.32-19.22-27.13-15.67c-3.42-1.84-5.74-5.46-5.74-9.62v-107.53l66.19-38.22-.02,75.9Z'
        />
        <polygon
          fill={color ?? '#5265ff'}
          points='223.22 236.87 288.9 198.95 288.9 123.05 223.22 160.97 223.22 236.87'
        />
      </g>
      <g>
        <path
          fill={color ?? '#5265ff'}
          d='m420.24,167.52c0-3.91-2.1-7.53-5.5-9.48l-27.49-15.81-32.68-18.8v37.6s0,75.91,0,75.91l65.66-37.78v-31.64Z'
        />
        <path
          fill={color ?? '#5265ff'}
          d='m354.58,236.94v75.89s-65.68,37.92-65.68,37.92v-75.89s-65.68,37.92-65.68,37.92v75.89s0,38.39,0,38.39l27,15.6c3.39,1.96,7.56,1.96,10.95,0l153.6-88.68c3.39-1.96,5.48-5.57,5.48-9.48v-69.57s0-75.89,0-75.89l-65.66,37.91Z'
        />
      </g>
    </Box>
  );
};

export default HashbuzzIcon;
