# 🚀 Frontend Developer Onboarding

Welcome to the Hashbuzz Frontend team! This comprehensive onboarding guide will get you up and running with our React-based decentralized social media platform.

## 📋 Onboarding Checklist

### Day 1: Environment Setup

- [ ] **System Requirements Met**
  - [ ] Node.js >= 18.0.0 installed
  - [ ] Yarn >= 1.22.0 installed
  - [ ] Git configured with your credentials
  - [ ] VS Code installed with recommended extensions

- [ ] **Repository Access**
  - [ ] GitHub access granted to the repository
  - [ ] Repository cloned locally
  - [ ] Environment variables configured (.env file)
  - [ ] Development server running successfully

- [ ] **Development Tools**
  - [ ] VS Code extensions installed (see list below)
  - [ ] React Developer Tools browser extension
  - [ ] Redux DevTools browser extension
  - [ ] Prettier and ESLint configured

- [ ] **Team Communication**
  - [ ] Added to team Slack/Discord channels
  - [ ] Introduction post in team channel
  - [ ] Access to project management tools (Jira/Trello)
  - [ ] Calendar invites for team meetings

### Day 2-3: Project Understanding

- [ ] **Architecture Overview**
  - [ ] Read the README.md thoroughly
  - [ ] Understand the project structure
  - [ ] Review the technology stack
  - [ ] Understand the state management flow

- [ ] **Code Exploration**
  - [ ] Browse through main components
  - [ ] Understand routing structure
  - [ ] Review API integration patterns
  - [ ] Study Redux slices and RTK Query setup

- [ ] **Development Workflow**
  - [ ] Read CONTRIBUTING.md
  - [ ] Understand the branching strategy
  - [ ] Learn the code review process
  - [ ] Practice the testing workflow

### Week 1: First Contributions

- [ ] **Getting Started Tasks**
  - [ ] Fix a minor bug or typo
  - [ ] Add a small feature or improvement
  - [ ] Update documentation
  - [ ] Review someone else's PR

- [ ] **Learning Goals**
  - [ ] Complete React + TypeScript tutorial
  - [ ] Understand Material-UI component system
  - [ ] Learn Redux Toolkit and RTK Query
  - [ ] Understand Hedera blockchain basics

## 🛠 Required Tools & Extensions

### System Requirements

```bash
# Check your versions
node --version    # Should be >= 18.0.0
yarn --version    # Should be >= 1.22.0
git --version     # Any recent version
```

### VS Code Extensions (Required)

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### Browser Extensions

- **React Developer Tools**: Debug React components
- **Redux DevTools**: Monitor state changes
- **Hedera Wallet**: Test blockchain interactions
- **Web Vitals**: Monitor performance metrics

## 🏗 Project Architecture Deep Dive

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                       │
├─────────────────────────────────────────────────────────┤
│  Presentation Layer (Components, Pages, Layouts)       │
├─────────────────────────────────────────────────────────┤
│  State Management Layer (Redux, RTK Query)             │
├─────────────────────────────────────────────────────────┤
│  Service Layer (API, Wallet, Utilities)                │
├─────────────────────────────────────────────────────────┤
│  Infrastructure Layer (Hedera, Firebase, Auth)         │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack Overview

#### Core Framework

- **React 19.1.0**: Component-based UI library
- **TypeScript 5.8.2**: Type-safe JavaScript
- **Vite 6.2.1**: Build tool and development server

#### UI Framework

- **Material-UI 7.2.0**: Google's Material Design components
- **Styled Components**: CSS-in-JS styling
- **Responsive Design**: Mobile-first approach

#### State Management

- **Redux Toolkit**: Simplified Redux with best practices
- **RTK Query**: Data fetching and caching
- **React Redux**: React bindings for Redux

#### Blockchain Integration

- **Hedera SDK**: Interact with Hedera Hashgraph
- **HashConnect**: Wallet connection library
- **WalletConnect**: Multi-wallet support

