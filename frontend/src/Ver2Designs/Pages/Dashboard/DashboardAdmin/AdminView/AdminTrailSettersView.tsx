import { Add, Cancel } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import {
  useGetTrailSettersQuery,
  useUpdateTrailSettersMutation,
} from '../../../../Admin/api/admin';

const AdminTrailSettersView = () => {
  const [value, setValue] = React.useState<string[]>([]);
  const [newAccount, setNewAccount] = useState('');
  const [editMode, setEditMode] = useState(false);
  const { data: trailSettersData, isLoading: isLoadingTrailSetters } =
    useGetTrailSettersQuery();
  const [updateTrailSetters, { isLoading: isLoadingUpdate }] =
    useUpdateTrailSettersMutation();

  const isLoading = isLoadingTrailSetters || isLoadingUpdate;

  React.useEffect(() => {
    if (trailSettersData) {
      setValue(trailSettersData.map(d => d.walletId));
    }
  }, [trailSettersData]);

  const handleDelete = (index: number) => {
    setValue(oldArray => oldArray.filter((_, i) => i !== index));
  };

  const handleEditModeClick = () => {
    if (editMode) {
      setNewAccount('');
    }
    setEditMode(prev => !prev);
  };

  const handleUpdateTheList = async () => {
    if (!newAccount) {
      return;
    }
    updateTrailSetters({ accounts: [newAccount] })
      .unwrap()
      .then(data => {
        setValue([...data.data.map(d => d.walletId)]);
        setNewAccount('');
      })
      .catch(err => {
        console.error(err);
      });
  };

  return (
    <Box>
      <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          sx={{ padding: 2, background: '#efefef' }}
          component={Card}
          elevation={0}
        >
          <Typography variant='h5'>TrailSetters Accounts</Typography>
          <Button
            color='primary'
            disabled={isLoading}
            variant='contained'
            startIcon={
              !editMode ? (
                <Add fontSize='inherit' />
              ) : (
                <Cancel fontSize='inherit' />
              )
            }
            onClick={handleEditModeClick}
          >
            {!editMode ? 'Add new' : 'Cancel'}
          </Button>
        </Stack>

        {editMode && (
          <Stack direction={'row'} sx={{ padding: 2, my: 2 }}>
            <TextField
              id='trailsetters-input'
              disabled={isLoading}
              label='New Trail setter Account'
              variant='outlined'
              sx={{ marginRight: 1 }}
              value={newAccount}
              onChange={e => setNewAccount(e.target.value)}
            />
            <Button
              disabled={isLoading}
              startIcon={<Add fontSize='inherit' />}
              variant='contained'
              color='primary'
              onClick={handleUpdateTheList}
            >
              Add trailsetters
            </Button>
          </Stack>
        )}

        <Stack direction={'row'} flexWrap={'wrap'} sx={{ padding: '8px' }}>
          {value.map((item, index) => (
            <Chip
              deleteIcon={<Cancel />}
              label={item}
              key={index}
              onDelete={() => handleDelete(index)}
              icon={
                <Avatar
                  sx={{
                    width: '20px',
                    height: '20px',
                    marginRight: 2,
                    marginBottom: 2,
                    fontSize: 'inherit',
                  }}
                >
                  {index + 1}
                </Avatar>
              }
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default AdminTrailSettersView;
