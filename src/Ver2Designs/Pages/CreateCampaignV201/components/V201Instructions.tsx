import {
  AccountBalance as BalanceIcon,
  Group as GroupIcon,
  HelpOutline as HelpIcon,
  Info as InfoIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';

interface V201InstructionsProps {
  userBalance: number;
  recommendedBudget: number;
  tokenType: 'HBAR' | 'FUNGIBLE';
  tokenSymbol?: string;
}

const V201Instructions: React.FC<V201InstructionsProps> = ({
  userBalance,
  recommendedBudget,
  tokenType,
  tokenSymbol,
}) => {
  const formatBalance = (amount: number): string => {
    if (tokenType === 'HBAR') {
      return `${(amount / 100_000_000).toFixed(2)} ℏ`;
    }
    return `${amount.toLocaleString()} ${tokenSymbol || 'tokens'}`;
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Balance Info Card */}
      <Card variant='outlined' sx={{ mb: 2, bgcolor: 'primary.50' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BalanceIcon color='primary' sx={{ mr: 1 }} />
            <Typography variant='h6' color='primary'>
              Your Current Balance
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              label={`Available: ${formatBalance(userBalance)}`}
              variant='outlined'
              color='primary'
            />
            <Chip
              label={`Recommended Budget: ${formatBalance(recommendedBudget)}`}
              variant='outlined'
              color='success'
            />
          </Box>
        </CardContent>
      </Card>

      {/* Instructions Alert */}
      <Alert severity='info' sx={{ mb: 2 }}>
        <Typography variant='subtitle2' gutterBottom>
          🚀 Welcome to V201 Campaign Creation
        </Typography>
        <Typography variant='body2'>
          V201 campaigns use a simplified reward model based on expected
          engagement. You set an estimated number of engaged users and a total
          budget, and the system automatically distributes rewards efficiently.
        </Typography>
      </Alert>

      {/* Step-by-step Instructions */}
      <Card variant='outlined'>
        <CardContent>
          <Typography
            variant='h6'
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <InfoIcon sx={{ mr: 1 }} />
            How to Create Your V201 Campaign
          </Typography>

          <List dense>
            <ListItem>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  1
                </Box>
              </ListItemIcon>
              <ListItemText
                primary='Campaign Name & Description'
                secondary='Give your campaign a clear, descriptive name and write engaging tweet text that explains what users need to do.'
              />
              <Tooltip title="Keep it clear and actionable. Example: 'Follow @HashBuzz and retweet this post'">
                <HelpIcon fontSize='small' color='action' />
              </Tooltip>
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  2
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <GroupIcon sx={{ mr: 1, fontSize: 16 }} />
                    Expected Engaged Users
                  </Box>
                }
                secondary='Estimate how many users you expect to participate in your campaign. This helps the system calculate fair reward distribution.'
              />
              <Tooltip title='Start conservative - you can always create additional campaigns if successful'>
                <HelpIcon fontSize='small' color='action' />
              </Tooltip>
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  3
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MoneyIcon sx={{ mr: 1, fontSize: 16 }} />
                    Campaign Budget
                  </Box>
                }
                secondary={`Set your total campaign budget. We recommend staying under ${formatBalance(recommendedBudget)} to keep a safety buffer for fees.`}
              />
              <Tooltip title='The system automatically distributes this budget among successful participants'>
                <HelpIcon fontSize='small' color='action' />
              </Tooltip>
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  4
                </Box>
              </ListItemIcon>
              <ListItemText
                primary='Review & Publish'
                secondary='Save as draft first to review everything, then publish when ready. Once published, your campaign will go live and start accepting participants.'
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card variant='outlined' sx={{ mt: 2, bgcolor: 'success.50' }}>
        <CardContent>
          <Typography variant='subtitle2' color='success.dark' gutterBottom>
            💡 Pro Tips for Success
          </Typography>
          <List dense>
            <ListItem sx={{ py: 0 }}>
              <ListItemText
                primary='Be specific about actions'
                secondary='Clear instructions lead to better engagement'
                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItem>
            <ListItem sx={{ py: 0 }}>
              <ListItemText
                primary='Start with smaller budgets'
                secondary='Test the waters before committing large amounts'
                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItem>
            <ListItem sx={{ py: 0 }}>
              <ListItemText
                primary='Monitor your campaigns'
                secondary='Check back regularly to see performance and engagement'
                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default V201Instructions;
