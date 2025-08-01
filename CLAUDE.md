# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application
```bash
npm run dev       # Start development server with hot reload
npm run preview   # Preview production build locally
```

### Building for Production
```bash
npm run build     # Run TypeScript check and build for production
```

### Code Quality
```bash
npm run lint      # Run ESLint on all files
```

## Architecture Overview

This is a React + TypeScript application built with Vite that visualizes insurance claim journeys through various processing stages.

### Key Technologies
- **React 19** with TypeScript for UI components
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with tailwindcss-animate for styling
- **Radix UI** primitives for accessible UI components
- **Lucide React** for consistent iconography
- **shadcn/ui** component patterns with customization via class-variance-authority

### Component Structure

The application follows a component-based architecture:

1. **Main Entry**: `src/main.tsx` renders the root App component
2. **App Component**: `src/App.tsx` loads the primary ClaimJourneyStages component
3. **Core Component**: `src/components/ClaimJourneyStages.tsx` (1200+ lines) contains the entire claim visualization logic including:
   - Stage-based timeline visualization with expandable sections
   - Mock data for claim processing workflow
   - Event handling for user interactions
   - Multiple tabs for procedures, financial summary, documents, and metrics

### Data Flow

The application uses TypeScript interfaces defined in `src/types/claim.ts`:
- `ClaimData`: Complete claim information including patient, hospital, treatment details
- `TimelineEvent`: Individual events in the claim processing journey
- `Procedure`: Medical procedures with pricing and approval status

### UI Components

Located in `src/components/ui/`:
- Pre-built, accessible components following shadcn/ui patterns
- Customizable through Tailwind classes and CSS variables
- Components include: Badge, Button, Card, Dialog, Table, Tabs

### Styling System

- Tailwind CSS configuration in `tailwind.config.js`
- Global styles in `src/index.css` with CSS custom properties for theming
- Utility functions in `src/lib/utils.ts` for conditional class names

### State Management

Currently uses React's built-in useState for:
- Expanded stage tracking
- Modal/dialog visibility
- Preprocessing toggle state

The application is designed as a single-page visualization tool for tracking insurance claims through various processing stages with detailed timeline events and document tracking.

## Development Memories

- Do not change the localhost port, keep it 5173