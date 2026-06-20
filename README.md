# ZupChat

ZupChat is a real-time chat web application built as my final degree project during the Frontend Developer program at Medieinstitutet in Malmö.

The project was built with React, TypeScript and Firebase, with a focus on authentication, real-time messaging, image sharing, profile handling and a responsive user interface. The goal was to create a stable and visually distinct chat application within a realistic project scope.

## Live Demo

https://zupchat.mx10.se/

## Tech Stack

| Area           | Technologies                                         |
| -------------- | ---------------------------------------------------- |
| Frontend       | React, TypeScript, Vite                              |
| Routing        | React Router DOM                                     |
| Styling        | Tailwind CSS                                         |
| Backend / BaaS | Firebase Authentication, Firestore, Firebase Storage |
| Icons          | Lucide React                                         |
| Deployment     | Netlify                                              |
| Code quality   | ESLint, TypeScript                                   |

## Features

- Email and password authentication with Firebase Auth
- Global auth state with Context API and `useReducer`
- Protected route handling
- Profile onboarding with nickname and optional profile image
- Unique nickname handling through Firestore
- Update profile information
- Remove profile photo
- Two-step account deletion confirmation
- Delete user account
- User-friendly Firebase auth error messages
- Three fixed chat rooms:
  - HeroVerse
  - SpaceVerse
  - ExclusiveVerse

- Client-side access code gate for ExclusiveVerse
- Real-time text messages using Firestore listeners
- Image messages using Firebase Storage
- Send text-only, image-only or text + image messages
- Delete own messages
- Cleanup handling for deleted chat images in Firebase Storage
- Joined/left system messages
- Date separators in the chat
- Auto-scroll to the latest message
- Responsive layout for mobile and desktop
- Room-specific themes, colors, logos and backgrounds
- Dynamic room backgrounds:
  - HeroVerse and ExclusiveVerse use time-of-day backgrounds
  - SpaceVerse uses a random background on room entry

## Project Idea

ZupChat was designed as a themed real-time chat application with three separate rooms, each with its own visual identity.

The project combines core chat functionality with a modern neon noir comic-inspired interface. The visual direction uses dark backgrounds, neon colors, themed room graphics and comic-inspired chat bubbles to give the app a stronger identity than a generic chat interface.

The focus was not to build a full production chat platform, but to create a stable and understandable application that demonstrates frontend development, Firebase integration, real-time data handling and UI work.

## Project Scope

A major part of the project was keeping the scope realistic. I treated the project as a small customer case where the goal was to deliver the promised functionality within a fixed time frame.

Included in scope:

- Authentication
- Profile onboarding
- Real-time chat
- Image sharing
- Three fixed chat rooms
- One access-protected room
- Responsive UI
- Firebase integration
- Deployment

Not included in scope:

- Private one-to-one chats
- User-created rooms
- Push notifications
- End-to-end encryption
- Advanced presence tracking
- Full moderation system

These limitations were intentional. They allowed me to focus on stability, structure and user experience instead of adding too many complex features.

## Project Structure

```txt
zupchat/
  public/
    _redirects

  src/
    components/
      backgrounds/
      chat/
        MessageBubble.tsx
      AccessModal.tsx
      Navbar.tsx
      Spinner.tsx

    context/
      AuthContext.ts
      AuthContextProvider.tsx

    firebase/
      config.ts

    hooks/
      useAuthContext.ts
      useDeleteAccount.ts
      useDeleteMessage.ts
      useLogin.ts
      useLogout.ts
      useMessages.ts
      useSendMessage.ts
      useSignup.ts

    pages/
      LandingPage.tsx
      LoginPage.tsx
      SignupPage.tsx
      ProfilePage.tsx
      LobbyPage.tsx
      ChatRoomPage.tsx

    services/
      chatService.ts
      photoUploadService.ts
      userService.ts

    types/
      message.ts
      user.ts

    utils/
      accessibleErrorMsg.ts
      formatDate.ts
      formatTime.ts

    App.tsx
    main.tsx
    index.css

  index.html
  vite.config.ts
  eslint.config.js
  tsconfig.json
  package.json
```

The project is structured around pages, reusable components, custom hooks, services, context and typed data models.

## Authentication Flow

The app uses Firebase Authentication together with a custom auth context.

The auth flow is built with:

- `AuthContext`
- `useReducer`
- `onAuthStateChanged`
- separate hooks for signup, login and logout

Basic flow:

