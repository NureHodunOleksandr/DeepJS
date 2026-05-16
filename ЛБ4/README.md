# EventFlow: Laboratory Work 4

EventFlow is a Vue 3 + Vite application for event registration. It demonstrates advanced Vue features through a dark, responsive multi-page event app with client-side routing, validation, persistence, asynchronous registration, optimistic UI updates, error handling, and rollback.

## Technologies

- Vue 3
- Vite
- Vue Router
- Composition API
- Composables
- localStorage
- Plain CSS

## Implemented Features

- Events list page with responsive event cards.
- Event details page with full event information and registered users.
- Event registration page with reactive form state.
- Form validation for required name, required email, email format, and duplicate email per event.
- Registrations are saved in localStorage and remain after reload.
- Simulated async request with Promise and setTimeout.
- Optimistic UI update: a pending participant appears immediately.
- Rollback on simulated failure: the pending participant is removed and an error is shown.
- Successful registration state and toast notifications rendered with Teleport.
- Router navigation with RouterLink, RouterView, fallback 404 route, and KeepAlive for the events list.

## Project Structure

```text
src/
  assets/
    main.css
  components/
    AppHeader.vue
    BaseToast.vue
    EventBanner.vue
    EventCard.vue
    RegisteredUsers.vue
    RegistrationForm.vue
  composables/
    useEvents.js
    useLocalStorage.js
    useRegistrations.js
  router/
    index.js
  views/
    EventDetailsView.vue
    EventsView.vue
    NotFoundView.vue
    RegisterView.vue
  App.vue
  main.js
```

## Install

From the repository root, open the Lab 4 folder first:

```bash
cd ЛБ4
```

```bash
npm install
```

## Run

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173/`.

## Build

```bash
npm run build
```

## Short Technical Explanation

The Composition API is used in every component through `<script setup>`, refs, reactive objects, computed values, and composables. The reusable logic is split into `useEvents`, `useLocalStorage`, and `useRegistrations`.

Vue Router defines pages for `/events`, `/events/:id`, `/events/:id/register`, and a fallback route. Navigation uses `RouterLink`, and the app renders pages through `RouterView`. The events list is wrapped with `KeepAlive`.

`useLocalStorage` synchronizes a Vue ref with localStorage and safely handles invalid stored JSON. `useRegistrations` stores all registrations in localStorage, checks duplicates, adds an optimistic pending registration, simulates a server request, confirms the record on success, and removes it on failure.

To test rollback, open any registration page, fill in valid data, enable `Simulate server error`, and submit. The participant appears as pending immediately, then disappears after the simulated request fails.
