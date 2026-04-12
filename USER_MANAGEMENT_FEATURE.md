# User Management Feature

## ✅ Implementation Complete

A comprehensive user management interface has been added to the admin dashboard.

## 🔐 Access Control

- **Only admins** can access `/admin/users`
- **Agents** cannot see the Users link in the sidebar
- **Page-level protection** prevents agents from accessing the URL directly

## 🎯 Features

### View Users
- See all users (admins and agents)
- View user details: name, email, role, status
- See authentication methods (Google, Password, or both)
- User avatars (if signed in with Google)

### Add New Users
- Click "+ Add User" button
- Fill in: Name, Email, Password, Role (admin/agent)
- Set active/inactive status
- Users can be created for Google OAuth (no password) or password-based login

### Edit Users
- Click "Edit" on any user card
- Update name, role, or status
- Change password (leave empty to keep current)
- Email cannot be changed (unique identifier)

### User Status
- **Activate/Deactivate** users with one click
- Inactive users cannot log in

### Delete Users
- Permanently remove users from the system
- Confirmation required before deletion

## 🚀 How to Use

### Option 1: Command Line (Still Works)
```bash
# Add a new user
npx tsx scripts/add-user.ts admin@company.com "Admin Name" admin

# List all users
npx tsx scripts/list-users.ts
```

### Option 2: Admin UI (NEW)
1. Login as an **admin** user
2. Click "Users" in the bottom of the sidebar
3. Use the interface to manage users

## 🔒 Google OAuth Integration

When you add a user via the UI without setting a password:
1. User is created in the database
2. First time they sign in with Google, the system creates the Account link automatically
3. They can now login with Google OAuth

When you add a user with a password:
1. They can login with email/password immediately
2. If they later sign in with Google, both methods will work

## 📋 User Roles

### Admin
- Full access to all features
- Can manage users
- Can manage listings, clients, deals, areas

### Agent
- Can manage listings, clients, deals
- Cannot access user management
- Cannot see Users menu item

## 🛡️ Security Features

- Admin-only access to user management
- Password hashing with bcrypt
- Pre-authorization required for Google OAuth
- Active/inactive status control
- Role-based permissions

## 📊 User Information Displayed

- **Name**: Full name of the user
- **Email**: Unique email address
- **Role**: Admin or Agent
- **Status**: Active or Inactive
- **Avatar**: Profile picture (from Google)
- **Auth Methods**: Password, Google, or both
- **Created Date**: When user was added

## 🔧 API Endpoints

### GET /api/users
- List all users (admin only)
- Returns user details with account information

### POST /api/users
- Create new user (admin only)
- Requires: email, name, role, password (optional)

### PATCH /api/users/[id]
- Update user (admin only)
- Can update: name, email, role, active status, password

### DELETE /api/users/[id]
- Delete user (admin only)
- Permanent deletion

## 🎨 UI Components

### Location
- Page: `/app/admin/users/page.tsx`
- Component: `/components/admin/UsersManager/UsersManager.tsx`
- Styles: `/components/admin/UsersManager/UsersManager.module.css`
- API: `/app/api/users/` directory

### Features in UI
- Search users by name or email
- Add/Edit forms with validation
- Color-coded role badges (admin=blue, agent=purple)
- Status badges (active=green, inactive=red)
- Responsive design for mobile and desktop
- Avatar display for Google-authenticated users

## 🚦 Status

✅ User listing
✅ User creation
✅ User editing
✅ User deletion
✅ Activate/Deactivate toggle
✅ Admin-only access
✅ Google OAuth integration
✅ Password authentication
✅ Role-based UI elements
✅ Search functionality
✅ Mobile responsive

## 📝 Notes

- Email addresses must be unique
- Deleting a user is permanent (no soft delete)
- Users with client/listing assignments can still be deleted (foreign keys handled)
- Google profile images are displayed automatically
- Password field is optional when editing (keeps current if empty)
