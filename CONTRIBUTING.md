# Contributing to Hashbuzz Frontend

Thank you for your interest in contributing to the Hashbuzz frontend! This document provides guidelines and instructions for contributing to our React-based decentralized social media platform.

## 🚀 Quick Start for Contributors

### Prerequisites

- **Node.js**: >= 18.0.0
- **Yarn**: >= 1.22.0 (preferred package manager)
- **Git**: Latest version
- **VS Code**: Recommended editor with extensions

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/yourusername/hashbuzz-frontend.git
cd frontend

# Install dependencies
yarn install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
yarn dev
```

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Development Workflow](#development-workflow)
3. [Coding Standards](#coding-standards)
4. [Component Guidelines](#component-guidelines)
5. [State Management](#state-management)
6. [Testing Requirements](#testing-requirements)
7. [Pull Request Process](#pull-request-process)
8. [Issue Guidelines](#issue-guidelines)
9. [Performance Guidelines](#performance-guidelines)
10. [Security Guidelines](#security-guidelines)

## 📜 Code of Conduct

### Our Standards

- **Respectful Communication**: Be kind, respectful, and constructive
- **Inclusive Environment**: Welcome contributors from all backgrounds
- **Collaborative Spirit**: Help each other learn and grow
- **Quality Focus**: Strive for excellence in code and documentation

### Unacceptable Behavior

- Harassment, discrimination, or offensive language
- Spam, self-promotion, or off-topic discussions
- Sharing sensitive information or credentials
- Destructive or malicious contributions

## 🔄 Development Workflow

### Branch Strategy

```
main
├── develop                    # Integration branch
│   ├── feature/AUTH-123-login    # Feature branches
│   ├── feature/CAMP-456-create   # Ticket-based naming
│   └── feature/UI-789-redesign   # Component improvements
├── hotfix/CRIT-001-security   # Critical production fixes
└── release/v2.1.0             # Release preparation
```

### Branch Naming Convention

- **Feature**: `feature/TICKET-ID-short-description`
- **Bugfix**: `bugfix/TICKET-ID-short-description`
- **Hotfix**: `hotfix/TICKET-ID-short-description`
- **Refactor**: `refactor/COMPONENT-improvement`
- **Docs**: `docs/update-readme`

### Commit Message Format

```
type(scope): short description

Longer description explaining what and why.

Fixes #123
Closes #456
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no logic changes)
- `refactor`: Code restructuring (no behavior changes)
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

**Examples:**

```bash
feat(auth): add social media login integration

- Implement Twitter OAuth flow
- Add login state management
- Update UI components for social login

Fixes #123

fix(campaign): resolve creation form validation errors

- Fix date picker validation
- Improve error messaging
- Add form field requirements

Closes #456
```

## 🎯 Coding Standards

### TypeScript Guidelines

```typescript
// ✅ Good: Explicit types and interfaces
interface CampaignFormProps {
  initialData?: Campaign;
  onSubmit: (data: CampaignData) => Promise<void>;
  isLoading?: boolean;
}

// ✅ Good: Proper error handling
const createCampaign = async (data: CampaignData): Promise<Campaign> => {
  try {
    const response = await campaignApi.create(data);
    return response.data;
  } catch (error) {
    console.error('Campaign creation failed:', error);
    throw new Error('Failed to create campaign');
  }
};

// ❌ Bad: Any types and poor error handling
const createCampaign = async (data: any) => {
  const response = await fetch('/api/campaigns', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
};
```

### ESLint Rules

- **Strict TypeScript**: No `any` types without justification
- **React Hooks**: Follow hooks rules and dependencies
- **Imports**: Organize imports (external → internal → relative)
- **Naming**: PascalCase for components, camelCase for variables

### File Organization

```
src/
├── components/
│   ├── common/              # Reusable UI components
│   │   ├── Button/
│   │   │   ├── index.tsx
│   │   │   ├── Button.types.ts
│   │   │   └── Button.styles.ts
│   │   └── Modal/
│   └── forms/              # Form-specific components
├── screens/                # Page-level components
├── hooks/                  # Custom React hooks
├── utils/                  # Helper functions
├── types/                  # TypeScript definitions
└── constants/              # Application constants
```

## 🧩 Component Guidelines

### Component Structure

```typescript
// ComponentName.types.ts
export interface ComponentNameProps {
  title: string;
  isVisible?: boolean;
  onAction?: (id: string) => void;
}

// ComponentName.tsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ComponentNameProps } from './ComponentName.types';

const ComponentName: React.FC<ComponentNameProps> = ({
  title,
  isVisible = true,
  onAction
}) => {
  // Hooks at the top
  const [loading, setLoading] = useState(false);

  // Event handlers
  const handleClick = useCallback(() => {
    if (onAction) {
      onAction('example-id');
    }
  }, [onAction]);

  // Early returns
  if (!isVisible) {
    return null;
  }

  // Main render
  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
      <Button onClick={handleClick} disabled={loading}>
        Action
      </Button>
    </Box>
  );
};

export default ComponentName;
```

### Material-UI Usage

```typescript
// ✅ Good: Use theme and consistent styling
const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}));

// ✅ Good: Use MUI components correctly
<Button
  variant="contained"
  color="primary"
  size="large"
  startIcon={<AddIcon />}
  onClick={handleSubmit}
  disabled={isLoading}
>
  Create Campaign
</Button>

// ❌ Bad: Inline styles and inconsistent spacing
<div style={{ padding: '20px', margin: '10px', borderRadius: '8px' }}>
  <button onClick={handleSubmit} style={{ backgroundColor: '#1976d2' }}>
    Create Campaign
  </button>
</div>
```

### Component Best Practices

