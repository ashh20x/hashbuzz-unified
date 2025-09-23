import {
  ChatBubbleOutline,
  FavoriteBorder,
  FormatQuote,
  OpenInNew,
  Repeat,
} from '@mui/icons-material';
import { Checkbox, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RewardHistory } from '../../../../Data/History';
import {
  ActionChip,
  ActionsContainer,
  BrandContainer,
  BrandLogo,
  BrandName,
  CheckboxContainer,
  EarnedAmount,
  EarnedContainer,
  ExternalIcon,
  HeaderContainer,
  HeaderText,
  MobileActionsSection,
  MobileBrandSection,
  MobileCard,
  MobileCardContent,
  MobileCardHeader,
  MobileCheckboxContainer,
  MobileEarnedSection,
  MobileFooterSection,
  // responsive components
  MobileGridContainer,
  MobileTitleSection,
  PageInfo,
  PaginationButton,
  PaginationContainer,
  PromoContainer,
  PromoDate,
  PromoTitle,
  RewardsContainer,
  RowContainer,
  SkeletonActionsContainer,
  SkeletonBrandContainer,
  SkeletonEarnedContainer,
  SkeletonMobileCard,
  SkeletonPromoContainer,
  SkeletonRowContainer,
} from './styled';

interface Action {
  type: string;
  reward: string;
  color: string;
}

interface RewardItem {
  id: number;
  promo: string;
  brand: string;
  brandLogo: string;
  brandColor: string;
  date: string;
  time: string;
  actions: Action[];
  totalEarned: string;
}

const getActionIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'comment':
      return <ChatBubbleOutline />;
    case 'repost':
      return <Repeat />;
    case 'quote':
      return <FormatQuote />;
    case 'like':
      return <FavoriteBorder />;
    default:
      return undefined;
  }
};

const getActionClass = (type: string) => {
  return type.toLowerCase();
};

const LoadingSkeleton = ({ isMobile }: { isMobile: boolean }) => {
  if (isMobile) {
    return (
      <MobileGridContainer>
        {[...Array(9)].map((_, index) => (
          <SkeletonMobileCard key={index}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  flex: 1,
                }}
              >
                <Skeleton variant='rectangular' width={20} height={20} />
                <Skeleton variant='text' width='70%' height={20} />
              </div>
              <Skeleton variant='text' width={60} height={20} />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
              }}
            >
              <Skeleton variant='circular' width={24} height={24} />
              <Skeleton variant='text' width={80} height={16} />
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                marginBottom: '12px',
              }}
            >
              <Skeleton variant='rounded' width={60} height={24} />
              <Skeleton variant='rounded' width={55} height={24} />
              <Skeleton variant='rounded' width={50} height={24} />
              <Skeleton variant='rounded' width={65} height={24} />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '1px solid #f3f4f6',
              }}
            >
              <Skeleton variant='text' width={100} height={16} />
              <Skeleton variant='text' width={20} height={16} />
            </div>
          </SkeletonMobileCard>
        ))}
      </MobileGridContainer>
    );
  }

  return (
    <>
      {[...Array(9)].map((_, index) => (
        <SkeletonRowContainer key={index}>
          <CheckboxContainer>
            <Skeleton variant='rectangular' width={20} height={20} />
          </CheckboxContainer>

          <SkeletonPromoContainer>
            <Skeleton variant='text' width='80%' height={24} />
            <Skeleton variant='text' width='60%' height={20} />
          </SkeletonPromoContainer>

          <SkeletonBrandContainer>
            <Skeleton variant='circular' width={32} height={32} />
            <Skeleton variant='text' width={100} height={20} />
          </SkeletonBrandContainer>

          <SkeletonActionsContainer>
            <Skeleton variant='rounded' width={80} height={28} />
            <Skeleton variant='rounded' width={75} height={28} />
            <Skeleton variant='rounded' width={70} height={28} />
            <Skeleton variant='rounded' width={65} height={28} />
          </SkeletonActionsContainer>

          <SkeletonEarnedContainer>
            <Skeleton variant='text' width={80} height={24} />
          </SkeletonEarnedContainer>
        </SkeletonRowContainer>
      ))}
    </>
  );
};