## 📁 Codebase Structure Explained

### Source Directory (`src/`)

```
src/
├── API/                     # RTK Query API definitions
│   ├── auth.ts             # Authentication endpoints
│   ├── campaign.ts         # Campaign management
│   └── admin.ts            # Admin operations
│
├── components/             # Reusable UI components
│   ├── common/            # Generic components (Button, Modal)
│   ├── forms/             # Form-specific components
│   └── layout/            # Layout components (Header, Sidebar)
│
├── screens/               # Page-level components
│   ├── Dashboard/         # Main dashboard
│   ├── Campaign/          # Campaign management
│   └── Profile/           # User profile
│
├── Store/                 # Redux store configuration
│   ├── store.ts           # Root store setup
│   ├── authSlice.ts       # Authentication state
│   ├── campaignSlice.ts   # Campaign state
│   └── uiSlice.ts         # UI state
│
├── Ver2Designs/           # Version 2 components
│   ├── Admin/             # Admin panel
│   └── Pages/             # Redesigned pages
│
├── Wallet/                # Blockchain wallet integration
│   ├── HederaWallet.ts    # Hedera wallet logic
│   └── WalletConnect.ts   # WalletConnect integration
│
├── theme/                 # Material-UI theme
│   ├── index.ts           # Theme configuration
│   └── palette.ts         # Color definitions
│
├── types/                 # TypeScript definitions
│   ├── api.ts             # API response types
│   ├── campaign.ts        # Campaign types
│   └── user.ts            # User types
│
└── Utilities/             # Helper functions
    ├── formatters.ts      # Data formatting
    ├── validators.ts      # Input validation
    └── constants.ts       # Application constants
```

### Key Files Explained

#### `src/Store/store.ts`

Central Redux store configuration with all slices and middleware.

#### `src/API/campaign.ts`

RTK Query API for campaign operations (CRUD operations).

#### `src/components/common/`

Reusable UI components following atomic design principles.

#### `src/theme/index.ts`

Material-UI theme configuration with custom colors, typography, and spacing.

## 🔄 Development Workflow

### Git workflow guide

For branching, PRs, and how to resolve merge conflicts by rebasing onto `master`, see the Git workflow guide:

- [Git workflow: branch from `master` and resolve PR conflicts by rebasing](./docs/GIT_WORKFLOW.md)

### Daily Development Process

1. **Start Your Day**

   ```bash
   git checkout develop
   git pull origin develop
   yarn install  # If package.json changed
   ```

2. **Create Feature Branch**

   ```bash
   git checkout -b feature/TICKET-123-user-authentication
   ```

3. **Development Loop**

   ```bash
   yarn dev      # Start development server
   # Make changes, test in browser
   yarn lint     # Check code quality
   yarn test     # Run tests
   ```

4. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat(auth): add social media login integration"
   ```

5. **Submit PR**
   ```bash
   git push origin feature/TICKET-123-user-authentication
   # Create PR on GitHub
   ```

### Code Review Process

1. **Self Review**: Check your own PR thoroughly
2. **Automated Checks**: CI/CD pipeline validates code
3. **Peer Review**: Team member reviews code
4. **Testing**: QA tests functionality
5. **Approval**: Two approvals required
6. **Merge**: Squash and merge to develop

## 🧪 Testing Strategy

### Testing Pyramid

```
        E2E Tests (Few)
      ─────────────────
    Integration Tests (Some)
  ─────────────────────────────
Unit Tests (Many)
```

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run tests with coverage
yarn test --coverage

# Run specific test file
yarn test Button.test.tsx
```

### Writing Tests

```typescript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../Store/store';
import CampaignCard from './CampaignCard';

const renderWithProvider = (component: React.ReactNode) => {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('CampaignCard', () => {
  const mockCampaign = {
    id: '1',
    title: 'Test Campaign',
    description: 'Test description',
    status: 'active'
  };

  it('renders campaign information', () => {
    renderWithProvider(<CampaignCard campaign={mockCampaign} />);

    expect(screen.getByText('Test Campaign')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });
});
```

