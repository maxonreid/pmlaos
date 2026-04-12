# Testing Guide

This project uses Vitest for testing the admin dashboard, including UI components, business logic, and data connectivity.

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui
```

## Test Coverage

### Admin Dashboard Tests

#### Component Tests

##### Admin Dashboard Page (`tests/admin-dashboard.test.tsx`)
- Authentication validation and redirects
- Dashboard rendering for authenticated users
- Quick access cards display (Listings, Clients, Deals)
- Default user name and role handling

##### Admin Layout Component (`tests/admin-layout.test.tsx`)
- User information rendering
- Page title and description display
- Navigation links rendering
- Logout functionality
- User initials generation
- Active route highlighting
- Mobile navigation
- Responsive behavior

##### StatCard Component (`tests/admin-statcard.test.tsx`)
- Basic card rendering with label and value
- String and number value support
- Variant support (primary, accent, success, danger)
- Change indicators (positive, negative, neutral)
- Icon rendering
- CSS class application

##### Navigation Tests (`tests/admin-navigation.test.tsx`)
- Active route highlighting for all sections
- Sub-route active states
- Navigation link attributes
- Icon rendering
- Accessibility features

#### Integration Tests (`tests/admin-integration.test.ts`)

##### Dashboard Statistics
- Total active listings count
- Total active clients count
- Total pending deals count
- Total revenue calculation from closed deals

##### Recent Activity Queries
- Recent clients with assignments
- Recent deals with relations
- Recently updated listings

##### User Performance Queries
- Users with assigned clients count
- Users with deals count

##### Dashboard Filters
- Filter listings by status
- Filter clients by date range
- Filter deals by status and date

##### Data Aggregations
- Listings grouped by property type
- Clients grouped by source
- Average and total commission calculations

##### Complex Queries with Relations
- Listings with client interests and deals
- Clients with listings and assigned users

### Database Tests

#### Database Connection Tests (`tests/database.test.ts`)
- Database connectivity validation
- Table accessibility checks (Users, Listings, Clients, Deals)

#### Admin Clients Tests (`tests/admin-clients.test.ts`)
- Client data fetching with relationships
- Status and source enum validation
- Budget conversion (Decimal → Number)
- Active user fetching for assignment

#### Admin Listings Tests (`tests/admin-listings.test.ts`)
- Listing data fetching
- Price conversion validation
- Status, transaction type, and category enum validation
- Photos relationship
- Area and coordinate validation

#### Admin Deals Tests (`tests/admin-deals.test.ts`)
- Deal fetching with relationships
- Deal value and commission validation
- Transaction type matching
- Commission calculations
- Date validation

#### Data Relationships Tests (`tests/data-relationships.test.ts`)
- Client-Listing many-to-many relationship
- Listing-Photo one-to-many relationship
- User-Client assignment relationship
- Listing-Inquiry relationship
- Deal relationship integrity

## Test Structure

### Component Tests
Component tests use `@testing-library/react` and validate:
1. **Rendering** - Components render correctly with props
2. **User Interactions** - Clicks, navigation, and state changes
3. **Conditional Rendering** - Different states and props combinations
4. **Accessibility** - ARIA labels and semantic HTML
5. **CSS Classes** - Proper styling application

### Integration Tests
Integration tests validate:
1. **Data connectivity** - Database queries work correctly
2. **Business logic** - Statistics and calculations are accurate
3. **Data aggregations** - Complex queries return expected results
4. **Relationships** - Related data is fetched properly

### Database Tests
Database tests validate:
1. **Data transformations** - Decimal to Number conversions
2. **Enum validations** - Status, types match schema
3. **Relationships** - Foreign keys and joins work correctly
4. **Data integrity** - Required fields and constraints

## Mocking Strategy

The test suite uses Vitest's mocking capabilities:

- **next/navigation** - Mocked for `usePathname`, `useRouter`, and `redirect`
- **next-auth/react** - Mocked for `signOut` authentication
- **@/lib/auth** - Mocked for session validation
- **Components** - Selectively mocked when testing parent components

## Environment

Tests use the same database connection as your development environment via `.env.local`.

Make sure you have:
- Database running and accessible
- `.env.local` configured with `DATABASE_URL`
- Prisma schema synchronized with database
- Node modules installed (`npm install`)

## Best Practices

1. **Isolate tests** - Each test should be independent
2. **Clear mocks** - Always clear mocks between tests
3. **Descriptive names** - Test names should explain what they validate
4. **Minimal setup** - Only set up what's necessary for each test
5. **Check both paths** - Test success and error cases
