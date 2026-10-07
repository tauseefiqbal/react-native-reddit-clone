# RedditClone

## Table of Contents

- [FEATURES](#features)
- [TECH STACK](#tech-stack)
- [DEPLOYMENT](#deployment)
- [HOW TO USE APP FOR REGULAR USER](#how-to-use-app-for-regular-user)
- [Additional Information](#additional-information)
  - [Run Locally](#run-locally)
  - [Environment Variables](#environment-variables)
  - [Pending](#pending)

## FEATURES

- ✅ Create an account with email verification and sign in with email and password.
- ✅ Browse a paginated post feed, refresh it, and load more posts.
- ✅ Create text posts and attach an image.
- ✅ Choose a community for a post using the searchable community selector.
- ✅ Open posts, add comments, and reply to comments.
- ✅ Upvote or downvote posts.
- ✅ Delete your own comments.
- ✅ Sign out of your account.

## TECH STACK

- **React Native** and **Expo** for the mobile app and Expo web support.
- **TypeScript** for application code and Supabase database types.
- **Expo Router** for file-based navigation.
- **Clerk** for account registration, email verification, and authentication.
- **Supabase** for database and image storage access.
- **TanStack Query** for fetching and caching server data.
- **Jotai** for client-side state.

## DEPLOYMENT

**APP URL:** [Add the live app URL here]

## HOW TO USE APP FOR REGULAR USER

1. Open the app and create an account with your email, username, and password.
2. Enter the email verification code sent to your inbox.
3. Sign in with your email and password.
4. Browse posts on the Home tab. Pull down to refresh or scroll to load more.
5. Open a post to read its discussion. Use the comment field to join in, or select Reply on a comment to respond to it.
6. Use the upvote and downvote controls on a post to vote.
7. To publish, open Create, choose a community, enter a title, and optionally add text or an image. Select Post to submit it.
8. Use the sign-out icon in the top-right corner to sign out.

## Additional Information

### Run Locally

1. Install the project dependencies:

   ```bash
   npm install
   ```

2. Configure the environment variables listed below.
3. Start Expo:

   ```bash
   npx expo start
   ```

Use the Expo terminal options to open the app on a connected device, emulator, or web browser.

### Environment Variables

Create a `.env` file in the project root and provide the project credentials:

```dotenv
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Configure the Clerk JWT template expected by the app for Supabase access (`supabase`). Do not commit real credentials to source control.

### Pending

- Add the live app URL in the Deployment section when it is available.
- The Communities tab is currently a placeholder; community selection is available when creating a post.