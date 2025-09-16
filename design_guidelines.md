# JEE Challenge App Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern educational platforms like Khan Academy and Notion, combined with productivity apps like Habitica for gamification elements.

## Core Design Elements

### Color Palette
**Primary Colors:**
- Deep Blue: 220 85% 25% (trust, focus, academic excellence)
- Bright Blue: 210 90% 55% (energy, motivation)

**Supporting Colors:**
- Success Green: 142 70% 45% (completed challenges)
- Warning Orange: 35 85% 55% (pending tasks)
- Error Red: 0 75% 50% (missed deadlines)
- Neutral Gray: 220 10% 95% (backgrounds, borders)

**Dark Mode:**
- Background: 220 25% 8%
- Cards: 220 20% 12%
- Text: 220 15% 90%

### Typography
- **Primary Font**: Inter (Google Fonts) - clean, readable for academic content
- **Headers**: Font weights 600-700, sizes from text-xl to text-4xl
- **Body**: Font weight 400-500, text-sm to text-lg
- **Accent**: Font weight 500 for buttons and CTAs

### Layout System
**Spacing Primitives**: Tailwind units of 2, 4, 6, and 8
- Tight spacing: p-2, m-2 for compact elements
- Standard spacing: p-4, m-4 for general layout
- Generous spacing: p-6, m-6 for cards and sections
- Large spacing: p-8, m-8 for major layout divisions

### Component Library

**Navigation:**
- Sidebar navigation with collapsible sections
- Top header with user progress summary
- Breadcrumb navigation for deep sections

**Challenge Cards:**
- Elevated cards with subtle shadows
- Progress bars with animated fills
- Challenge type badges with color coding
- Time remaining indicators

**Forms:**
- Multi-step challenge creation wizard
- Subject/topic selection with visual chips
- Duration sliders with real-time preview
- Save/continue buttons with loading states

**Data Displays:**
- Progress dashboards with circular progress indicators
- Daily task lists with checkboxes
- Calendar views for challenge scheduling
- Statistics cards with key metrics

**Interactive Elements:**
- Modal overlays for challenge details
- Expandable sections for topic breakdown
- Drag-and-drop for task reordering
- Tooltip guidance for complex features

### Visual Treatments
**Gradients:**
- Hero section: Subtle blue gradient (220 85% 25% to 210 70% 35%)
- Success states: Green to blue gradient for completed challenges
- Background accents: Very subtle gray gradients for depth

**Animations:**
- Micro-interactions: Button hover states, checkbox animations
- Progress animations: Smooth bar fills and counter increments
- Page transitions: Slide transitions between challenge views
- Loading states: Skeleton screens and progress indicators

### Layout Structure
**Dashboard Layout:**
- Left sidebar (280px) with navigation
- Main content area with responsive grid
- Right panel for quick stats (on larger screens)

**Challenge Creation:**
- Centered modal workflow (max-width 600px)
- Step-by-step progression with visual indicators
- Preview pane showing generated schedule

**Challenge View:**
- Full-width header with challenge info
- Two-column layout: tasks list and progress tracking
- Floating action button for quick task completion

### Content Strategy
- Clear visual hierarchy with subject color coding
- Consistent iconography using Heroicons
- Motivational messaging for streak tracking
- Achievement badges for milestone completion
- Visual progress indicators throughout the app

This design creates a focused, academic environment that motivates JEE aspirants while maintaining the functionality needed for serious study planning and progress tracking.