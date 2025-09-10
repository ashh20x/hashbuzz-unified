import { Box, useTheme } from '@mui/material';
import LunchPromo from '../../../../../SVGR/LunchPromo';
import MoneyIcon from '../../../../../SVGR/MoneyIcon';
import RewardEngagement from '../../../../../SVGR/RewardEngagement';
import SearchIcon from '../../../../../SVGR/SearchIcon';
import XPlatformIcon from '../../../../../SVGR/XPlatformIcon';
import EarningPromoSection from './EarningPromoSection/EarningPromoSection';
import * as styles from './styles';
import { SectionData } from './types';

export const sectionsData: SectionData[] = [
  {
    sectionId: 'engagers-section',
    heading: 'Engagers',
    paragraphs: [
      'Step into the world of hashbuzz as an engager and turn your voice into value. By joining the platform, you’ll gain access to a curated stream of brand promotions on 𝕏, where your genuine interactions—likes, reposts, comments—are recognised and rewarded in HTS tokens.',
      'No gimmicks, no empty clicks—just meaningful participation that earns you real digital assets. Whether you’re here to support projects you believe in or simply engage with high-quality content, hashbuzz makes every action count.',
    ],
    items: [
      {
        id: 'explore-promos',
        icon: <SearchIcon size={40} />,
        title: 'Explore Promos',
        desc: 'Browse promo posts from your dashboard.',
      },
      {
        id: 'engage-on-x',
        icon: <XPlatformIcon size={40} />,
        title: 'Engage on 𝕏',
        desc: 'Like, repost, or comment on selected 𝕏 posts.',
      },
      {
        id: 'earn-instantly',
        icon: <MoneyIcon size={40} />,
        title: 'Earn Instantly',
        desc: 'Earn credits directly after completing simple engagement tasks.',
      },
    ],
  },
  {
    sectionId: 'campaigners-section',
    heading: 'Campaigner',
    paragraphs: [
      "Hashbuzz leveraging project tokens, brands can significantly boost their visibility and exposure. This approach not only enhances token adoption within the community but also transforms regular posts into viral sensations. Expect a substantial increase in overall engagement, as your audience becomes more interactive and invested in your brand's success.",
      'Additionally, hashbuzz drives authentic interactions, builds long-term brand loyalty, and taps into new audience segments, fostering a stronger, more vibrant community around your brand.',
    ],
    items: [
      {
        id: 'launch-promos',
        icon: <LunchPromo size={40} />,
        title: 'Launch Promos',
        desc: 'Create multiple promo campaigns with custom links.',
      },
      {
        id: 'add-budget',
        icon: <MoneyIcon size={40} />,
        title: 'Add Budget',
        desc: 'Fund with HBAR or approved tokens.',
      },
      {
        id: 'reward-engagement',
        icon: <RewardEngagement size={40} />,
        title: 'Reward Engagement',
        desc: 'Reward real community members who engage with your brand.',
      },
    ],
  },
];

const EarningAndPromo = () => {
  const theme = useTheme();
  return (
    <Box
      id='earning-and-promo-section'
      component='section'
      sx={styles.earningAndPromoSection(theme)}
    >
      <Box
        id='earning-and-promo-container'
        sx={styles.earningAndPromoContainer}
      >
        <h3>
          Start <span>Earning</span> or Start <span>Promoting</span>
        </h3>
        {sectionsData.map(section => (
          <EarningPromoSection key={section.sectionId} {...section} />
        ))}
      </Box>
    </Box>
  );
};

export default EarningAndPromo;