- **Single Responsibility**: One purpose per component
- **Composition over Inheritance**: Use props and children
- **Prop Validation**: Use TypeScript interfaces
- **Performance**: Use React.memo for expensive components
- **Accessibility**: Include ARIA labels and keyboard navigation

## 🗃 State Management

### Redux Toolkit Usage

```typescript
// campaignSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CampaignState {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
}

const initialState: CampaignState = {
  campaigns: [],
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
    addCampaign: (state, action: PayloadAction<Campaign>) => {
      state.campaigns.push(action.payload);
    },
  },
});

export const { setLoading, setCampaigns, addCampaign } = campaignSlice.actions;
export default campaignSlice.reducer;
```

### RTK Query Best Practices

```typescript
// api/campaignApi.ts
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
```

## 🧪 Testing Requirements

### Unit Testing

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import Button from './Button';
import theme from '../../../theme';

const renderWithTheme = (component: React.ReactNode) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('Button Component', () => {
  it('renders with correct text', () => {
    renderWithTheme(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    renderWithTheme(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading', () => {
    renderWithTheme(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Testing Guidelines

- **Coverage Target**: Aim for 80%+ test coverage
- **Test Pyramid**: More unit tests, fewer integration tests
- **Critical Paths**: Test user workflows thoroughly
- **Mocking**: Mock external dependencies and APIs
- **Accessibility**: Test with screen readers and keyboard navigation

## 🔄 Pull Request Process

### Before Submitting

1. **Code Quality Checks**

   ```bash
   # Run linting
   yarn lint

   # Run type checking
   yarn type-check

   # Run tests
   yarn test

   # Build successfully
   yarn build
   ```

2. **Manual Testing**
   - Test your changes in different browsers
   - Verify responsive design on mobile devices
   - Test with different user roles and permissions
   - Ensure accessibility standards are met

### PR Template

```markdown
## Description

Brief description of the changes made.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Accessibility testing completed

## Checklist

- [ ] Code follows the style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings in console

## Screenshots (if applicable)

Add screenshots for UI changes.

## Related Issues

Fixes #123
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs automatically
2. **Code Review**: At least one team member reviews
3. **Testing**: QA team tests for complex features
4. **Approval**: Two approvals required for main branch
5. **Merge**: Squash and merge with clean commit message

## 🐛 Issue Guidelines

### Bug Reports

```markdown
**Bug Description**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
Add screenshots if applicable.

**Environment:**

- Browser: [e.g. Chrome 96]
- Device: [e.g. iPhone 12]
- Screen size: [e.g. 1920x1080]

**Additional Context**
Any other context about the problem.
```

### Feature Requests

```markdown
**Feature Description**
A clear description of the feature you'd like to see.

**Problem Statement**
What problem does this solve?

**Proposed Solution**
Describe your preferred solution.

**Alternatives Considered**
Other solutions you've considered.

**Additional Context**
Mockups, examples, or references.
```

## ⚡ Performance Guidelines

### Code Optimization

```typescript
// ✅ Good: Memoized components
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      calculated: expensiveCalculation(item)
    }));
  }, [data]);

  return <div>{/* Render processed data */}</div>;
});

// ✅ Good: Lazy loading
const LazyDashboard = React.lazy(() => import('../screens/Dashboard'));

// ✅ Good: Debounced input
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
```

### Bundle Optimization

- **Code Splitting**: Use React.lazy for route-based splitting
- **Tree Shaking**: Import only what you need from libraries
- **Image Optimization**: Use appropriate formats and sizes
- **Caching**: Implement proper caching strategies

## 🔒 Security Guidelines

### Frontend Security

```typescript
// ✅ Good: Input validation
const validateInput = (input: string): boolean => {
  const sanitized = DOMPurify.sanitize(input);
  return sanitized === input && input.length <= 1000;
};

// ✅ Good: Secure API calls
const secureApiCall = async (endpoint: string, data: any) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

// ❌ Bad: XSS vulnerability
const UnsafeComponent = ({ userContent }) => {
  return <div dangerouslySetInnerHTML={{ __html: userContent }} />;
};
```

### Security Checklist

- **Input Validation**: Validate and sanitize all user inputs
- **XSS Prevention**: Use React's built-in XSS protection
- **CSRF Protection**: Implement CSRF tokens for state-changing operations
- **Secure Storage**: Never store sensitive data in localStorage
- **HTTPS**: Always use HTTPS in production
- **Dependencies**: Regularly update dependencies and check for vulnerabilities

## 📞 Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and general discussion
- **Development Chat**: Internal team communication
- **Code Reviews**: Feedback on pull requests

### Documentation Resources

- **README.md**: Project overview and setup instructions
- **Component Storybook**: UI component documentation
- **API Documentation**: Backend API reference
- **Style Guide**: Design system and component library

### Mentorship Program

- **New Contributors**: Paired with experienced team members
- **Code Review**: Regular feedback on contributions
- **Learning Resources**: Curated list of tutorials and articles
- **Office Hours**: Weekly sessions for questions and guidance

## 🎉 Recognition

### Contributor Levels

- **First-time Contributor**: Welcome package and mentorship
- **Regular Contributor**: Recognition in release notes
- **Core Contributor**: Write access and review privileges
- **Maintainer**: Project governance and decision-making

### Contribution Types

- **Code**: Features, bug fixes, refactoring
- **Documentation**: README, guides, comments
- **Testing**: Unit tests, integration tests, manual testing
- **Design**: UI/UX improvements, accessibility
- **Community**: Helping others, code reviews, discussions

Thank you for contributing to Hashbuzz! Your efforts help make decentralized social media more accessible and powerful for everyone.

---

**Questions?** Feel free to reach out through any of our communication channels. We're here to help! 🚀
