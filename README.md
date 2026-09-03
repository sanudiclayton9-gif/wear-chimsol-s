# Wear Chimsol

A catalog site for a tailoring business. Customers browse designs, like and
comment on them, and order or consult directly over WhatsApp. The owner adds,
edits, and removes designs from a private dashboard at `/admin` that is not
linked anywhere on the public site and is blocked from search engines.

## How it works

- **Public site (`/`)** — anyone can browse designs, like them, leave
  comments, and tap "Order on WhatsApp" to message the business directly
  about a specific piece.
- **Owner dashboard (`/admin`)** — protected by a sign-in. Only the owner can
  add new designs (photo link, description, price) or delete old ones.
  Customers never see this page or a link to it.
- Data (designs, likes, comments) is stored in **Firebase Firestore**, so
  changes the owner makes show up for every visitor, on every device,
  immediately.

## One-time setup: create your Firebase project

This is required before the site will work — Firebase is what stores your
designs and comments.

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
   and sign in with a Google account.
2. Click **Add project**, name it (e.g. "wear-chimsol"), and finish the
   wizard (Google Analytics is optional — you can skip it).
3. In your new project, click the **web icon (`</>`)** to register a web
   app. Name it anything. Skip Firebase Hosting.
4. Copy the `firebaseConfig` values shown — you'll need them for the
   `.env.local` file below.
5. In the left sidebar, go to **Build → Firestore Database → Create
   database**. Choose **production mode**, pick a location close to
   Zimbabwe (e.g. `europe-west` or similar), and create it.
6. Go to the **Rules** tab of Firestore and replace the rules with:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /designs/{designId} {
         allow read: if true;
         allow create, delete: if request.auth != null;
         allow update: if request.auth != null
           || request.resource.data.diff(resource.data).affectedKeys().hasOnly(['likeCount']);
         match /comments/{commentId} {
           allow read: if true;
           allow create: if true;
           allow update, delete: if request.auth != null;
         }
       }
       match /reviews/{reviewId} {
         allow create: if true;
         allow read, update, delete: if request.auth != null;
       }
     }
   }
   ```

   This lets anyone read designs/comments, like a design, and post a
   comment, but only a signed-in owner can add/edit/delete designs.
   Customer feedback (`reviews`) can be submitted by anyone, but only the
   signed-in owner can ever read it — it never appears on the public site.

7. Click **Publish**.
8. Go to **Build → Authentication → Get started**. Enable the
   **Email/Password** sign-in method (leave "Email link" off).
9. Still in Authentication, go to the **Users** tab → **Add user**. Enter
   the email and password you (the owner) want to log in with. This is
   your admin login — keep it private.
10. Go to **Build → Storage → Get started**. Click through the setup
    (default/production mode is fine). This is where design photos are
    stored when you upload them from the dashboard.
11. Go to the **Rules** tab of Storage and replace the rules with:

    ```
    rules_version = '2';
    service firebase.storage {
      match /b/{bucket}/o {
        match /designs/{fileName} {
          allow read: if true;
          allow write: if request.auth != null;
        }
      }
    }
    ```

    This lets anyone view design photos, but only a signed-in owner can
    upload new ones.

12. Click **Publish**.

## Local setup

```bash
npm install
cp .env.local.example .env.local
```

Open `.env.local` and paste in the Firebase config values from step 4 above.

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site, and
`http://localhost:3000/admin` to sign in and add your first designs.

## Deploying (Vercel)

1. Push this project to GitHub (same process as before: `git init`,
   `git add .`, `git commit`, `git remote add origin ...`, `git push`).
2. In Vercel, **Add New → Project**, import the repo.
3. Before clicking Deploy, expand **Environment Variables** and add all six
   `NEXT_PUBLIC_FIREBASE_...` values from your `.env.local` file — Vercel
   won't have your local `.env.local`, so this step is required or the live
   site won't connect to Firebase.
4. Click **Deploy**.

## WhatsApp number

Currently set to `0775178065` (Zimbabwe), converted to international format
`263775178065` in `lib/constants.ts`. If the number ever changes, update it
there — the EcoCash number shown to customers uses the same constant file.

## Site URL for SEO

`app/layout.tsx` has a `SITE_URL` constant used in the structured data
(the info that helps Google understand this is a real tailoring business).
If your live URL ever changes (e.g. you rename the Vercel project or add a
custom domain), update `SITE_URL` there to match.

## A note on WhatsApp orders and photos

WhatsApp's "click to chat" links can prefill text, but they cannot attach
images automatically — that's a WhatsApp limitation, not something this
site can work around. When a customer sends an order, the WhatsApp message
includes a direct link to each design's photo instead, so you can tap to
view it instantly.

## Customizing

- **Colors/fonts**: design tokens are at the top of `app/globals.css`.
- **Business name**: `BUSINESS_NAME` in `lib/constants.ts`.
- **Hero text**: `app/page.tsx`.
