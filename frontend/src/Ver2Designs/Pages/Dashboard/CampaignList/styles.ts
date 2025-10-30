import { Box, Button, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CampaignContainer = styled(Box)`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px;
  box-sizing: border-box;
  overflow-x: hidden;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;

  /* Tablets */
  @media (max-width: 1024px) {
    max-width: 1200px;
    padding: 14px;
  }

  /* Mobiles */
  @media (max-width: 768px) {
    max-width: 100%; /* full width */
    padding: 12px;
  }

  /* Small mobiles */
  @media (max-width: 480px) {
    padding: 4px;
  }
`;

export const CampaignCard = styled(Box)`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  margin-bottom: 24px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) and (min-width: 769px) {
    margin-bottom: 20px;
  }
`;

export const HeaderSection = styled(Box)`
  padding: 32px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) and (min-width: 769px) {
    padding: 24px;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

export const HeaderContent = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) and (min-width: 769px) {
    gap: 20px;
  }

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

export const InfoBanner = styled(Box)`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  border: 1px solid #bae6fd;
  position: relative;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, #0ea5e9, #0284c7);
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    padding: 18px;
    gap: 10px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    flex-direction: column;
    text-align: center;

    &::before {
      width: 100%;
      height: 3px;
      top: 0;
      left: 0;
    }
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const InfoIcon = styled(Box)`
  color: #0ea5e9;
  flex-shrink: 0;
  margin-top: 2px;
`;

export const InfoText = styled('p')`
  color: #0f172a;
  font-size: 14px;
  line-height: 1.6;
  font-weight: 400;
  margin: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 1024px) and (min-width: 769px) {
    font-size: 13.5px;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    line-height: 1.5;
  }
`;

export const ActionBar = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) and (min-width: 769px) {
    gap: 12px;
    flex-wrap: nowrap;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`;

export const TabSection = styled(Box)`
  flex: 1;
  min-width: 200px;
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) and (min-width: 769px) {
    min-width: 150px;
    flex-shrink: 1;
  }
`;

export const ButtonGroup = styled(Box)`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) and (min-width: 769px) {
    gap: 8px;
    flex-wrap: nowrap;
    flex-shrink: 0;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

export const BaseButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
  white-space: nowrap;
  text-transform: none;
  box-sizing: border-box;

  @media (max-width: 1024px) and (min-width: 769px) {
    padding: 10px 18px;
    font-size: 13px;
    min-height: 40px;
    gap: 6px;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }

  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 13px;
    min-height: 40px;
  }
`;

export const PrimaryButton = styled(BaseButton)`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  &:disabled {
    background: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const SecondaryButton = styled(BaseButton)`
  background: #f8fafc;
  color: #475569;
  border: 1px solid #e2e8f0;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    transform: translateY(-1px);
  }
`;

export const SuccessButton = styled(BaseButton)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);

  &:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
`;

export const ChatGPTLink = styled('a')`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 40px;
  max-width: 100%;
  box-sizing: border-box;
  white-space: normal;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);

  &:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    color: white;
    text-decoration: none;
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    padding: 8px 16px;
    font-size: 13px;
    min-height: 36px;
    gap: 4px;
    flex-shrink: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    font-size: 13.5px;
    padding: 10px 18px;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 8px 14px;
    font-size: 12.5px;
    min-height: 36px;
  }
`;

export const RefreshButton = styled(IconButton)`
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #64748b;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  @media (max-width: 1024px) and (min-width: 769px) {
    padding: 6px;
  }

  &:hover {
    background: #f1f5f9;
    color: #475569;
    border-color: #cbd5e1;
  }
`;

export const DataSection = styled(Box)`
  padding: 0;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
`;

export const DataGridWrapper = styled(Box)`
  min-height: 400px;
  position: relative;
  background: white;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 1024px) and (min-width: 769px) {
    min-height: 375px;
  }

  @media (max-width: 768px) {
    min-height: 350px;
  }

  @media (max-width: 480px) {
    min-height: 300px;
  }
`;

export const LoadingContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  background: white;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) and (min-width: 769px) {
    height: 375px;
  }
`;

export const ActionButtonsContainer = styled(Box)`
  display: flex;
  gap: 8px;
  align-items: center;
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) and (min-width: 769px) {
    gap: 6px;
    flex-wrap: nowrap;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 4px;
    width: 100%;
  }
`;

export const ActionButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  min-width: 60px;
  height: 32px;
  text-transform: none;
  box-sizing: border-box;

  @media (max-width: 1024px) and (min-width: 769px) {
    padding: 5px 10px;
    font-size: 11px;
    min-width: 50px;
    height: 28px;
  }

  @media (max-width: 768px) {
    width: 100%;
    font-size: 11px;
    padding: 8px;
  }
`;

export const PrimaryActionButton = styled(ActionButton)`
  background: #3b82f6;
  color: white;

  &:hover:not(.disabled) {
    background: #2563eb;
  }

  &.disabled {
    background: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

export const SecondaryActionButton = styled(ActionButton)`
  background: transparent;
  color: #64748b;
  border: 1px solid #e2e8f0;

  &:hover {
    background: #f1f5f9;
    color: #475569;
  }
`;

export const Divider = styled('hr')`
  height: 1px;
  background: #e5e7eb;
  border: none;
  margin: 0;
  width: 100%;
  box-sizing: border-box;
`;

// our Custom styles for DataGrid using MUI's sx prop structure
export const dataGridStyles = {
  height: '100%',
  minHeight: '400px',
  border: 'none',
  fontFamily: 'inherit',
  width: '100%',
  maxWidth: '100%',
  overflow: 'hidden',
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    fontWeight: 600,
    color: '#374151',
  },
  '& .MuiDataGrid-cell': {
    borderBottom: '1px solid #f1f5f9',
    color: '#374151',
    fontSize: '14px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '& .MuiDataGrid-row': {
    maxWidth: '100%',
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: '#f8fafc',
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
  },
  '& .MuiTablePagination-root': {
    color: '#64748b',
    fontSize: '14px',
  },
  '& .MuiDataGrid-virtualScroller': {
    overflowX: 'auto',
    maxWidth: '100%',
  },
  '& .MuiDataGrid-main': {
    overflow: 'hidden',
  },
  // Tablet specific styles
  '@media (max-width: 1024px) and (min-width: 769px)': {
    minHeight: '375px',
    '& .MuiDataGrid-cell': {
      fontSize: '13px !important',
      padding: '6px 8px !important',
    },
    '& .MuiDataGrid-columnHeaders': {
      fontSize: '13px !important',
    },
  },
  // Mobile responsive styles
  '@media (max-width: 768px)': {
    minHeight: '350px',
    '& .MuiDataGrid-cell': {
      fontSize: '12px !important',
      padding: '8px 4px !important',
    },
    '& .MuiDataGrid-columnHeaders': {
      fontSize: '12px !important',
    },
  },
  '@media (max-width: 480px)': {
    minHeight: '300px',
  },
};
