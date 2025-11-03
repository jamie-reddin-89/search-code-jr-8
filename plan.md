# JR Heat Pump Assistant - Implementation Plan

## Recommended Analytics Approach
**Option B: Simple Event Tracking System in Supabase**
- Non-intrusive, lightweight, and leverages existing Supabase setup
- Track: page views, error code searches, button clicks, user actions
- Store in `app_analytics` table with: user_id, device_id, event_type, path, meta, timestamp
- Query directly from PostgreSQL without external dependencies

---

## Phase 1: Database Schema & Core Device Management
**Status:** ✅ COMPLETE

### Tasks:

#### 1.1 Create Supabase Tables
- [x] `brands` table
- [x] `models` table
- [x] `categories` table
- [x] `tags` table
- [x] `media` table
- [x] `urls` table
- [x] `user_sessions` table
- [x] `user_activity` table
- [x] `app_analytics` table
- [x] `app_logs` table

#### 1.2 Update Types
- [x] Update `src/integrations/supabase/types.ts` with new table schemas

#### 1.3 Fix Admin/Add-Device Button Labels
- [x] Remove "+" prefix from buttons

#### 1.4 Implement Device Management in Admin/Add-Device
- [x] Brand form with Supabase persistence
- [x] Model form with brand selector
- [x] Category form
- [x] Tag form
- [x] Media form with type selector
- [x] URL form with category field
- [x] Real-time Supabase fetching
- [x] Delete functionality for all items

#### 1.5 Create Dynamic Device Pages Generator
- [x] New file: `src/lib/deviceManager.ts` with utility functions
- [x] Device route slug generation
- [x] Device lookup functions

#### 1.6 Update Admin Dashboard
- [x] Dynamic device buttons from Supabase
- [x] Real-time sync with database

#### 1.7 Fix AdminAddDevice Layout
- [x] Light/dark mode styling
- [x] Scrollbar hiding
- [x] Supabase data display

**Deliverables:**
- ✅ Admin/add-device fully functional with Supabase persistence
- ✅ Dynamic device routes working
- ✅ New brands/models immediately available in main UI
- ✅ SQL migrations created

---

## Phase 2: Admin Users Management & User Tracking
**Duration:** Medium-high priority - critical for user management

### Tasks:

#### 2.1 Implement User Session/Activity Tracking
- [ ] Track login events in `user_sessions` table
- [ ] Track all user activities in `user_activity` table:
  - Page views
  - Error code searches
  - Favorite saves
  - Button clicks
- [ ] Create hooks: `useTrackActivity(type, meta)`, `useSessionTracker()`

#### 2.2 Enhance AdminUsers Page
- [ ] Fetch users with activity stats from Supabase
- [ ] Sort users by username (case-insensitive)
- [ ] Add Refresh button to User List
  - Refreshes user list and activity data
  - Shows loading state

#### 2.3 User Details Panel Enhancements
**Show:**
- [ ] Username (bold, prominent)
- [ ] User ID
- [ ] Role (admin/moderator/user)
- [ ] Total login count (from sessions table)
- [ ] Most viewed subpage (from activity table)
- [ ] Most searched error codes (from activity table)

#### 2.4 Implement User Management Functions
- [ ] **Reset Password Button**
  - Uses Supabase Auth's `.resetPasswordForEmail()`
  - Sends email to user
  - Toast notification: "Password reset email sent"

- [ ] **Ban User Button**
  - Updates `user_roles.banned = true` OR add banned column
  - Invalidates active sessions
  - Prevents login
  - Button changes to "Unban"

- [ ] **Allow/Unban Button**
  - Updates `user_roles.banned = false`
  - Re-enables login
  - Button changes to "Ban"

- [ ] **Role Change Button**
  - Dropdown menu: user → admin → moderator → user
  - Updates `user_roles.role` via Supabase
  - Real-time sync

#### 2.5 User List UI Improvements
- [ ] Display in standardized list format
- [ ] Username as primary identifier (bold)
- [ ] Subtext: visits, role, ban status
- [ ] Clickable to select/view details

**Deliverables:**
- Full user management dashboard
- Session/activity tracking working
- All user functions operational

