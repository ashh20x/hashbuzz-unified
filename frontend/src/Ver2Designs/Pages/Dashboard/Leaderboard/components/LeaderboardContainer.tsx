import {
  ChevronLeft,
  ChevronRight,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { useMediaQuery, useTheme } from '@mui/material';
import {
  ButtonsBox,
  ContentSection,
  FooterRow,
  FooterSection,
  HandleHeaderBox,
  HeaderRow,
  HeaderSection,
  HeaderTypography,
  MobileHeaderRow,
  NavigationButton,
  PageInfoBox,
  PageTypography,
  PointsHeaderBox,
  RankHeaderBox,
  SortIconsBox,
  StyledPaper,
} from './styled';

interface LeaderboardContainerProps {
  children: any;
}

const LeaderboardContainer = ({ children }: LeaderboardContainerProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <StyledPaper>
      <HeaderSection>
        {/* Desktop Header */}
        <HeaderRow className='desktop-header'>
          <RankHeaderBox>
            <HeaderTypography variant={isMobile ? 'body2' : 'body1'}>
              Rank
            </HeaderTypography>
          </RankHeaderBox>

          {/* X handle */}
          <HandleHeaderBox>
            <HeaderTypography variant={isMobile ? 'body2' : 'body1'}>
              X handle
            </HeaderTypography>
            <SortIconsBox>
              <KeyboardArrowUp sx={{ fontSize: 20, lineHeight: 1 }} />
              <KeyboardArrowDown
                sx={{ fontSize: 20, lineHeight: 1, mt: -0.5 }}
              />
            </SortIconsBox>
          </HandleHeaderBox>

          {/* Hashbuzz points */}
          <PointsHeaderBox>
            <HeaderTypography variant={isMobile ? 'body2' : 'body1'}>
              Hashbuzz points
            </HeaderTypography>
            <KeyboardArrowDown
              sx={{
                fontSize: 24,
                color: '#6c757d',
                opacity: 0.8,
              }}
            />
          </PointsHeaderBox>
        </HeaderRow>

        {/* Mobile Header  */}
        <MobileHeaderRow className='mobile-header'>
          <HeaderTypography variant='body2'>Rank</HeaderTypography>
          <HeaderTypography variant='body2'>X handle</HeaderTypography>
        </MobileHeaderRow>
      </HeaderSection>

      {/* Content Section */}
      <ContentSection>{children}</ContentSection>

      {/* Footer Section */}
      <FooterSection>
        <FooterRow>
          <ButtonsBox>
            <NavigationButton
              variant='outlined'
              startIcon={<ChevronLeft sx={{ fontSize: 20 }} />}
            >
              Previous
            </NavigationButton>

            <NavigationButton
              variant='outlined'
              endIcon={<ChevronRight sx={{ fontSize: 20 }} />}
            >
              Next
            </NavigationButton>
          </ButtonsBox>

          <PageInfoBox>
            <PageTypography variant='body1'>Page 1 of 10</PageTypography>
          </PageInfoBox>
        </FooterRow>
      </FooterSection>
    </StyledPaper>
  );
};

export default LeaderboardContainer;