const MobileCardItem = ({
  item,
  isSelected,
  onSelect,
}: {
  item: RewardItem;
  isSelected: boolean;
  onSelect: (id: number) => void;
}) => (
  <MobileCard isSelected={isSelected}>
    <MobileCardHeader>
      <MobileCheckboxContainer>
        <Checkbox
          checked={isSelected}
          onChange={() => onSelect(item.id)}
          size='small'
        />
      </MobileCheckboxContainer>
      <MobileTitleSection>
        <PromoTitle>
          {item.promo}
          <ExternalIcon>
            <OpenInNew fontSize='inherit' />
          </ExternalIcon>
        </PromoTitle>
      </MobileTitleSection>
      <MobileEarnedSection>
        <EarnedAmount className='mobile-earned'>
          {item.totalEarned}
        </EarnedAmount>
      </MobileEarnedSection>
    </MobileCardHeader>

    <MobileCardContent>
      <MobileBrandSection>
        <BrandLogo
          src={item.brandLogo}
          alt={`${item.brand} logo`}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            padding: '2px',
          }}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) {
              fallback.style.display = 'flex';
              fallback.style.alignItems = 'center';
              fallback.style.justifyContent = 'center';
              fallback.style.width = '24px';
              fallback.style.height = '24px';
              fallback.style.backgroundColor = item.brandColor;
              fallback.style.color = '#fff';
              fallback.style.borderRadius = '50%';
              fallback.style.fontSize = '12px';
              fallback.style.fontWeight = 'bold';
              fallback.textContent = item.brand.charAt(0).toUpperCase();
            }
          }}
        />
        <span style={{ display: 'none' }}></span>
        <BrandName>{item.brand}</BrandName>
      </MobileBrandSection>

      <MobileActionsSection>
        {item.actions.map((action: Action, index: number) => (
          <ActionChip
            key={index}
            icon={getActionIcon(action.type)}
            label={`${action.type} ${action.reward}`}
            variant='outlined'
            size='small'
            className={getActionClass(action.type)}
            style={{ color: action.color, borderColor: action.color }}
          />
        ))}
      </MobileActionsSection>

      <MobileFooterSection>
        <PromoDate>
          {item.date} • {item.time}
        </PromoDate>
        <div
          style={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}
        >
          →
        </div>
      </MobileFooterSection>
    </MobileCardContent>
  </MobileCard>
);

const RewardsHistory: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage] = useState(1);
  const totalPages = 10;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSelectItem = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === RewardHistory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(RewardHistory.map(item => item.id));
    }
  };

  const isAllSelected = selectedItems.length === RewardHistory.length;
  const isIndeterminate =
    selectedItems.length > 0 && selectedItems.length < RewardHistory.length;

  return (
    <RewardsContainer>
      {/* Header - only show on desktop */}
      {!isMobile && (
        <HeaderContainer>
          <CheckboxContainer>
            <Checkbox
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onChange={handleSelectAll}
              size='small'
              disabled={isLoading}
            />
          </CheckboxContainer>
          <HeaderText>Promo</HeaderText>
          <HeaderText>Brand</HeaderText>
          <HeaderText>Action taken</HeaderText>
          <HeaderText>Earned</HeaderText>
        </HeaderContainer>
      )}

      {/* Content */}
      {isLoading ? (
        <LoadingSkeleton isMobile={isMobile} />
      ) : isMobile ? (
        <MobileGridContainer>
          {RewardHistory.map((item: RewardItem) => (
            <MobileCardItem
              key={item.id}
              item={item}
              isSelected={selectedItems.includes(item.id)}
              onSelect={handleSelectItem}
            />
          ))}
        </MobileGridContainer>
      ) : (
        RewardHistory.map((item: RewardItem) => (
          <RowContainer
            key={item.id}
            isSelected={selectedItems.includes(item.id)}
          >
            <CheckboxContainer>
              <Checkbox
                checked={selectedItems.includes(item.id)}
                onChange={() => handleSelectItem(item.id)}
                size='small'
              />
            </CheckboxContainer>

            <PromoContainer>
              <PromoTitle>
                {item.promo}
                <ExternalIcon>
                  <OpenInNew fontSize='inherit' />
                </ExternalIcon>
              </PromoTitle>
              <PromoDate>
                {item.date} • {item.time}
              </PromoDate>
            </PromoContainer>

            <BrandContainer>
              <BrandLogo
                src={item.brandLogo}
                alt={`${item.brand} logo`}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  padding: '4px',
                }}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.style.display = 'flex';
                    fallback.style.alignItems = 'center';
                    fallback.style.justifyContent = 'center';
                    fallback.style.width = '32px';
                    fallback.style.height = '32px';
                    fallback.style.backgroundColor = item.brandColor;
                    fallback.style.color = '#fff';
                    fallback.style.borderRadius = '50%';
                    fallback.style.fontSize = '14px';
                    fallback.style.fontWeight = 'bold';
                    fallback.textContent = item.brand.charAt(0).toUpperCase();
                  }
                }}
              />
              <span style={{ display: 'none' }}></span>
              <BrandName>{item.brand}</BrandName>
            </BrandContainer>

            <ActionsContainer>
              {item.actions.map((action: Action, index: number) => (
                <ActionChip
                  key={index}
                  icon={getActionIcon(action.type)}
                  label={`${action.type} ${action.reward}`}
                  variant='outlined'
                  size='small'
                  className={getActionClass(action.type)}
                  style={{ color: action.color, borderColor: action.color }}
                />
              ))}
            </ActionsContainer>

            <EarnedContainer>
              <EarnedAmount>{item.totalEarned}</EarnedAmount>
            </EarnedContainer>
          </RowContainer>
        ))
      )}

      {/* Pagination */}
      <PaginationContainer>
        <PaginationButton
          variant='outlined'
          disabled={currentPage === 1 || isLoading}
        >
          Previous
        </PaginationButton>

        <PageInfo>
          Page {currentPage} of {totalPages}
        </PageInfo>

        <PaginationButton
          variant='outlined'
          disabled={currentPage === totalPages || isLoading}
        >
          Next
        </PaginationButton>
      </PaginationContainer>
    </RewardsContainer>
  );
};

export default RewardsHistory;
