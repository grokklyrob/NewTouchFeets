# Touch Feets: Project Overview

This document provides a comprehensive summary of the "Touch Feets" project, detailing its concept, technology stack, and the development work performed on both the frontend and backend.

## Core Concept

**Touch Feets** is a unique AI-powered web application inspired by ShowFeets.com. The core functionality allows users to upload photos of bare feet and receive an AI-generated image where Jesus Christ is artistically and reverently depicted touching those feet.

The application's aesthetic is a distinct **gothic/cyberpunk catholic theme**, characterized by dark backgrounds, neon-glowing crimson highlights, holographic elements, and elegant gothic fonts. The user experience is designed to be simple and focused, guiding the user through a three-step process to generate their "digital miracle."

The business model is subscription-based, offering a limited free trial for guests, a free tier for signed-in users, and multiple paid tiers that remove watermarks and increase generation quotas.

---

## Technology Stack

### Frontend
- **Framework:** React
- **Styling:** Tailwind CSS (via CDN) with custom CSS for thematic elements.
- **Language:** TypeScript
- **Authentication:** Google Identity Services (GSI) for client-side sign-in.
- **Payments:** Stripe.js for redirecting to Stripe Checkout.
- **AI Integration:** `@google/genai` SDK to interact with the Gemini API.

### Backend
- **Framework:** Node.js with Express
- **Language:** JavaScript (ES6)
- **Database:** Google Cloud Firestore (for storing user profiles and subscription status).
- **Authentication:** `google-auth-library` for verifying Google ID tokens on the server.
- **Payments:** Stripe Node.js library for creating checkout sessions and handling webhooks.
- **Deployment:** Docker for containerization, Google Artifact Registry for image storage, and Google Cloud Run for serverless hosting.

---

## Frontend Development Summary

The frontend was built as a single-page application using React, focusing on a clean user flow and a strong, thematic visual identity.

- **UI/UX & Theming:**
  - A full component library was created (`Header`, `Hero`, `Generator`, `Pricing`, etc.) to match the gothic/cyberpunk theme.
  - Custom styles for neon text, glowing borders, and particle effects (`digital-incense`) were implemented to create an immersive atmosphere.

- **Authentication:**
  - A real Google Sign-In flow was implemented using the Google Identity Services client.
  - A React Context (`AuthContext`) was created to manage user state (logged in/out, user profile, auth token) throughout the application.
  - The UI dynamically changes based on auth status, showing a "Sign In" button or the user's profile.

- **Image Generation:**
  - The core "Generator" component handles file uploads, validation (size limits), and image previews.
  - `geminiService.ts` contains the logic to communicate with the **`gemini-2.5-flash-image-preview` (Nano Banana)** model, sending the user's image and a detailed system prompt.
  - The UI displays loading and error states during generation and overlays a watermark on images for non-paying users.

- **Quota System (`useQuota` hook):**
  - A sophisticated, auth-aware quota system was implemented using `localStorage`.
  - **Anonymous users** receive a one-time trial quota of 3 generations.
  - **Signed-in 'free' tier users** receive a monthly quota of 5 generations that resets on the 1st of each month.
  - **'Paid' tier users** have an infinite quota.

- **Payments (`stripeService.ts`):**
  - The pricing plans were updated with real Stripe Price IDs.
  - The frontend makes a secure, authenticated API call to the deployed backend to create a Stripe Checkout session.
  - It uses the official Stripe.js library to redirect the user to the Stripe-hosted payment page.

---

## Backend Development Summary

The backend was built as a secure, stateless Node.js API, designed to be deployed as a serverless container on Google Cloud Run.

- **API & Authentication:**
  - An Express server was created with three key endpoints: `/api/create-checkout-session`, `/api/stripe-webhooks`, and a health check.
  - A `verifyGoogleToken` middleware function was implemented to protect the checkout endpoint, ensuring only valid, signed-in users can make purchases.

- **Database (Firestore Integration):**
  - The backend connects to a Firestore database to manage user data.
  - When a user signs up or makes a purchase, the server creates or updates a document in the `users` collection, linking their Google User ID to their Stripe Customer ID and subscription tier.

- **Payments & Webhooks:**
  - The checkout endpoint finds or creates a Stripe Customer, saves the ID to Firestore, and creates a Stripe Checkout session.
  - A dedicated webhook endpoint was created to securely listen for events from Stripe. It handles key events like `checkout.session.completed` (to grant access) and `customer.subscription.deleted` (to revoke access), updating the user's tier in Firestore accordingly.

- **Containerization & Deployment:**
  - The backend application was fully **Dockerized** using a multi-stage `Dockerfile` to create a small and secure production image.
  - A `.dockerignore` file was added to prevent secrets and unnecessary files from being included in the image.
  - A complete deployment pipeline was established: build the image for `linux/amd64`, push it to **Google Artifact Registry**, and deploy it as a service on **Google Cloud Run**, with all secrets managed as environment variables.