```txt
Not logged in
→ Landing / Login / Signup

Logged in without a Firestore profile document
→ Profile onboarding

Logged in with a Firestore profile document
→ Lobby and chat rooms
```

After signup or login, the user is sent to the profile page. New users complete onboarding by choosing a nickname and optional profile image. Returning users can update their profile information there.

The lobby checks whether a Firestore profile document exists for the current user. If no profile document is found, the user is redirected back to the profile page.

## Firebase Structure

ZupChat uses Firebase Authentication for user accounts, Firestore for user profiles and messages, and Firebase Storage for profile images and chat images.

Firestore structure:

```txt
users/{uid}
usernames/{lowercaseNickname}
rooms/{roomId}/messages/{messageId}
```

Room ids:

```txt
heroverse
spaceverse
exclusiveverse
```

Example message fields:

```txt
text
type
imageUrl
userId
userNickname
userPhotoURL
createdAt
```

Firebase Storage paths:

```txt
thumbnails/{uid}/{timestamp}-{filename}
chat-images/{roomId}/{userId}/{timestamp}-{filename}
```

## Real-Time Chat

Messages are stored as subcollections under each room:

```txt
rooms/{roomId}/messages/{messageId}
```

The app listens to messages with Firestore `onSnapshot`, which makes the chat update in real time without refreshing the page.

Each message contains information about the sender, message type, timestamp and optional image URL. This makes it possible to style own and other users' messages differently, display profile images, show date separators and allow users to delete their own messages.

## Image Upload

ZupChat supports image uploads for both profile images and chat messages.

The image flow includes:

- file selection
- file type validation
- file size validation
- local preview
- upload to Firebase Storage
- saving the image URL in Firestore
- cleanup handling when image messages are deleted

This helped me practice working with files, Firebase Storage and data cleanup in a real application flow.

## Design Direction

The visual direction of ZupChat is a modern neon noir comic style.

Instead of using a classic retro comic style, the app uses:

- dark city and sci-fi inspired backgrounds
- neon colors
- room-specific themes
- comic-inspired chat bubbles
- subtle animated backgrounds
- a visual identity for each room

The goal was to make the app feel like a themed digital space while keeping the interface readable and usable.

## Deployment

The project was deployed to Netlify.

During deployment, I solved a client-side routing issue where refreshing internal routes caused a 404 error. This was fixed by adding a redirect rule for single-page application routing:

```txt
/* /index.html 200
```

## Getting Started

### Prerequisites

- Node.js
- npm
- A Firebase project with Authentication, Firestore and Storage enabled

### Installation

```bash
git clone <repository-url>
cd zupchat
npm install
```

### Environment Variables

Create a `.env` file in the project root.

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_EXCLUSIVE_ACCESS_CODE=your_access_code_here
```

`VITE_FIREBASE_API_KEY` is required.

`VITE_EXCLUSIVE_ACCESS_CODE` is optional and is used for the ExclusiveVerse access gate.

Other Firebase configuration values, such as `authDomain`, `projectId`, `storageBucket`, `messagingSenderId` and `appId`, are currently defined in `src/firebase/config.ts`.

Do not commit real environment variable values.

### Static Assets

The app references static visual assets such as images, logos and room backgrounds.

If you clone or deploy the project, make sure the required assets are included in the `public` folder or are otherwise available in the deployed environment.

### Run Locally

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Notes

ExclusiveVerse uses a client-side access code gate before entering the room. This is suitable for the scope of this school project, but it should not be treated as production-level access control.

Account deletion removes the Firebase Auth user, the Firestore user profile document and the profile photo. It does not remove previous chat messages or nickname reservation documents.

Route protection is handled with inline route guards and redirects in the application flow.

## What I Learned

During the project I gained more experience with:

- React and TypeScript in a larger project
- Firebase Authentication
- Firestore real-time listeners
- Firebase Storage
- file upload flows
- protected route handling
- custom hooks
- Context API and reducer-based state management
- responsive layout
- deployment and routing issues
- project planning and scope management

One of the most important lessons was the value of realistic scope. I chose to focus on a stable and understandable core application instead of adding too many advanced features. This made it possible to complete the project close to the planned time frame and still leave room for UI, testing and polish.

## Status

ZupChat was completed as a school project and final degree project. It is not intended as a production-ready chat platform, but as a portfolio project showing my work with React, TypeScript, Firebase, real-time functionality, authentication, image upload and UI development.
