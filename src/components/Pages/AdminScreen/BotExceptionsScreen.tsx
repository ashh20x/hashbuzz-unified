import {
  Add as AddIcon,
  Search as SearchIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  TableContainer as MuiTableContainer,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useState } from 'react';

import {
  BotException,
  useGetBotExceptionsQuery,
} from '../../../API/botExceptions';
import { AddBotExceptionModal } from './AddBotExceptionModal';
import {
  AddButton,
  BotExceptionsContainer,
  EmptyState,
  HeaderSection,
  LoadingContainer,
  SearchBox,
  StatusChip,
  Title,
} from './BotExceptions.styles';

// Memoized styles to prevent re-creation
const securityIconStyle = { color: '#667eea' };
const chipStyle = { ml: 1, background: '#e6f3ff', color: '#1565c0' };
const searchIconStyle = { color: '#718096', mr: 1 };
const boxStyle = { display: 'flex', gap: 2, alignItems: 'center' };
const searchBoxStyle = { minWidth: 250 };
const alertStyle = { mb: 2 };

export const BotExceptionsScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedException, setSelectedException] =
    useState<BotException | null>(null);

  // API Hooks
  const {
    data: exceptionsResponse,
    isLoading,
    error,
  } = useGetBotExceptionsQuery();

  // Data processing
  const exceptions = exceptionsResponse?.data?.exceptions || [];

  const filteredExceptions = exceptions.filter(exception => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      exception.twitter_user_id.toLowerCase().includes(term) ||
      exception.twitter_username?.toLowerCase().includes(term) ||
      exception.reason.toLowerCase().includes(term) ||
      exception.notes?.toLowerCase().includes(term)
    );
  });

  // Event handlers
  const handleAddNew = () => {
    setSelectedException(null);
    setAddModalOpen(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <BotExceptionsContainer>
        <LoadingContainer>
          <CircularProgress className='loading-spinner' size={40} />
        </LoadingContainer>
      </BotExceptionsContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <BotExceptionsContainer>
        <Alert severity='error' sx={alertStyle}>
          Failed to load bot exceptions. Please try again later.
        </Alert>
      </BotExceptionsContainer>
    );
  }

  return (
    <BotExceptionsContainer>
      <HeaderSection>
        <Title>
          <SecurityIcon sx={securityIconStyle} />
          Bot Detection Exceptions
          <Chip
            label={`${exceptions.length} total`}
            size='small'
            sx={chipStyle}
          />
        </Title>

        <Box sx={boxStyle}>
          <SearchBox
            size='small'
            placeholder='Search exceptions...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={searchIconStyle} />,
            }}
            sx={searchBoxStyle}
          />

          <AddButton
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            variant='contained'
          >
            Add Exception
          </AddButton>
        </Box>
      </HeaderSection>

      {filteredExceptions.length === 0 ? (
        <EmptyState>
          <SecurityIcon className='empty-icon' />
          <h3>No Bot Exceptions Found</h3>
          <p>
            {searchTerm
              ? 'No exceptions match your search criteria.'
              : 'No bot detection exceptions have been added yet.'}
          </p>
        </EmptyState>
      ) : (
        <MuiTableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Twitter User ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Added By</TableCell>
                <TableCell>Added Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExceptions.map(exception => (
                <TableRow key={exception.id}>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '12px' }}>
                    {exception.twitter_user_id}
                  </TableCell>
                  <TableCell>
                    {exception.twitter_username
                      ? `@${exception.twitter_username}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{exception.reason}</TableCell>
                  <TableCell>
                    <StatusChip isActive={exception.is_active}>
                      {exception.is_active ? 'Active' : 'Inactive'}
                    </StatusChip>
                  </TableCell>
                  <TableCell>
                    {exception.added_by_admin?.name || 'System'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '12px' }}>
                    {new Date(exception.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </MuiTableContainer>
      )}

      {/* Add/Edit Modal */}
      <AddBotExceptionModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        exception={selectedException}
        onSuccess={() => {
          // No need to refetch - RTK Query auto-invalidates via tags
          setAddModalOpen(false);
        }}
      />
    </BotExceptionsContainer>
  );
};
