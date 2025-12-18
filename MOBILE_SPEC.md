# JaiKod Mobile App Specification & UX/UI Architecture

## 1. Overview & Vision
*   **Target Platform**: iOS & Android (Cross-platform via **React Native** or **Flutter**)
*   **Core Philosophy**: "Camera-First, AI-Native, Offline-Robust"
*   **Primary Goal**: A frictionless, addictive browsing experience similar to social media apps, optimized for unstable networks.

---

## 2. Navigation Architecture

**Deep Link Structure**: `jaikod://product/:id`, `jaikod://shop/:id`, `jaikod://chat/:id`

### Bottom Tab Bar (5 Tabs)
1.  **Home** (🏠): Personalized "For You" Feed + "Following" Tab.
2.  **Explore** (🧭): Search, Categories, Map View/Near Me, Hourly Trends.
3.  **Sell** (📸): *Center, Floating FAB*. Immediate Camera open -> AI Analysis -> Form.
4.  **Chat** (💬): Inbox, Notifications, Order Updates.
5.  **Profile** (👤): My Listings, Settings, Dashboard (for Sellers).

---

## 3. Key UX Flows & Wireframes

### A. Home Screen ("For You" Infinite Feed)
*   **Layout**: Staggered Grid (Pinterest-style) or Full-screen Card (TikTok-style) toggle.
*   **Components**:
    *   *Top Bar*: Location Chip ("Bangkok 📍") + Notification Bell.
    *   *Feed Items*: Large image, Price (Bold), Title, "Heart" button.
    *   *Interstitials*: Every 8 items, show "Trending Category" rail or "Flash Sale" banner.
*   **UX Pattern**:
    *   **Skeleton Loading**: Grey pulse blocks while fetching.
    *   **Progressive Image Loading**: Show blurry thumbnail -> Fade in High-Res.
    *   **Prefetching**: Preload next screen of data on scroll reach 70%.

### B. "Snap & Sell" (Upload Flow)
*   **Step 1: Camera Interface**
    *   Full-screen viewfinder.
    *   AI Overlay: Real-time object detection box ("Mobile Phone detected").
    *   Guidance: "Hold steady for condition scan".
*   **Step 2: AI Processing (The "Magic" Moment)**
    *   Animation: "Analyzing..." (1-2s).
    *   Result: Form pre-filled (Title: "iPhone 13 Pro", Category: "Mobile", Condition: "Good").
*   **Step 3: Edit & Publish**
    *   User validates price.
    *   Auto-generated description presented as chips to add/remove.
    *   **Offline Queue**: If no net, save as "Pending Upload". Background sync when online.

### C. Near Me (Explore)
*   **Map Mode**: Cluster pins. Filter by "Open Now" or "Official Store".
*   **List Mode**: Sort by "Distance".
*   **UX**: "Recenter" button. Permission request only when accessing this tab.

### D. Chat (Offline First)
*   **Optimistic UI**: Message appears *instantly* with "clock" icon. Turns to "check" when sent.
*   **Media**: Compressed video/image preview sent immediately. High-res uploads in background.
*   **Quick Actions**: "Send Location", "Make Offer", "Share Product" accessible via `+` menu.

---

## 4. Mobile Technical Specifications

### A. Image Optimization (Client-Side)
*   Do NOT upload raw 12MP photos (5MB+).
*   **Process**:
    1.  Resize to max 1920x1080.
    2.  Compress (JPEG 80% quality or WebP).
    3.  Strip EXIF (GPS) for privacy (unless "Near Me" enabled).
    4.  **Result**: Target size ~150KB - 300KB per image.

### B. Offline & Data Sync (WatermelonDB / SQLite)
*   **Critical Data Cached**:
    *   User Profile & Settings.
    *   Chat History (Last 50 msgs/chat).
    *   My Active Listings.
*   **Sync Logic**:
    *   On App Open: Fetch "Delta" updates (changes since `last_sync_timestamp`).
    *   Background Job: Retry failed uploads every 15 mins (using WorkManager/BackgroundFetch).

### C. Performance Budget
*   **App Startup (Cold)**: < 2.0 seconds (Splash to Interaction).
*   **Feed Scroll**: Consistently 60 FPS (Recycle Views properly).
*   **Network Payload**:
    *   Initial Feed JSON: < 20KB (Gzipped).
    *   Use **GraphQL** to fetch *only* needed fields (`id`, `img`, `price`, `title`).

---

## 5. API Design for Mobile

### Endpoints Highlights
*   `GET /api/v1/feed?cursor=xyz&limit=10`: Cursor-based pagination (never Offset).
*   `POST /api/v1/device/register`: Register FCM/APNS token.
*   `GET /api/v1/config`: Feature flags (enable_christmas_theme, enable_new_ai).

### Real-time (Socket)
*   **Events**: `msg_receive`, `typing_start`, `typing_stop`, `offer_receive`.
*   **Heartbeat**: Ping every 30s to maintain presence.

---

## 6. Security (Mobile Specific)
*   **Biometric Login**: TouchID/FaceID for fast access (wrap Refresh Token in SecureStore/Keystore).
*   **Certificate Pinning**: Prevent Man-in-the-Middle attacks on public WiFi.
*   **Root Detection**: Disable "Payment" features on rooted/jailbroken devices.

---

## 7. Analytics & Instrumentation
*   **Screen Tracking**: `screen_view { name: 'product_detail', category: 'mobile' }`
*   **Action Tracking**:
    *   `upload_start`: When camera opens.
    *   `upload_complete`: When success (measure duration).
    *   `ai_correction`: Did user edit the AI-suggested title? (Accuracy Metric).
    *   `chat_safety_trigger`: When safety banner appears.

---

## 8. Accessibility (A11y)
*   **Dynamic Type**: Support system font scaling.
*   **TalkBack/VoiceOver**: All images must have `alt` text (AI generated -> "Blue iPhone 13 on table").
*   **Touch Targets**: Min 44x44pt for buttons.
