import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Typography,
  styled,
} from '@mui/material';

// ----------- PROMO PAGE ---------------------
export const StyledContainer = styled(Box)(
  ({ theme }) => `
  padding: ${theme.spacing(2)};

  ${theme.breakpoints.up('sm')} {
    padding: ${theme.spacing(3)};
  }

  ${theme.breakpoints.down('sm')} {
    padding: ${theme.spacing(1)};
  }
`
);

export const StyledGrid = styled(Box)(
  ({ theme }) => `
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.spacing(3)};

  ${theme.breakpoints.down('sm')} {
    grid-template-columns: 1fr;
    gap: ${theme.spacing(1.5)};
    width: 100%;
    margin: 0;
    padding: 0;
  }

  ${theme.breakpoints.up('md')} {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }

  ${theme.breakpoints.up('lg')} {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: ${theme.spacing(3)};
  }

  ${theme.breakpoints.up('xl')} {
    grid-template-columns: repeat(3, 1fr);
  }
`
);

export const StyledPromoCard = styled(Card)(
  ({ theme }) => `
  background: ${theme.palette.background.paper};
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid ${theme.palette.divider};
  transition: all 0.2s ease-in-out;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }

  ${theme.breakpoints.down('sm')} {
    border-radius: 12px;
    margin: -8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }
`
);

export const StyledHeader = styled(Box)(
  ({ theme }) => `
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${theme.spacing(2)};
`
);

export const StyledBrandInfo = styled(Box)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1)};
  flex: 1;
`
);

export const StyledBrandAvatar = styled(Avatar)<{ brandcolor: string }>(
  ({ brandcolor }) => `
  width: 32px;
  height: 32px;
  background-color: ${brandcolor};
  font-size: 12px;
  font-weight: 600;
`
);

export const StyledBrandName = styled(Typography)(
  ({ theme }) => `
  font-size: 0.75rem;
  color: ${theme.palette.text.secondary};
`
);

export const StyledTotalPrize = styled(Typography)(
  ({ theme }) => `
  font-weight: 600;
  font-size: 1.1rem;
  color: ${theme.palette.text.primary};
`
);

export const StyledPromoTitle = styled(Typography)(
  ({ theme }) => `
  font-weight: 600;
  margin-bottom: ${theme.spacing(2)};
  font-size: 1rem;
  line-height: 1.3;
  color: ${theme.palette.text.primary};
`
);

export const StyledActionChip = styled(Chip)<{ actioncolor: string }>(
  ({ theme, actioncolor }) => `
  background-color: ${actioncolor}10;
  border-color: ${actioncolor}30;
  color: ${actioncolor};
  font-weight: 500;
  border-radius: 8px;
  text-transform: capitalize;
  font-size: 0.75rem;
  height: 28px;

  & .MuiChip-icon {
    color: ${actioncolor};
    margin-left: 4px;
  }

  & .MuiChip-label {
    padding-left: ${theme.spacing(1)};
    padding-right: ${theme.spacing(1)};
  }

  &:hover {
    background-color: ${actioncolor}20;
    border-color: ${actioncolor}50;
  }

  ${theme.breakpoints.down('sm')} {
    font-size: 0.7rem;
    height: 24px;

    & .MuiChip-icon {
      font-size: 14px;
    }
  }
`
);

export const StyledPrizeContainer = styled(Box)(
  ({ theme }) => `
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: ${theme.spacing(2)} 0;

  ${theme.breakpoints.down('sm')} {
    gap: 6px;
    margin: ${theme.spacing(1.5)} 0;
  }

  ${theme.breakpoints.down(400)} {
    gap: 4px;
  }
`
);

export const StyledFooter = styled(Box)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${theme.spacing(3)};
  padding-top: ${theme.spacing(2)};
  border-top: 1px solid ${theme.palette.divider};

  ${theme.breakpoints.down('sm')} {
    margin-top: ${theme.spacing(1)};
    padding-top: ${theme.spacing(1)};
    font-size: 12px;
  }
`
);

export const StyledDurationContainer = styled(Box)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  gap: ${theme.spacing(2)};

  ${theme.breakpoints.down('sm')} {
    gap: ${theme.spacing(1)};
    font-size: 12px;
  }
`
);

export const StyledDurationInfo = styled(Box)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  gap: ${theme.spacing(0.5)};

  ${theme.breakpoints.down('sm')} {
    gap: ${theme.spacing(0.25)};
    font-size: 8px;
  }
`
);

export const StyledViewPromoButton = styled(Button)(
  ({ theme }) => `
  text-transform: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.palette.primary.main};
  min-width: auto;
  padding: ${theme.spacing(0.5)};

  ${theme.breakpoints.down('sm')} {
    font-size: 12px;
    padding: ${theme.spacing(0.25)};
  }
`
);

// ----------- REWARDS HISTORY PAGE ---------------------

export const RewardsContainer = styled(Box)`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 1400px;
  margin: 0 auto;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    border-radius: 0;
    box-shadow: none;
    margin: -8px;
    background: #f8fafc;
  }
`;

export const HeaderContainer = styled(Box)`
  display: grid;
  grid-template-columns: 60px 1fr 1fr 1fr 1fr;
  padding: 16px 24px;
  background: #fafbfc;
  border-bottom: 1px solid #e5e7eb;
  align-items: center;

  ${({ theme }) => theme.breakpoints.down('lg')} {
    display: none;
  }
`;

export const HeaderText = styled(Typography)`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const RowContainer = styled(Box)<{ isSelected?: boolean }>`
  display: grid;
  grid-template-columns: 60px 1fr 1fr 1fr 1fr;
  padding: 20px 24px;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s ease;
  align-items: center;

  background: ${({ isSelected }) => (isSelected ? '#f8fafc' : '#ffffff')};

  &:hover {
    background: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }

  ${({ theme }) => theme.breakpoints.down('lg')} {
    display: none;
  }
