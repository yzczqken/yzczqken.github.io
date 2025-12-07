# 華富邨 (Wah Fu Estate) Website

A comprehensive, interactive website showcasing the history, stories, spots, and future of Wah Fu Estate (華富邨), a historic public housing estate in Hong Kong.

## Structure

The website consists of **one landing page and four subpages**:

- **index.html** (Home/Landing Page): Hero section, quick overview, discover slider, and featured stories
- **history.html** (History Subpage): Interactive timeline from 1920s to 1980s with historical content
- **spot.html** (Spot Subpage): Interactive map using Leaflet.js, things to do, and practical information
- **story.html** (Story Subpage): Four detailed stories about key places and people in the estate
- **future.html** (Future Subpage): Before/after slider, features, timeline, and redevelopment plans

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Custom styling matching Figma design exactly
- **JavaScript (ES6+)**: Interactivity and animations
- **Leaflet.js**: Interactive map (JavaScript equivalent of Folium for web)

## Note on Map Library

The project uses **Leaflet.js** instead of Folium because:
- Folium is a Python library that generates static HTML maps
- For an interactive web application, Leaflet.js provides real-time interactivity
- Leaflet.js offers the same functionality as Folium but in JavaScript

## Getting Started

1. Open `index.html` in a modern web browser
2. No build process or server required - works as a static site
3. For best experience, use a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx serve
   ```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Features Implemented

### Animations
- Fade-in animations on scroll
- Parallax effects on hero sections
- Smooth transitions and hover effects
- Counter animations for statistics

### Interactivity
- Smooth scrolling navigation
- Interactive map with markers
- Before/after slider with drag functionality
- Timeline navigation
- Image slider with auto-play
- Active section highlighting

### Responsive Design
- Mobile-friendly layout
- Adaptive grid systems
- Touch-friendly interactions

## File Structure

```
web/
├── index.html          # Landing/Home page
├── history.html        # History subpage
├── spot.html           # Spot subpage (with interactive map)
├── story.html          # Story subpage
├── future.html         # Future subpage
├── styles.css          # Shared CSS styling
├── script.js           # Shared JavaScript for interactivity
├── assets/             # Images and SVG files
└── README.md           # This file
```

## Design Credits

Design based on Figma files:
- Homepage (node-id: 12-1882)
- History (node-id: 555-854)
- Spot (node-id: 579-762)
- Story (node-id: 615-306)
- Future (node-id: 622-1220)

## License

© 2025, WahFuEstate