## 🎨 UI/UX Guidelines

### Design System

- **Material Design 3**: Follow Google's latest design principles
- **8px Grid System**: Use consistent spacing multiples of 8
- **Typography Scale**: Use predefined text sizes and weights
- **Color Palette**: Stick to the defined brand colors

### Component Development

```typescript
// Example Material-UI component
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
  },
}));

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  return (
    <StyledCard elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {campaign.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {campaign.description}
        </Typography>
        <Box mt={2}>
          <Button variant="contained" color="primary">
            View Campaign
          </Button>
        </Box>
      </CardContent>
    </StyledCard>
  );
};
```

### Responsive Design

```typescript
// Use Material-UI breakpoints
const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(2),
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
}));
```

## 🔗 State Management Patterns

### Redux Toolkit Slice Pattern

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CampaignState {
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  loading: boolean;
  error: string | null;
}

const initialState: CampaignState = {
  campaigns: [],
  selectedCampaign: null,
  loading: false,
  error: null,
};

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCampaigns: (state, action: PayloadAction<Campaign[]>) => {
      state.campaigns = action.payload;
    },
    selectCampaign: (state, action: PayloadAction<Campaign>) => {
      state.selectedCampaign = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
  },
});

export const { setLoading, setCampaigns, selectCampaign, clearError } =
  campaignSlice.actions;
export default campaignSlice.reducer;
```

### RTK Query API Pattern

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const campaignApi = createApi({
  reducerPath: 'campaignApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/campaigns',
    prepareHeaders: (headers, { getState }) => {
      const token = selectAuthToken(getState() as RootState);
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Campaign'],
  endpoints: builder => ({
    getCampaigns: builder.query<Campaign[], GetCampaignsParams>({
      query: params => ({
        url: '',
        params,
      }),
      providesTags: ['Campaign'],
    }),
    createCampaign: builder.mutation<Campaign, CreateCampaignData>({
      query: data => ({
        url: '',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Campaign'],
    }),
  }),
});

export const { useGetCampaignsQuery, useCreateCampaignMutation } = campaignApi;
```

## 🔐 Security Best Practices

### Input Validation

```typescript
import DOMPurify from 'dompurify';

// Sanitize user input
const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input);
};

// Validate form data
const validateCampaignData = (data: CampaignFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.title || data.title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  if (!data.description || data.description.length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  return errors;
};
```

### Secure API Calls

```typescript
const makeSecureRequest = async (endpoint: string, options: RequestInit) => {
  const token = getAuthToken();

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  try {
    const response = await fetch(endpoint, defaultOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
```

## 🚀 Performance Optimization

### Code Splitting

```typescript
// Lazy load components
const LazyDashboard = React.lazy(() => import('./screens/Dashboard'));
const LazyCampaignList = React.lazy(() => import('./screens/CampaignList'));

// Use in routing
<Route
  path="/dashboard"
  element={
    <Suspense fallback={<LoadingSpinner />}>
      <LazyDashboard />
    </Suspense>
  }
/>
```

### Component Optimization

```typescript
// Use React.memo for expensive components
const ExpensiveCampaignCard = React.memo(({ campaign, onUpdate }) => {
  const expensiveValue = useMemo(() => {
    return calculateComplexMetrics(campaign);
  }, [campaign]);

  const handleUpdate = useCallback((data) => {
    onUpdate(campaign.id, data);
  }, [campaign.id, onUpdate]);

  return (
    <Card>
      {/* Component content */}
    </Card>
  );
});
```

## 🔧 Debugging Tips

### Common Issues & Solutions

#### 1. Development Server Won't Start

```bash
# Clear cache and reinstall
rm -rf node_modules yarn.lock
yarn install

# Clear Vite cache
rm -rf .vite
yarn dev
```

#### 2. TypeScript Errors

