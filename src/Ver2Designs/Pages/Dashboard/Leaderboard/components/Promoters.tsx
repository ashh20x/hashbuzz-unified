import { Box } from '@mui/material';
import { Leaderboard } from '../../../../../Data/Leaderboard';
import LeaderboardContainer from './LeaderboardContainer';
import {
  HashbuzzPoints,
  LeaderboardItem,
  LeaderboardWrapper,
  MobileUserInfoSection,
  PointsSection,
  ProfileImage,
  ProfileSection,
  RankNumber,
  RankSection,
  Title,
  TopThreeContainer,
  UserHandle,
  UserInfoSection,
} from './styled';

const Promoters = () => {
  return (
    <Box
      sx={{
        mt: { xs: '3rem', sm: 0 },
      }}
    >
      <Title>Promoters</Title>
      <LeaderboardContainer>
        <LeaderboardWrapper>
          {Leaderboard.map(user => {
            const isTopThree = user.id <= 3;

            return (
              <LeaderboardItem key={user.id} isTopThree={isTopThree}>
                {/* Desktop Layout */}
                <div className='desktop-layout'>
                  {/* Rank Section - Hidden for top 3, shown for others */}
                  {!isTopThree && (
                    <RankSection>
                      <RankNumber>{user.rank}</RankNumber>
                    </RankSection>
                  )}

                  {/* Profile Section */}
                  <ProfileSection>
                    {/* Profile Image - Only for top 3 */}
                    {isTopThree && user.image && (
                      <ProfileImage
                        src={user.image}
                        alt={`${user.xHandle} profile`}
                      />
                    )}

                    {/* User Info */}
                    <UserInfoSection>
                      <UserHandle>{user.xHandle}</UserHandle>
                    </UserInfoSection>

                    {/* Points Section */}
                    <PointsSection>
                      <HashbuzzPoints>{user.hashbuzzPoints}</HashbuzzPoints>
                    </PointsSection>
                  </ProfileSection>

                  {/* Top 3 Indicator */}
                  {isTopThree && <TopThreeContainer />}
                </div>

                {/* Mobile Layout */}
                <div className='mobile-layout'>
                  {/* Left side: Rank/Image */}
                  <div className='mobile-rank-section'>
                    {isTopThree && user.image ? (
                      <ProfileImage
                        src={user.image}
                        alt={`${user.xHandle} profile`}
                      />
                    ) : (
                      <RankSection>
                        <RankNumber>{user.rank}</RankNumber>
                      </RankSection>
                    )}
                  </div>

                  {/* Right side: User info in column */}
                  <MobileUserInfoSection>
                    <UserHandle>{user.xHandle}</UserHandle>
                    <HashbuzzPoints>{user.hashbuzzPoints}</HashbuzzPoints>
                  </MobileUserInfoSection>

                  {/* Top 3 Indicator */}
                  {isTopThree && <TopThreeContainer />}
                </div>
              </LeaderboardItem>
            );
          })}
        </LeaderboardWrapper>
      </LeaderboardContainer>
    </Box>
  );
};

export default Promoters;
