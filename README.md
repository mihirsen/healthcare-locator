# Hospital Locator App

A comprehensive hospital locator application built with React, Convex, and TailwindCSS. Find nearby hospitals, medical facilities, and emergency care centers with real-time location-based search.

## Features

### 🔐 Authentication
- **Email/Password Authentication**: Secure user registration and login
- **Anonymous Access**: Quick access without registration
- **User Profile Management**: Save location preferences and search history

### 📍 Location Services
- **Current Location Access**: Get user's current location with permission handling
- **Location Saving**: Store user location for quick access
- **Address Geocoding**: Convert coordinates to readable addresses

### 🏥 Hospital Search & Discovery
- **Nearby Hospitals**: Find hospitals within customizable radius (5-50km)
- **Advanced Filtering**: Filter by hospital type, emergency services, and more
- **Real-time Search**: Search hospitals by name with instant results
- **Distance Calculation**: Accurate distance calculation using Haversine formula

### 🗺️ Interactive Map & List Views
- **Map View**: Visual representation of hospitals with interactive markers
- **List View**: Detailed hospital information in an organized list
- **Hospital Details**: Comprehensive information including services, hours, and contact

### 📱 Mobile-Friendly Design
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Touch-Friendly Interface**: Optimized for mobile interactions
- **Progressive Web App Ready**: Can be installed as a mobile app

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Convex account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hospital-locator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Convex**
   ```bash
   npx convex dev
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### Adding Sample Data

1. **Sign in to the app** (use anonymous sign-in for quick testing)
2. **Click "Add Sample Hospitals"** to populate the database with example hospitals
3. **Allow location access** when prompted to enable location-based features

## Authentication Setup

### Current Authentication Methods

The app currently supports:
- **Email/Password**: Traditional registration and login
- **Anonymous Access**: Quick access without creating an account

### Adding Google Sign-In (Optional)

To add Google OAuth authentication:

1. **Set up Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add your domain to authorized origins

2. **Configure Environment Variables**
   - Open Convex Dashboard → Settings → Environment Variables
   - Add `GOOGLE_CLIENT_ID` with your Google OAuth client ID
   - Add `GOOGLE_CLIENT_SECRET` with your Google OAuth client secret

3. **Update Auth Configuration**
   ```typescript
   // convex/auth.ts
   import { OAuth } from "@convex-dev/auth/providers/OAuth";
   
   export const { auth, signIn, signOut, store } = convexAuth({
     providers: [
       Password,
       Anonymous,
       OAuth({
         id: "google",
         authorization: "https://accounts.google.com/o/oauth2/v2/auth",
         token: "https://www.googleapis.com/oauth2/v4/token",
         userinfo: "https://www.googleapis.com/oauth2/v2/userinfo",
         clientId: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         scope: "openid email profile",
       }),
     ],
   });
   ```

4. **Add Google Sign-In Button**
   ```tsx
   // In SignInForm.tsx
   <button onClick={() => void signIn("google")}>
     Continue with Google
   </button>
   ```

## Location Services

### Browser Geolocation
The app uses the browser's built-in geolocation API to get the user's current location. Users will be prompted to allow location access.

### Location Permissions
- **Granted**: Full functionality with nearby hospital search
- **Denied**: Users can still search hospitals by name
- **Unavailable**: Fallback to manual location entry

### Privacy & Security
- Location data is only stored with user consent
- All location data is encrypted in transit
- Users can delete their location data at any time

## Hospital Data

### Sample Data
The app includes sample hospital data for testing and demonstration:
- General hospitals with emergency services
- Specialty medical centers
- Clinics and urgent care facilities
- Emergency care centers

### Real Hospital Data Integration
To integrate with real hospital data:

1. **Healthcare APIs**: Integrate with healthcare provider APIs
2. **Government Databases**: Use public health department databases
3. **Third-party Services**: Connect to services like Google Places API
4. **Manual Data Entry**: Admin interface for hospital data management

## Technical Architecture

### Frontend
- **React 19**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework
- **Vite**: Fast build tool and development server

### Backend
- **Convex**: Real-time database and backend functions
- **Convex Auth**: Authentication and user management
- **Real-time Sync**: Automatic data synchronization

### Database Schema
```typescript
// Hospitals table
hospitals: {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: "general" | "specialty" | "emergency" | "clinic";
  services: string[];
  isEmergency: boolean;
  operatingHours: Record<string, string>;
  rating?: number;
  phone?: string;
  email?: string;
  website?: string;
}

// User locations table
userLocations: {
  userId: Id<"users">;
  latitude: number;
  longitude: number;
  address?: string;
  lastUpdated: number;
}
```

## API Reference

### Hospital Queries
- `getNearbyHospitals`: Find hospitals within specified radius
- `searchHospitals`: Search hospitals by name with filters
- `getHospitalById`: Get detailed hospital information

### Location Functions
- `saveUserLocation`: Save user's current location
- `getUserLocation`: Retrieve user's saved location

### Authentication
- `loggedInUser`: Get current authenticated user
- `signIn`: Authenticate user with various providers
- `signOut`: Sign out current user

## Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Convex Deployment
```bash
npx convex deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

## Roadmap

### Upcoming Features
- [ ] Google Maps integration
- [ ] Hospital reviews and ratings
- [ ] Appointment booking
- [ ] Emergency contact integration
- [ ] Offline mode support
- [ ] Push notifications
- [ ] Multi-language support

### Performance Improvements
- [ ] Image optimization
- [ ] Caching strategies
- [ ] Bundle size optimization
- [ ] Progressive loading
