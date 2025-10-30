import { Avatar, Box, Button, Paper, styled, Typography } from '@mui/material';

//------------------------- LeaderboardContainer Styles
export const StyledPaper = styled(Paper)(
  () => `
  border-radius: 8px;
  overflow: hidden;
  max-width: 100%;
  margin: 0 auto;
  border: 1px solid #e0e0e0;
`
);

export const HeaderSection = styled(Box)(
  ({ theme }) => `
  border-bottom: 2px solid #e9ecef;
  padding: ${theme.spacing(2)};

  ${theme.breakpoints.up('sm')} {
    padding: ${theme.spacing(3)};
  }
`
);

export const HeaderRow = styled(Box)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  gap: ${theme.spacing(2)};

  ${theme.breakpoints.down('sm')} {
    &.desktop-header {
      display: none;
    }
  }

  ${theme.breakpoints.up('sm')} {
    &.mobile-header {
      display: none;
    }
  }
`
);

export const MobileHeaderRow = styled(Box)(
  ({ theme }) => `
  display: flex;
  align-items: center;

  gap: ${theme.spacing(6)};

  ${theme.breakpoints.up('sm')} {
    display: none;
  }
`
);

export const RankHeaderBox = styled(Box)(
  ({ theme }) => `
  width: 16.67%;
  flex-shrink: 0;

  ${theme.breakpoints.up('sm')} {
    width: 12.5%;
  }
`
);

export const HandleHeaderBox = styled(Box)(
  ({ theme }) => `
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1)};
`
);

export const PointsHeaderBox = styled(Box)(
  ({ theme }) => `
  width: 33.33%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${theme.spacing(1)};
  flex-shrink: 0;

  ${theme.breakpoints.up('sm')} {
    width: 29.17%;
  }
`
);

export const HeaderTypography = styled(Typography)(
  ({ theme }) => `
  color: #6c757d;
  font-size: 14px;

  ${theme.breakpoints.up('sm')} {
    // font-size: 1rem;
  }
`
);

export const SortIconsBox = styled(Box)(
  () => `
  display: flex;
  flex-direction: column;
  opacity: 0.7;
`
);

export const ContentSection = styled(Box)(
  ({ theme }) => `
  background-color: #fff;
  min-height: 200px;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;

  ${theme.breakpoints.up('sm')} {
    min-height: 300px;
  }

  ${theme.breakpoints.up('md')} {
    min-height: 400px;
  }
`
);

export const FooterSection = styled(Box)(
  ({ theme }) => `
  background-color: #f8f9fa;
  border-top: 2px solid #e9ecef;
  padding: ${theme.spacing(2)};

  ${theme.breakpoints.up('sm')} {
    padding: ${theme.spacing(3)};
  }
`
);

export const FooterRow = styled(Box)(
  ({ theme }) => `
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${theme.spacing(2)};
  flex-direction: column;

  ${theme.breakpoints.up('sm')} {
    flex-direction: row;
  }
`
);

export const ButtonsBox = styled(Box)(
  ({ theme }) => `
  display: flex;
  gap: ${theme.spacing(2)};
  order: 2;
  width: 100%;

  ${theme.breakpoints.up('sm')} {
    order: 1;
    width: auto;
  }
`
);

export const PageInfoBox = styled(Box)(
  ({ theme }) => `
  order: 1;
  width: 100%;

  ${theme.breakpoints.up('sm')} {
    order: 2;
    width: auto;
  }
`
);

export const NavigationButton = styled(Button)(
  ({ theme }) => `
  border-color: #dee2e6;
  color: #6c757d;
  text-transform: none;
  font-weight: 500;
  border-radius: 8px;
  padding: ${theme.spacing(1, 2)};
  width: 100%;

  ${theme.breakpoints.up('sm')} {
    padding: ${theme.spacing(1, 3)};
    width: auto;
  }

  &:hover {
    border-color: #adb5bd;
    background-color: #f8f9fa;
  }
`
);

export const PageTypography = styled(Typography)(
  ({ theme }) => `
  text-align: center;
  font-weight: 500;
  color: #495057;
  font-size: 0.8rem;

  ${theme.breakpoints.up('sm')} {
    text-align: right;

  }
`
);

//------------------------- Leaderboard Engagers & Promoters Styles
export const LeaderboardWrapper = styled(Box)(
  ({ theme }) => `
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 16px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  ${theme.breakpoints.between('sm', 'md')} {
    box-shadow: none;
  }
`
);

export const Title = styled(Typography)(
  ({ theme }) => `
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 14px;
  padding-left: 10px;

  ${theme.breakpoints.down('sm')} {
    font-size: 14px;
    margin-bottom: 12px;
    margin-top: 1rem;
  }
`
);

export const LeaderboardItem = styled(Box)<{ isTopThree?: boolean }>(
  ({ theme, isTopThree }) => `
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }

  /* Desktop Layout */
  .desktop-layout {
    display: flex;
    align-items: center;
    padding: ${isTopThree ? '10px 13px' : '14px'};

    ${theme.breakpoints.down('sm')} {
      display: none;
    }
  }

  /* Mobile Layout */
  .mobile-layout {
    display: none;

    ${theme.breakpoints.down('sm')} {
      display: flex;
      align-items: center;
      padding: 12px 14px;
      gap: 12px;
    }
  }

  .mobile-rank-section {
    min-width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`
);

export const RankSection = styled(Box)(
  ({ theme }) => `
  min-width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${theme.breakpoints.down('sm')} {
    align-self: flex-start;
    min-width: auto;
  }
`
);

export const ProfileSection = styled(Box)(
  ({ theme }) => `
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;

  ${theme.breakpoints.down('sm')} {
    width: 100%;
    justify-content: space-between;
  }
`
);

export const UserInfoSection = styled(Box)(
  ({ theme }) => `
  flex: 1;

  ${theme.breakpoints.down('sm')} {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`
);

export const MobileUserInfoSection = styled(Box)(
  () => `
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
`
);

export const PointsSection = styled(Box)(
  ({ theme }) => `
  min-width: 100px;
  text-align: right;

  ${theme.breakpoints.down('sm')} {
    text-align: left;
    min-width: auto;
  }
`
);

export const RankNumber = styled(Typography)(
  ({ theme }) => `
  font-size: 14px;
  font-weight: 600;
  color: #666;

  ${theme.breakpoints.down('sm')} {
    font-size: 16px;
  }
`
);

export const ProfileImage = styled(Avatar)(
  ({ theme }) => `
  width: 38px;
  height: 38px;
  border: 2px solid #e0e0e0;

  ${theme.breakpoints.down('sm')} {
    width: 40px;
    height: 40px;
  }
`
);

export const UserHandle = styled(Typography)(
  ({ theme }) => `
  font-size: 14px;
  font-weight: 500;
  color: #333;

  ${theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`
);

export const HashbuzzPoints = styled(Typography)(
  ({ theme }) => `
  font-size: 13px;
  font-weight: 600;
  color: #1a73e8;
  text-align: left;

  ${theme.breakpoints.down('sm')} {
    font-size: 14px;
    font-weight: 500;
    text-align: left;
  }
`
);

export const TopThreeContainer = styled(Box)(
  () => `
  position: relative;

  &::after {
    content: '';
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 60%;
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    border-radius: 2px;
    opacity: 0.7;
  }
`
);
