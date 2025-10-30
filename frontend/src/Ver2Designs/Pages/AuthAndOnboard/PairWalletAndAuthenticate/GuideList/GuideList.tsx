import { Stack } from '@mui/material';
import * as styles from './styles';

interface GuideListProps {
  guidesList: {
    lable: string;
    description: string;
    avialble: boolean;
    link?: {
      lable: string;
      icon: React.ReactNode;
      url: string;
    };
  }[];
}

const GuideList: React.FC<GuideListProps> = ({ guidesList }) =>
  guidesList.map((guide, index) => (
    <Stack
      flexDirection={{
        xs: 'column',
        sm: 'row',
        md: 'row',
      }}
      alignItems={{
        xs: 'flex-start',
        sm: 'flex-start',
        md: 'center',
      }}
      gap={{
        xs: 2,
        sm: 2,
        md: 0,
      }}
      sx={styles.stepContainer}
    >
      <div className='counter'>
        <span>{index + 1}</span>
      </div>
      <div className='content'>
        <h3>{guide.lable}</h3>
        <p>{guide.description}</p>
      </div>
      <div className='linkOrStatus'>
        {guide.link && (
          <a target='_blank' href={guide.link.url}>
            {guide.link.lable}
            <span>{guide.link.icon}</span>
          </a>
        )}
      </div>
    </Stack>
  ));

export default GuideList;