---

## Phase 3: Settings & UI Polish
**Duration:** Medium priority - improves UX

### Tasks:

#### 3.1 Fix Settings Pop-up Styling
- [ ] Correct colors for light/dark modes
- [ ] Hide scrollbars in dialogs (CSS)
- [ ] Proper spacing and layout

#### 3.2 Add Account Tab to Settings
- [ ] New tab: "Account" (alongside General, About)
- [ ] Username Change
  - Input field to update username
  - Save to profiles table
  - Validation: 3-20 characters, alphanumeric

- [ ] Reset Password
  - Button sends reset email via Supabase Auth
  
- [ ] Export Data
  - Export user's favorites, search history, activity as JSON
  - Download as file
  
- [ ] Request Role Upgrade
  - Form with reason/message
  - Sends to admin notification (or email)
  - Shows pending status if already requested
  
- [ ] Delete Account
  - Confirmation dialog (3-step)
  - Deletes user profile and associated data
  - Logs user out

#### 3.3 Enhance General Tab
- [ ] Add switch: **Enable Tooltips**
  - Toggles tooltip visibility app-wide
  - Stored in localStorage
  
- [ ] Add switch: **Slim Line Mode**
  - Reduces padding/margins throughout app
  - Compact UI view
  
- [ ] Add switch: **Save Error Codes to Device**
  - Enables offline mode
  - Syncs error codes to IndexedDB/localStorage
  - Shows sync status

#### 3.4 Redesign About Tab
- [ ] Better app description:
  - "Heat Pump Error Code Assistant: Professional diagnostic tool for HVAC technicians"
  - List features: AI diagnosis, offline mode, service history, cost estimation, QR scanning, photo analysis
  
- [ ] Footer row (auto-resize):
  - "Created by: Jamie Reddin | Version: 1.5.2"
  - Sticks to bottom of dialog
  - Responsive layout
  
- [ ] New Contact Button
  - Opens contact form pop-up
  - Fields: Email, Username, Subject, Message (textarea)
  - Send button sends email to jayreddin@hotmail.com (via email service)
  - Shows success message, closes pop-up

#### 3.5 Implement App-Wide Tooltips
- [ ] Add tooltip provider (Radix UI already available)
- [ ] Add tooltips to ALL buttons with meaningful text
- [ ] Tooltips only show when "Enable Tooltips" is ON
- [ ] Tooltip text examples:
  - "View service history for equipment"
  - "Scan QR code to identify device"
  - "Get AI-powered troubleshooting help"
  - etc.

#### 3.6 Scrollbar Hiding
- [ ] Global CSS for all pop-ups/dialogs:
  ```css
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  &::-webkit-scrollbar { display: none; } /* Chrome */
  ```

**Deliverables:**
- Settings fully functional and styled
- Tooltips working app-wide
- Account management complete

---

## Phase 4: Analytics, Logs & Advanced Features
**Duration:** Lower priority - nice-to-have features

### Tasks:

#### 4.1 Implement App Logs System
- [ ] Create `app_logs` table in Supabase
  - id, level (info/warn/error), message (text), stack_trace (json), timestamp, user_id, page_path
  
- [ ] Create logger utility: `src/lib/logger.ts`
  - Methods: log(), warn(), error()
  - Sends to Supabase + console
  - Catches errors automatically
  
- [ ] Create AdminAppLogs page
  - Display logs in real-time table
  - Filter by: level, date range, user, page
  - Search by message/stack trace
  - Auto-refresh or manual refresh
  - Download logs as CSV

#### 4.2 Implement Analytics
- [ ] Create `src/lib/analytics.ts`
  - Track: page views, searches, clicks, errors
  - Send to `app_analytics` table
  - Batch events (send every 30s or on page leave)
  
- [ ] Create AdminAnalytics page enhancements
  - Dashboard KPIs:
    - Total page views (by page)
    - Total searches (by error code)
    - Most active users
    - Most viewed brands/models
    - Error code frequency
  
  - Visualizations:
    - Line chart: activity over time
    - Bar chart: top pages
    - Pie chart: brand popularity
  
  - Filters: date range, user, brand, model

