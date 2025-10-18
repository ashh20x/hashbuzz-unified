import {
  useGetCampaignsQuery,
  useGetRewardDetailsQuery,
  usePublishCampaignV201Mutation,
  useUpdateCampaignStatusMutation,
} from '@/API/campaign';
import {
  setActiveTab,
  setOpen,
  setOpenAssociateModal,
  setPreviewCard,
} from '@/Store/campaignListSlice';
import { useAppDispatch, useAppSelector } from '@/Store/store';
import {
  useApproveCampaignMutation,
  useGetPendingCampaignsQuery,
} from '@/Ver2Designs/Admin/api/admin';
import AddIcon from '@mui/icons-material/Add';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { CircularProgress } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridTreeNodeWithRender,
} from '@mui/x-data-grid';
import { uniqBy } from 'lodash';

// import { useCallback, useEffect, useMemo, useState } from 'react';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Countdown from 'react-countdown';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CampaignStatus } from '../../../../comman/helpers';
import DetailsModal from '../../../../components/PreviewModal/DetailsModal';
import { useRemoteConfig } from '../../../../hooks';
import { CampaignCards, CampaignCommands, UserConfig } from '../../../../types';
import AssociateModal from '../AssociateModal';
import AdminActionButtons from './AdminActionButtons';
import CampaignCardDetailModal from './CampaignCardDetailModal';
import { campaignListColumnsAdmin } from './CampaignListColumnsAdmin';
import TabNavigation, { TabsLabel } from './TabNavigationComponent';
import { campaignListColumns } from './campaignListCoulmns';
import {
  ActionBar,
  ActionButtonsContainer,
  ButtonGroup,
  CampaignCard,
  CampaignContainer,
  ChatGPTLink,
  DataGridWrapper,
  DataSection,
  Divider,
  HeaderContent,
  HeaderSection,
  InfoBanner,
  InfoIcon,
  InfoText,
  LoadingContainer,
  PrimaryActionButton,
  PrimaryButton,
  SecondaryActionButton,
  SecondaryButton,
  TabSection,
  dataGridStyles,
} from './styles';

const isButtonDisabled = (campaignStats: CampaignStatus, approve: boolean) => {
  const disabledStatuses = new Set([
    CampaignStatus.RewardDistributionInProgress,
    CampaignStatus.CampaignDeclined,
    CampaignStatus.RewardsDistributed,
    CampaignStatus.CampaignRunning,
    CampaignStatus.ApprovalPending,
  ]);
  return disabledStatuses.has(campaignStats) || !approve;
};

const getButtonLabel = (
  campaignStats: CampaignStatus,
  campaignStartTime: number,
  config?: UserConfig
) => {
  switch (campaignStats) {
    case CampaignStatus.RewardDistributionInProgress:
    case CampaignStatus.RewardsDistributed:
      return 'Completed';
    case CampaignStatus.ApprovalPending:
    case CampaignStatus.CampaignApproved:
      return 'Start';
    case CampaignStatus.CampaignRunning: {
      const campaignDuration = config?.campaignDuration ?? 1440;
      return (
        <Countdown
          date={
            Number(new Date(campaignStartTime).getTime()) +
            Number(campaignDuration) * 60 * 1000
          }
        />
      );
    }
    default:
      return 'Update';
  }
};

const getCampaignCommand = (status: CampaignStatus): CampaignCommands => {
  switch (status) {
    case CampaignStatus.CampaignApproved:
      return CampaignCommands.StartCampaign;
    case CampaignStatus.RewardDistributionInProgress:
      return CampaignCommands.ClaimReward;
    case CampaignStatus.CampaignRunning:
    case CampaignStatus.ApprovalPending:
    case CampaignStatus.CampaignDeclined:
    case CampaignStatus.RewardsDistributed:
    case CampaignStatus.CampaignStarted:
    case CampaignStatus.InternalError:
      return CampaignCommands.UserNotAvalidCommand;
    default:
      return CampaignCommands.UserNotAvalidCommand;
  }
};

