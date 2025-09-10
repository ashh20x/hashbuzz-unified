import React from 'react';

interface Props {
  className?: string;
  width?: number;
  height?: number;
}
const calculateRespectivewidth = (height: number): number =>
  Math.floor((height * 300) / 352);
const calculateRespectivheight = (width: number): number =>
  Math.floor((width * 352) / 300);
const HashpackIcon = ({ width, height }: Props) => {
  return (
    <svg
      width={height ? calculateRespectivewidth(height) : (width ?? '')}
      height={width ? calculateRespectivheight(width) : (height ?? '')}
      fill='none'
      viewBox='0 0 300 352'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M288 56C288 135.529 223.529 200 144 200C64.471 200 0 135.529 0 56C0 25.0721 25.0721 0 56 0C86.9279 0 112 25.0721 112 56V163.362C132.752 169.538 155.248 169.538 176 163.362V56C176 25.0721 201.072 0 232 0C262.928 0 288 25.0721 288 56ZM56 32C69.2548 32 80 42.7452 80 56V147.925C50.9843 127.686 32 94.0599 32 56C32 42.7452 42.7452 32 56 32ZM208 56V147.925C237.016 127.686 256 94.0599 256 56C256 42.7452 245.255 32 232 32C218.745 32 208 42.7452 208 56Z'
        fill='#7A7AB8'
        fillRule='evenodd'
      />
      <path
        d='M208 296V220.002C167.21 235.934 120.757 235.922 80 220.002V296C80 309.255 69.2548 320 56 320C42.7452 320 32 309.255 32 296V191.771C19.8582 181.743 9.08432 170.119 0 157.219V296C0 326.928 25.0721 352 56 352C86.9279 352 112 326.928 112 296V261.554C133.162 264.821 154.838 264.821 176 261.554V296C176 326.928 201.072 352 232 352C262.928 352 288 326.928 288 296V157.219C278.916 170.119 268.142 181.743 256 191.771V296C256 309.255 245.255 320 232 320C218.745 320 208 309.255 208 296Z'
        fill='#7A7AB8'
      />
    </svg>
  );
};

export default HashpackIcon;
