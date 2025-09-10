import React from 'react';

interface Props {
  className?: string;
  fill?: string;
  fillBg?: string;
  size: number;
}

const HederaIcon = ({ fill, fillBg, size }: Props) => {
  return (
    <svg
      viewBox='0 0 2500 2500'
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
    >
      <defs />
      <title>hedera--logo</title>
      <g id='Layer_2' data-name='Layer 2'>
        <g id='Layer_1-2' data-name='Layer 1'>
          <path
            fill={fillBg ?? '#1B1A1B'}
            d='M1250,0C559.64,0,0,559.64,0,1250S559.64,2500,1250,2500s1250-559.64,1250-1250S1940.36,0,1250,0'
          />
          <path
            fill={fill ?? '#FFFFFF'}
            className='cls-1'
            d='M1758.12,1790.62H1599.38V1453.13H900.62v337.49H741.87V696.25H900.62v329.37h698.76V696.25h158.75Zm-850-463.75h698.75V1152.5H908.12Z'
          />
        </g>
      </g>
    </svg>
  );
};

export default HederaIcon;