const CampaignList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const campaignV201Enabled = useRemoteConfig('campaign_v201') as boolean;
  const [publishCampaign] = usePublishCampaignV201Mutation();

  // Use ref to prevent infinite loops
  const isUpdatingRef = useRef(false);

  // Redux state
  const { currentUser, balances } = useAppSelector(s => s.app);
  const { activeTab, modalData, open, openAssociateModal, previewCard } =
    useAppSelector(s => s.campaignList);

  const userRole = currentUser?.role;
  const isAdmin = userRole && ['ADMIN', 'SUPER_ADMIN'].includes(userRole);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  // RTK Query hooks
  const {
    data: campaignResponse,
    isLoading: campaignsLoading,
    isFetching: campaignsFetching,
    refetch: refetchCampaigns,
  } = useGetCampaignsQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
  });

  const {
    data: pendingCampaigns = [],
    isLoading: pendingLoading,
    refetch: refetchPending,
  } = useGetPendingCampaignsQuery(undefined, {
    skip: !isAdmin,
  });

  const {
    data: calimRewardsData,
    isLoading: claimLoading,
    refetch: refetchClaims,
  } = useGetRewardDetailsQuery();

  const [updateCampaignStatus] = useUpdateCampaignStatusMutation();
  const [updateAdminStatus] = useApproveCampaignMutation();

  // Handle refresh parameter from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('refresh') === 'true') {
      // Refresh campaign list
      refetchCampaigns();
      if (isAdmin) {
        refetchPending();
      }
      refetchClaims();

      // Clean up the URL by removing the refresh parameter
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('refresh');
      window.history.replaceState(
        {},
        document.title,
        newUrl.pathname + newUrl.search
      );
    }
  }, [
    location.search,
    refetchCampaigns,
    refetchPending,
    refetchClaims,
    isAdmin,
  ]);

  // Memoize stable values to prevent dependency issues
  const stableBalances = useMemo(() => balances, [balances]);
  const stableCampaignData = useMemo(
    () => campaignResponse?.data,
    [campaignResponse?.data]
  );
  const stableUserConfig = useMemo(
    () => currentUser?.config,
    [currentUser?.config]
  );

  const handleTabChange = useCallback(
    (tab: TabsLabel) => {
      if (isUpdatingRef.current) return;
      dispatch(setActiveTab(tab));
    },
    [dispatch]
  );

  const handleQuestClick = useCallback(() => {
    navigate('/app/create-quest');
  }, [navigate]);

  const handleTemplate = useCallback(() => {
    navigate('/app/create-campaign');
  }, [navigate]);

  const handleCard = useCallback(
    async (_id: number) => {
      if (isUpdatingRef.current) return;
      try {
        isUpdatingRef.current = true;
        dispatch(setOpen(true));
      } catch (error) {
        console.error(error);
      } finally {
        isUpdatingRef.current = false;
      }
    },
    [dispatch]
  );

  const handleClick = useCallback(
    async (values: CampaignCards) => {
      if (isUpdatingRef.current) return;
      try {
        isUpdatingRef.current = true;
        const campaign_command = getCampaignCommand(
          values?.card_status as CampaignStatus
        );

        if (campaign_command === CampaignCommands.UserNotAvalidCommand) {
          toast.warning('Not a valid action for this campaign');
          return;
        }

        const data = {
          card_id: values.id,
          campaign_command,
        };

        console.log({
          data,
          campaign_command,
          valid:
            campaignV201Enabled &&
            campaign_command === CampaignCommands.StartCampaign,
        });

        if (
          campaignV201Enabled &&
          campaign_command === CampaignCommands.StartCampaign
        ) {
          console.log({ data, campaign_command });
          await publishCampaign({
            campaignId: values.id,
            anyFinalComment: `command: ${campaign_command}`,
          });
          toast.success('Campaign publishing sequence is started successfully');
          return;
        } else {
          const response = await updateCampaignStatus(data).unwrap();
          if (response) {
            refetchCampaigns();
            toast.success(response.message);
          }
        }
      } catch (error: unknown) {
        console.error(error);
        toast.error(
          error && typeof error === 'object' && 'message' in error
            ? (error as { message?: string }).message
            : 'Failed to update campaign status'
        );
      } finally {
        isUpdatingRef.current = false;
      }
    },
    [
      updateCampaignStatus,
      refetchCampaigns,
      campaignV201Enabled,
      publishCampaign,
    ]
  );

  const handleAdminAction = useCallback(
    async (
      command:
        | CampaignCommands.AdminApprovedCampaign
        | CampaignCommands.AdminRejectedCampaign,
      cellValues: GridRenderCellParams<
        CampaignCards,
        CampaignCards,
        unknown,
        GridTreeNodeWithRender
      >
    ) => {
      if (isUpdatingRef.current) return;
      try {
        isUpdatingRef.current = true;
        const data = {
          approve: Boolean(command === CampaignCommands.AdminApprovedCampaign),
          id: cellValues?.row?.id,
        };
        const response = await updateAdminStatus(data).unwrap();
        refetchPending();
        refetchCampaigns();
        toast.success(response?.message);
      } catch (err) {
        console.error(err);
        toast.error('Failed to update admin status');
      } finally {
        isUpdatingRef.current = false;
      }
    },
    [updateAdminStatus, refetchPending, refetchCampaigns]
  );

  const handleCreateCampaignDisability = useMemo(() => {
    const entityBal = Boolean(stableBalances?.find(b => +b.entityBalance > 0));
    const runningCampaigns = stableCampaignData?.some(
      (campaign: CampaignCards) =>
        [
          CampaignStatus.CampaignRunning,
          CampaignStatus.ApprovalPending,
        ].includes(campaign.card_status)
    );
    return (
      !entityBal || runningCampaigns || !currentUser?.business_twitter_handle
    );
  }, [
    currentUser?.business_twitter_handle,
    stableCampaignData,
    stableBalances,
  ]);

  const handleCardsRefresh = useCallback(() => {
    refetchCampaigns();
    refetchPending();
    refetchClaims();
  }, [refetchCampaigns, refetchPending, refetchClaims]);

  // Use campaignResponse.data directly for DataGrid rows
  const campaignRows = useMemo(() => {
    if (!campaignResponse || !Array.isArray(campaignResponse.data)) return [];
    return campaignResponse.data.map((item: CampaignCards) => ({
      id: item.id,
      name: item.name,
      card_status: item.card_status,
      campaign_budget: item.campaign_budget,
      amount_spent: item.amount_spent,
      amount_claimed: item.amount_claimed,
      fungible_token_id: item.fungible_token_id,
      type: item.type,
      campaign_start_time: item.campaign_start_time,
      decimals: item.decimals,
      approve: item.approve,
    }));
  }, [campaignResponse]);

  // Column definitions with actions - memoize with stable dependencies
  const columns: GridColDef[] = useMemo(
    () => [
      ...campaignListColumns,
      {
        field: 'action',
        headerName: 'Actions',
        width: 200,
        renderCell: cellValues => (
          <ActionButtonsContainer>
            <PrimaryActionButton
              className={
                isButtonDisabled(
                  cellValues.row.card_status,
                  cellValues.row.approve
                )
                  ? 'disabled'
                  : ''
              }
              disabled={isButtonDisabled(
                cellValues.row.card_status,
                cellValues.row.approve
              )}
              onClick={() => handleClick(cellValues.row)}
            >
              {getButtonLabel(
                cellValues.row.card_status,
                cellValues.row.campaign_start_time,
                stableUserConfig
              )}
            </PrimaryActionButton>
            <SecondaryActionButton
              onClick={() => handleCard(cellValues.row.id)}
            >
              <InfoIcon fontSize='small' />
            </SecondaryActionButton>
          </ActionButtonsContainer>
        ),
      },
    ],
    [stableUserConfig, handleClick, handleCard]
  );

  const ADMINCOLUMNS: GridColDef[] = useMemo(
    () => [
      ...campaignListColumnsAdmin,
      {
        field: 'action',
        headerName: 'Actions',
        width: 200,
        renderCell: cellValues => (
          <AdminActionButtons
            cellValues={cellValues}
            handleAdminAction={handleAdminAction}
            setPreviewCard={card => dispatch(setPreviewCard(card))}
          />
        ),
      },
    ],
    [handleAdminAction, dispatch]
  );

  const getRows = useMemo(() => {
    if (activeTab === 'pending' && isAdmin) {
      return uniqBy(pendingCampaigns, 'id');
    }
    if (activeTab === 'claimRewards') {
      return uniqBy(calimRewardsData?.rewardDetails, 'id');
    }
    return campaignRows;
  }, [activeTab, isAdmin, pendingCampaigns, calimRewardsData, campaignRows]);

  const getColumns = useMemo(() => {
    if (activeTab === 'pending' && isAdmin) {
      return ADMINCOLUMNS;
    }
    return columns;
  }, [activeTab, isAdmin, ADMINCOLUMNS, columns]);

  const getTotalRowsCount = useMemo(() => {
    if (activeTab === 'pending' && isAdmin) {
      return pendingCampaigns.length;
    }
    if (activeTab === 'claimRewards') {
      return calimRewardsData?.rewardDetails.length || 0;
    }
    return campaignResponse?.pagination?.total || 0;
  }, [
    activeTab,
    isAdmin,
    pendingCampaigns,
    calimRewardsData,
    campaignResponse,
  ]);

  const isLoading = campaignsLoading || pendingLoading || claimLoading;
  const isGridLoading = campaignsFetching || pendingLoading || claimLoading;

  return (
    <CampaignContainer>
      <CampaignCard>
        {/* Header Section */}
        <HeaderSection>
          <HeaderContent>
            {/* Info Banner */}
            <InfoBanner>
              <InfoIcon>
                <InfoOutlinedIcon />
              </InfoIcon>
              <InfoText>
                In the current beta phase, please note that only one campaign
                can be run at a time. Each initiated campaign will automatically
                end 1 hour after its start. We plan to incrementally ease these
                restrictions in the future. Also, be informed that your balance
                can be used without any limits across different campaigns.
              </InfoText>
            </InfoBanner>

            {/* Action Bar */}
            <ActionBar>
              <TabSection>
                <TabNavigation
                  activeTab={activeTab}
                  setActiveTab={handleTabChange}
                  isAdmin={!!isAdmin}
                  handleCardsRefresh={handleCardsRefresh}
                />
              </TabSection>

              <ButtonGroup>
                {isAdmin && (
                  <SecondaryButton
                    onClick={() => dispatch(setOpenAssociateModal(true))}
                  >
                    Associate
                  </SecondaryButton>
                )}

                <ChatGPTLink
                  href='https://chat.openai.com/g/g-cGD9GbBPY-hashbuzz'
                  target='_blank'
                  rel='noreferrer'
                >
                  Connect with ChatGPT
                </ChatGPTLink>

                <PrimaryButton
                  disabled={handleCreateCampaignDisability}
                  onClick={handleTemplate}
                >
                  <AddIcon fontSize='small' />
                  Create Campaign
                </PrimaryButton>
                <PrimaryButton
                  disabled={handleCreateCampaignDisability}
                  onClick={handleQuestClick}
                >
                  <AddIcon fontSize='small' />
                  Create Quest
                </PrimaryButton>
              </ButtonGroup>
            </ActionBar>
          </HeaderContent>
        </HeaderSection>

        <Divider />

        {/* Data Section */}
        <DataSection>
          <DataGridWrapper>
            {isLoading ? (
              <LoadingContainer>
                <CircularProgress size={32} />
              </LoadingContainer>
            ) : (
              <DataGrid
                rows={getRows}
                rowCount={getTotalRowsCount || 0}
                columns={getColumns}
                pageSizeOptions={[5, 10, 20]}
                paginationMode='server'
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                loading={isGridLoading}
                disableRowSelectionOnClick
                autoHeight={false}
                sx={dataGridStyles}
              />
            )}
          </DataGridWrapper>
        </DataSection>
      </CampaignCard>

      {/* Modals */}
      <DetailsModal
        open={open}
        setOpen={(isOpen: boolean) => dispatch(setOpen(isOpen))}
        data={modalData}
      />

      <CampaignCardDetailModal
        open={Boolean(previewCard)}
        data={previewCard}
        onClose={() => dispatch(setPreviewCard(null))}
      />

      <AssociateModal
        open={openAssociateModal}
        onClose={() => dispatch(setOpenAssociateModal(false))}
      />
    </CampaignContainer>
  );
};

export default CampaignList;
