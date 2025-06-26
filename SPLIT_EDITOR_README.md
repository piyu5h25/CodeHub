# Split Editor Feature

## Overview
The Online Judge now includes a split editor feature that allows users to view problem details and code editor side by side. This provides a better user experience for solving coding problems.

## Features

### Split Editor Layout
- **Left Panel**: Problem details including description, input/output format, constraints, and sample cases
- **Right Panel**: Code editor with syntax highlighting, language selection, and execution capabilities
- **Resizable**: Users can drag the divider to adjust the panel sizes
- **Full Height**: Both panels take the full height of the screen for optimal viewing

### Problem Details Panel
- Displays comprehensive problem information
- Shows difficulty and topic badges
- Includes problem description, input/output formats, and constraints
- Displays sample input/output cases
- Provides explanation section when available

### Code Editor Panel
- Syntax highlighting for multiple languages (C++, C, Python, Java)
- Language selection dropdown
- Custom input field for testing
- Real-time output display
- Run button with loading state

## Implementation Details

### Components Created
1. **ProblemDetail.jsx** - Displays problem information fetched by ID
2. **CodeEditor.jsx** - Reusable code editor component
3. **ProblemEditor.jsx** - Main split editor container using react-split

### Backend Changes
- Added `getProblemById` controller function
- Added `/problems/id/:id` route to fetch problems by MongoDB ID

### Frontend Changes
- Added react-split dependency for resizable panels
- Updated routing to include `/problems/:id` route
- Added custom CSS for split panel styling
- Enhanced problemService with getProblemById method

## Usage

1. Navigate to the Problems page
2. Click on any problem title
3. The split editor will open with:
   - Problem details on the left
   - Code editor on the right
4. Drag the divider to resize panels
5. Write and test your solution

## Technical Stack
- **Frontend**: React with react-split for resizable panels
- **Backend**: Express.js with MongoDB
- **Styling**: Tailwind CSS with custom split panel styles
- **Code Highlighting**: Prism.js with react-simple-code-editor

## File Structure
```
client/src/
├── pages/
│   ├── ProblemDetail.jsx      # Problem information display
│   ├── ProblemEditor.jsx      # Main split editor container
│   └── Problems.jsx           # Updated with navigation links
├── components/
│   └── CodeEditor.jsx         # Reusable code editor
└── services/
    └── problemService.js      # Added getProblemById method

server/
├── controllers/
│   └── problemController.js   # Added getProblemById function
└── routes/
    └── problemRoutes.js       # Added /id/:id route
```

## Dependencies Added
- `react-split`: For resizable split panels 