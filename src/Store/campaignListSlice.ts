import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CampaignCards } from '../types/campaign'

export interface CampaignListState {
  // UI State
  activeTab: 'all' | 'pending' | 'claimRewards'
  openAssociateModal: boolean
  open: boolean
  loading: boolean
  
  // Data State
  rows: CampaignCards[]
  adminPendingCards: CampaignCards[]
  claimPendingRewards: any[]
  modalData: any
  previewCard: any
  
  // Campaign State
  runningCampaigns: boolean
  buttonDisabled: boolean
  
  // Filters and Search
  searchQuery: string
  statusFilter: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  
  // Pagination
  page: number
  pageSize: number
  totalCount: number
}

const initialState: CampaignListState = {
  // UI State
  activeTab: 'all',
  openAssociateModal: false,
  open: false,
  loading: false,
  
  // Data State
  rows: [],
  adminPendingCards: [],
  claimPendingRewards: [],
  modalData: {},
  previewCard: null,
  
  // Campaign State
  runningCampaigns: false,
  buttonDisabled: false,
  
  // Filters and Search
  searchQuery: '',
  statusFilter: '',
  sortBy: 'id',
  sortOrder: 'desc',
  
  // Pagination
  page: 0,
  pageSize: 20,
  totalCount: 0,
}

const campaignListSlice = createSlice({
  name: 'campaignList',
  initialState,
  reducers: {
    // UI State Actions
    setActiveTab: (state, action: PayloadAction<'all' | 'pending' | 'claimRewards'>) => {
      state.activeTab = action.payload
      // Reset pagination when changing tabs
      state.page = 0
    },
    
    setOpenAssociateModal: (state, action: PayloadAction<boolean>) => {
      state.openAssociateModal = action.payload
    },
    
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    
    // Data State Actions
    setCampaignRows: (state, action: PayloadAction<CampaignCards[]>) => {
      state.rows = action.payload
      state.totalCount = action.payload.length
    },
    
    setAdminPendingCards: (state, action: PayloadAction<CampaignCards[]>) => {
      state.adminPendingCards = action.payload
    },
    
    setClaimPendingRewards: (state, action: PayloadAction<any[]>) => {
      state.claimPendingRewards = action.payload
    },
    
    setModalData: (state, action: PayloadAction<any>) => {
      state.modalData = action.payload
    },
    
    setPreviewCard: (state, action: PayloadAction<any>) => {
      state.previewCard = action.payload
    },
    
    // Campaign State Actions
    setRunningCampaigns: (state, action: PayloadAction<boolean>) => {
      state.runningCampaigns = action.payload
    },
    
    setButtonDisabled: (state, action: PayloadAction<boolean>) => {
      state.buttonDisabled = action.payload
    },
    
    // Filter and Search Actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.page = 0 // Reset pagination when searching
    },
    
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload
      state.page = 0 // Reset pagination when filtering
    },
    
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload
    },
    
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload
    },
    
    // Pagination Actions
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload
      state.page = 0 // Reset to first page when changing page size
    },
    
    setTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload
    },
    
    // Utility Actions
    resetFilters: (state) => {
      state.searchQuery = ''
      state.statusFilter = ''
      state.page = 0
    },
    
    // Update campaign in rows
    updateCampaignInRows: (state, action: PayloadAction<{ id: number; updates: Partial<CampaignCards> }>) => {
      const { id, updates } = action.payload
      const index = state.rows.findIndex(campaign => campaign.id === id)
      if (index !== -1) {
        state.rows[index] = { ...state.rows[index], ...updates }
      }
    },
    
    // Remove campaign from rows
    removeCampaignFromRows: (state, action: PayloadAction<number>) => {
      state.rows = state.rows.filter(campaign => campaign.id !== action.payload)
      state.totalCount = state.rows.length
    },
    
    // Add new campaign to rows
    addCampaignToRows: (state, action: PayloadAction<CampaignCards>) => {
      state.rows.unshift(action.payload) // Add to beginning
      state.totalCount = state.rows.length
    },
  },
})

export const {
  // UI State Actions
  setActiveTab,
  setOpenAssociateModal,
  setOpen,
  setLoading,
  
  // Data State Actions
  setCampaignRows,
  setAdminPendingCards,
  setClaimPendingRewards,
  setModalData,
  setPreviewCard,
  
  // Campaign State Actions
  setRunningCampaigns,
  setButtonDisabled,
  
  // Filter and Search Actions
  setSearchQuery,
  setStatusFilter,
  setSortBy,
  setSortOrder,
  
  // Pagination Actions
  setPage,
  setPageSize,
  setTotalCount,
  
  // Utility Actions
  resetFilters,
  updateCampaignInRows,
  removeCampaignFromRows,
  addCampaignToRows,
} = campaignListSlice.actions

export default campaignListSlice.reducer
