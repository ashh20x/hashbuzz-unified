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

const Engagers = () => {
  return (
    <div>
      <Title>Engagers</Title>
      <LeaderboardContainer>
        <LeaderboardWrapper>
          {Leaderboard.map(user => {
            const isTopThree = user.id <= 3;

            return (
              <LeaderboardItem key={user.id} isTopThree={isTopThree}>
                {/* Desktop Layout */}
                <div className='desktop-layout'>
                  {!isTopThree && (
                    <RankSection>
                      <RankNumber>{user.rank}</RankNumber>
                    </RankSection>
                  )}

                  {/* Profile Section */}
                  <ProfileSection>
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

                  <MobileUserInfoSection>
                    <UserHandle>{user.xHandle}</UserHandle>
                    <HashbuzzPoints>{user.hashbuzzPoints}</HashbuzzPoints>
                  </MobileUserInfoSection>

                  {isTopThree && <TopThreeContainer />}
                </div>
              </LeaderboardItem>
            );
          })}
        </LeaderboardWrapper>
      </LeaderboardContainer>
    </div>
  );
};

export default Engagers;