#### 4.3 Photo Diagnosis Camera Feature
- [ ] Create `src/components/PhotoDiagnosisModal.tsx`
  - Modal with camera input (HTML5 video/canvas)
  - Capture button: takes photo
  - Upload/Analyze button
  - Shows analyzing progress bar (fake ~3s)
  - Sends to AI service (OpenAI Vision OR local placeholder)
  - Shows results: equipment detected, potential issues, recommendations
  - Save photo to `diagnostic_photos` table

#### 4.4 Enhance Troubleshooting Wizard
- [ ] Review current flow
- [ ] Add new questions FIRST:
  - "Select Brand" (dropdown from `brands` table)
  - "Select Model" (filtered by brand)
  - "Select Equipment Category" (dropdown)
  - "What's the error code?" (text input)
  - Then follow-up questions based on selections
  
- [ ] Link recommendations to selected brand/model
- [ ] Show error codes from device-specific table
- [ ] Suggest solutions based on brand/model context

#### 4.5 Fix Admin/Fix-Steps Layout & Styling
- [ ] Fix dark/light mode text colors
- [ ] Fetch brands, models, categories from Supabase (not hardcoded)
- [ ] Dropdown selectors properly styled
- [ ] Implement fix steps CRUD

#### 4.6 Fix Admin/Add-Error-Info & Admin/Add-Error-Code Pages
- [ ] Fetch brands, models from Supabase
- [ ] Implement CRUD for error info
- [ ] Proper styling for both modes
- [ ] Real-time database sync

**Deliverables:**
- Full analytics dashboard
- App logs system
- Photo diagnosis working
- Troubleshooting wizard improved
- All admin pages fully functional

---

## Implementation Order
1. **Phase 1** - Database + Device Management (most critical)
2. **Phase 2** - User Management (important for admin)
3. **Phase 3** - Settings/UX (enhances usability)
4. **Phase 4** - Analytics/Logs (monitoring & advanced features)

---

## Database Schema Summary (Supabase)

```sql
-- Phase 1
brands(id, name, description, logo_url, created_at, updated_at)
models(id, brand_id→brands, name, description, specs, created_at, updated_at)
categories(id, name, description, created_at, updated_at)
tags(id, name, description, created_at, updated_at)
media(id, name, url, type, description, created_at, updated_at)
urls(id, name, url, category, description, created_at, updated_at)

-- Phase 2
user_sessions(id, user_id→auth.users, session_start, session_end, ip, device_info)
user_activity(id, user_id→auth.users, activity_type, path, meta, timestamp)

-- Phase 4
app_analytics(id, user_id, device_id, event_type, path, meta, timestamp)
app_logs(id, level, message, stack_trace, timestamp, user_id, page_path)
```

---

## File Changes Summary

### Phase 1
- Create: `src/pages/AdminAddDevice.tsx` (update)
- Create: `src/lib/deviceManager.ts` (new)
- Update: `src/App.tsx` (dynamic routes)
- Update: `src/pages/Admin.tsx` (sync brands/models)
- Update: `src/integrations/supabase/types.ts`

### Phase 2
- Create: `src/lib/tracking.ts` (enhance)
- Update: `src/pages/AdminUsers.tsx` (major)
- Create: `src/hooks/useUserActivity.ts`
- Create: `src/components/UserManagement.tsx` (buttons)

### Phase 3
- Update: `src/components/Settings.tsx` (major)
- Create: `src/components/ContactForm.tsx`
- Create: `src/components/Tooltip.tsx` (wrapper)
- Update: `src/App.css` (scrollbar hiding, tooltips)

### Phase 4
- Create: `src/pages/AdminAppLogs.tsx` (enhance)
- Create: `src/pages/AdminAnalytics.tsx` (enhance)
- Create: `src/lib/logger.ts`
- Create: `src/lib/analytics.ts`
- Create: `src/components/PhotoDiagnosisModal.tsx` (enhance)
- Update: `src/pages/AdminFixSteps.tsx`
- Update: `src/pages/AdminAddErrorInfo.tsx`

