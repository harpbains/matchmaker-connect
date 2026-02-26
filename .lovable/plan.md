

# DesiConnect Global — NRI Dating App + Admin Console

## Phase 1: Foundation & Design System
- Set up dark theme with green accent color scheme (#10B981) matching the Figma
- Create mobile-first layout shell with bottom navigation (Discover, Matches, Chats, Profile)
- Create desktop admin layout with sidebar navigation
- Set up Lovable Cloud with Supabase (database, auth, storage)

## Phase 2: Authentication & Onboarding
- Sign up / Login screens (email + password, Google OAuth)
- Multi-step onboarding flow: Basic Info → Cultural Info → Profile Setup with progress tracker
- User profiles table with all fields (name, DOB, gender, location, religion, languages, dietary preferences, visa status, education, profession, height, bio, photos)
- User roles table (admin, moderator, user)
- Profile photo upload to Supabase storage (3-6 photos)

## Phase 3: Mobile App — Core Screens
- **Discovery Feed (Home)**: Swipeable profile cards with photo, name, age, location, tags (like Figma). Casual/Matrimony mode toggle. "Online Now" user row at top. Like/Pass/Super-Like buttons
- **Profile Detail View**: Full scrollable profile with photo carousel, About Me, Cultural Identity tags, Compatibility score, Interests, height/education info cards
- **"It's a Match" Screen**: Modal overlay when mutual like occurs, with "Send a Message" and "Keep Browsing" buttons
- **Matches Page**: Tabs for All Matches, New Likes, Super Likes. Grid of match cards with photos and verification badges
- **Messages Page**: Conversation list with avatars, last message preview, timestamps, unread indicators. Chat window with text messaging, timestamps, read receipts
- **Settings Page**: Profile photo & name header, Matrimony Mode toggle, Personal Information, Email & Phone, Notifications, Discovery Settings, Language & Region, Privacy Center, Blocked Users, Logout
- **Filters Modal**: Age range slider, distance slider, advanced filters (religion, language, intent, education, profession, visa status)

## Phase 4: Subscription & Monetization System
- Subscription tiers table (Free, Active €12.99, Pro €39.99)
- Tier-based feature gating (swipe limits, message limits, filter access, boost access)
- Boost system UI (Standard, Corridor, Serious Intent, Premium Spotlight)
- Daily gifts/rewards system for free user retention
- Subscription plan selection screen

## Phase 5: Admin Console (Desktop)
- **Dashboard**: Key metrics — total users, gender ratio, active users, conversion rates (Free→Active→Pro), revenue charts
- **User Management**: Searchable/filterable user table, view/edit profiles, subscription override, ban/suspend/shadow-ban actions
- **Feature Variables**: Swipe/message limits per tier, boost durations & pricing, daily gift probabilities, filter thresholds, feed ranking weights — all editable
- **Content Management**: Prompt pool editor, safety tips editor, notification templates, announcement banners
- **Moderation Panel**: Reported users queue, flagged content review, block/ban actions with auto-threshold settings
- **Subscription Controls**: Pricing per region, feature toggles per tier, discount codes
- **Analytics**: Gender ratio by region, match/chat metrics, boost purchase rates, churn tracking with Recharts visualizations

## Phase 6: Advanced Features
- Profile verification system (selfie + badge display)
- Notification system (new match, message, profile views, boost expiring)
- Block & report flow
- Account controls (pause, hide, delete account)
- Profile recycling logic (passed profiles reappear after configurable days)
- Travel/Passport mode for Pro users

