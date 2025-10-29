import { Box, Button, Dialog, Paper, TextField } from '@mui/material';
import styled from 'styled-components';

export const BotExceptionsContainer = styled(Paper)`
  padding: 24px;
  margin: 0;
  border-radius: 8px;
  box-shadow: none;
  background: #ffffff;
  width: 100%;
  min-height: calc(100vh - 200px);
  max-width: 100%;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 16px;
    min-height: calc(100vh - 180px);
  }

  @media (max-width: 480px) {
    padding: 12px;
    min-height: calc(100vh - 160px);
  }
`;

export const HeaderSection = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const Title = styled.h2`
  color: #1a202c;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const AddButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 10px 24px;
  border-radius: 8px;
  text-transform: none;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
    transform: translateY(-2px);
  }

  &:disabled {
    background: #e2e8f0;
    color: #a0aec0;
    box-shadow: none;
    transform: none;
  }
`;

export const SearchBox = styled(TextField)`
  .MuiOutlinedInput-root {
    border-radius: 8px;
    background: #f7fafc;

    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: #667eea;
    }

    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #667eea;
      border-width: 2px;
    }
  }

  .MuiInputLabel-root {
    &.Mui-focused {
      color: #667eea;
    }
  }
`;

export const TableContainer = styled('div')`
  width: 100%;
  max-width: 100%;
  min-height: 400px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  overflow: auto;

  .MuiDataGrid-root {
    border: none;
    width: 100%;

    .MuiDataGrid-columnHeaders {
      background: #f8fafc;
      border-bottom: 2px solid #e2e8f0;

      .MuiDataGrid-columnHeader {
        font-weight: 600;
        color: #2d3748;

        &:focus,
        &:focus-within {
          outline: none;
        }
      }

      .MuiDataGrid-columnSeparator {
        display: none;
      }
    }

    .MuiDataGrid-row {
      cursor: pointer;

      &:nth-of-type(even) {
        background: #f8fafc;
      }

      &:hover {
        background: #edf2f7;
      }
    }

    .MuiDataGrid-cell {
      border-bottom: 1px solid #e2e8f0;
      padding: 12px 16px;

      &:focus,
      &:focus-within {
        outline: none;
      }
    }

    .MuiDataGrid-footerContainer {
      border-top: 2px solid #e2e8f0;
      background: #f8fafc;
    }

    .MuiDataGrid-virtualScroller {
      overflow-x: hidden;
    }
  }
`;

export const StatusChip = styled.span<{ isActive: boolean }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${({ isActive }) =>
    isActive
      ? `
      background: #c6f6d5;
      color: #2f855a;
      border: 1px solid #9ae6b4;
    `
      : `
      background: #fed7d7;
      color: #c53030;
      border: 1px solid #feb2b2;
    `}
`;

export const ActionButton = styled(Button)<{ variant: 'remove' | 'view' }>`
  min-width: auto;
  padding: 6px 12px;
  border-radius: 6px;
  text-transform: none;
  font-weight: 500;
  font-size: 12px;

  ${({ variant }) =>
    variant === 'remove'
      ? `
      background: #fed7d7;
      color: #c53030;
      border: 1px solid #feb2b2;

      &:hover {
        background: #fc8181;
        color: white;
      }
    `
      : `
      background: #bee3f8;
      color: #2b6cb0;
      border: 1px solid #90cdf4;

      &:hover {
        background: #63b3ed;
        color: white;
      }
    `}
`;

export const EmptyState = styled(Box)`
  text-align: center;
  padding: 48px 24px;
  color: #718096;

  .empty-icon {
    font-size: 64px;
    color: #e2e8f0;
    margin-bottom: 16px;
  }

  h3 {
    margin: 0 0 8px;
    color: #4a5568;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
`;

export const LoadingContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px;

  .loading-spinner {
    color: #667eea;
  }
`;

// Modal Styles
export const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    border-radius: 16px;
    padding: 0;
    max-width: 500px;
    width: 100%;
    margin: 16px;
  }
`;

export const ModalHeader = styled(Box)`
  padding: 24px 24px 0;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 24px;

  h3 {
    margin: 0 0 16px;
    color: #1a202c;
    font-size: 20px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export const ModalBody = styled(Box)`
  padding: 0 24px 24px;
`;

export const FormField = styled(Box)`
  margin-bottom: 20px;

  .MuiTextField-root {
    width: 100%;

    .MuiOutlinedInput-root {
      border-radius: 8px;

      &:hover .MuiOutlinedInput-notchedOutline {
        border-color: #667eea;
      }

      &.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: #667eea;
        border-width: 2px;
      }
    }

    .MuiInputLabel-root {
      &.Mui-focused {
        color: #667eea;
      }
    }
  }
`;

export const ModalActions = styled(Box)`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 24px 24px;
  border-top: 1px solid #e2e8f0;
`;

export const CancelButton = styled(Button)`
  color: #718096;
  border-color: #e2e8f0;
  text-transform: none;
  font-weight: 500;

  &:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
  }
`;

export const SubmitButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-transform: none;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  &:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    background: #e2e8f0;
    color: #a0aec0;
    box-shadow: none;
  }
`;