```bash
# Restart TypeScript server in VS Code
# Command Palette -> "TypeScript: Restart TS Server"

# Check types without compiling
yarn type-check
```

#### 3. Redux State Issues

```typescript
// Use Redux DevTools to inspect state
// Install browser extension and check state changes

// Debug selectors
const debugSelector = (state: RootState) => {
  console.log('Current state:', state);
  return selectCampaigns(state);
};
```

#### 4. API Request Failures

```typescript
// Add request/response interceptors
const debugApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    // Add logging
    fetchFn: async (...args) => {
      console.log('API Request:', args);
      const result = await fetch(...args);
      console.log('API Response:', result);
      return result;
    },
  }),
});
```

## 📚 Learning Resources

### Required Reading

1. **React Official Docs**: https://react.dev/
2. **TypeScript Handbook**: https://www.typescriptlang.org/docs/
3. **Redux Toolkit**: https://redux-toolkit.js.org/
4. **Material-UI**: https://mui.com/

### Recommended Tutorials

1. **React + TypeScript**: Complete modern React development
2. **Redux Toolkit**: State management patterns
3. **Material-UI**: Component library usage
4. **Testing Library**: Component testing strategies

### Internal Resources

- **Component Storybook**: UI component documentation
- **API Documentation**: Backend API reference
- **Design System**: Figma design files
- **Team Wiki**: Internal processes and guidelines

## 🎯 30-60-90 Day Goals

### 30 Days: Foundation

- [ ] Complete environment setup
- [ ] Understand project architecture
- [ ] Make first contribution (bug fix or small feature)
- [ ] Comfortable with development workflow
- [ ] Basic React + TypeScript proficiency

### 60 Days: Proficiency

- [ ] Delivered significant feature
- [ ] Understanding of state management patterns
- [ ] Comfortable with Material-UI components
- [ ] Participating in code reviews
- [ ] Understanding blockchain integration basics

### 90 Days: Expertise

- [ ] Leading feature development
- [ ] Mentoring new contributors
- [ ] Contributing to architecture decisions
- [ ] Deep understanding of performance optimization
- [ ] Expert in project's technology stack

## 🤝 Team Integration

### Communication Channels

- **Daily Standups**: 9:00 AM team sync
- **Sprint Planning**: Every 2 weeks
- **Code Reviews**: Ongoing via GitHub
- **Team Chat**: Slack #frontend-team
- **Office Hours**: Fridays 2-4 PM for questions

### Mentorship Program

- **Buddy System**: Paired with experienced developer
- **Weekly 1:1s**: Regular check-ins with mentor
- **Code Review**: Detailed feedback on PRs
- **Learning Path**: Customized skill development plan

### Team Culture

- **Learning Focused**: Continuous improvement mindset
- **Collaborative**: Help each other succeed
- **Quality Driven**: Excellence in code and user experience
- **Innovation**: Embrace new technologies and patterns

## 📞 Getting Help

### When You're Stuck

1. **Try to solve it yourself** (15-30 minutes)
2. **Check documentation** and existing code
3. **Ask your buddy/mentor** for guidance
4. **Post in team chat** for broader help
5. **Schedule pair programming** session

### Resources for Help

- **GitHub Issues**: Technical problems
- **Team Chat**: Quick questions
- **Mentor 1:1s**: Career and learning guidance
- **Office Hours**: Open forum for any questions
- **Documentation**: Comprehensive guides

## 🎉 Welcome to the Team!

You're now part of an amazing team building the future of decentralized social media. Don't hesitate to ask questions, share ideas, and contribute your unique perspective.

**Remember**:

- Everyone was new once
- Questions are encouraged
- Mistakes are learning opportunities
- Your fresh perspective is valuable

**Ready to start coding? Let's build something amazing together!** 🚀

---

**Next Steps:**

1. Complete the onboarding checklist
2. Set up your development environment
3. Read through the codebase
4. Pick up your first ticket
5. Make your first contribution!

Welcome aboard! 🎈