`;

export const CheckboxContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PromoContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const PromoTitle = styled(Typography)`
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 13px;
    font-weight: 600;
    line-height: 1.3;
  }
`;

export const PromoDate = styled(Typography)`
  font-size: 13px;
  color: #6b7280;
  font-weight: 400;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;

export const ExternalIcon = styled('span')`
  font-size: 14px;
  color: #6b7280;
  margin-left: 4px;
`;

export const BrandContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 8px;
  }
`;

export const BrandLogo = styled('img')`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 24px;
    height: 24px;
    font-size: 14px;
  }
`;

export const BrandName = styled(Typography)`
  font-size: 15px;
  font-weight: 500;
  color: #1f2937;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 13px;
  }
`;

export const ActionsContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;

  &.mobile-actions {
    justify-content: flex-start;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 6px;
  }
`;

export const ActionChip = styled(Chip)<{ actionColor?: string }>`
  font-size: 12px;
  font-weight: 500;
  height: 28px;
  border-radius: 14px;
  padding: 0 8px;

  .MuiChip-label {
    padding: 0 8px;
  }

  .MuiChip-icon {
    font-size: 14px;
    margin-left: 4px;
    margin-right: -4px;
  }

  &.comment {
    background: rgba(25, 118, 210, 0.1);
    color: #1976d2;
    border: 1px solid rgba(25, 118, 210, 0.2);
  }

  &.repost {
    background: rgba(46, 125, 50, 0.1);
    color: #2e7d32;
    border: 1px solid rgba(46, 125, 50, 0.2);
  }

  &.quote {
    background: rgba(124, 77, 255, 0.1);
    color: #7c4dff;
    border: 1px solid rgba(124, 77, 255, 0.2);
  }

  &.like {
    background: rgba(233, 30, 99, 0.1);
    color: #e91e63;
    border: 1px solid rgba(233, 30, 99, 0.2);
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 11px;
    height: 24px;
    border-radius: 12px;

    .MuiChip-label {
      padding: 0 6px;
    }

    .MuiChip-icon {
      font-size: 12px;
    }
  }
`;

export const EarnedContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const EarnedAmount = styled(Typography)`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;

  &.mobile-earned {
    text-align: right;
    font-size: 15px;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 14px;
    font-weight: 600;
  }
`;

export const PaginationContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #fafbfc;
  border-top: 1px solid #e5e7eb;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
    gap: 16px;
    padding: 12px 16px;
    background: #ffffff;

    & > div:first-of-type {
      order: 2;
    }

    & > div:last-of-type {
      order: 1;
    }
  }
`;

export const PaginationButton = styled(Button)`
  background: #ffffff;
  border: 1px solid #d1d5db;
  color: #374151;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  text-transform: none;

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }

  &:disabled {
    background: #f9fafb;
    border-color: #e5e7eb;
    color: #9ca3af;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    min-width: 120px;
  }
`;

export const PageInfo = styled(Typography)`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
`;

// Desktop Skeleton styles
export const SkeletonRowContainer = styled(Box)`
  display: grid;
  grid-template-columns: 60px 1fr 1fr 1fr 1fr;
  padding: 20px 24px;
  border-bottom: 1px solid #f3f4f6;
`;

export const SkeletonPromoContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SkeletonBrandContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const SkeletonActionsContainer = styled(Box)`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const SkeletonEarnedContainer = styled(Box)`
  display: flex;
  justify-content: flex-end;
`;

// ----------- MOBILE RESPONSIVE COMPONENTS -----------
export const MobileGridContainer = styled(Box)`
  display: none;
  width: 100%;
  max-width: 100%;

  ${({ theme }) => theme.breakpoints.down('lg')} {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    background: #f8fafc;
    width: 90%;
    margin: 0 auto;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 8px;
    gap: 8px;
    width: 95%;
  }
`;

export const MobileCard = styled(Card)<{ isSelected?: boolean }>`
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: ${({ isSelected }) => (isSelected ? '#f0f9ff' : '#ffffff')};
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 100%;
  margin: 0;
  box-sizing: border-box;
  overflow: hidden;

  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    border-color: #d1d5db;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 12px;
    border-radius: 8px;
  }
`;

export const MobileCardHeader = styled(Box)`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 12px;
  }
`;

export const MobileCheckboxContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 2px;
  margin-right: 8px;
`;

export const MobileTitleSection = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const MobileEarnedSection = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const MobileBrandSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 12px;
  }
`;

export const MobileActionsSection = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 4px;
    margin-bottom: 12px;
  }
`;

export const MobileFooterSection = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding-top: 8px;
  }
`;

export const MobileCardContent = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
`;

export const MobileSection = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 32px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 8px;
    min-height: 28px;
  }
`;

export const MobileSectionLabel = styled(Typography)`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 80px;
  flex-shrink: 0;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 11px;
    min-width: 70px;
  }
`;

export const MobileSectionContent = styled(Box)`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    justify-content: flex-end;
  }
`;

// Mobile Skeleton Components
export const SkeletonMobileCard = styled(Card)`
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 100%;
  margin: 0;
  box-sizing: border-box;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 12px;
    border-radius: 8px;
  }
`;

// Additional responsive utilities
export const ResponsiveContainer = styled(Box)`
  width: 100%;
  max-width: 100%;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 0;
    margin: 0;
  }

  ${({ theme }) => theme.breakpoints.up('sm')} {
    padding: 0 24px;
  }
`;
