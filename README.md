# Workout Tracker PWA

A clean, modern workout tracking app with pre-built programs.

## Features

- 📋 Pre-built workout programs (no configuration needed)
- ⏱️ Built-in rest timer (30s, 60s, 90s)
- 💾 Auto-save progress to localStorage
- 📱 PWA - works offline and can be installed
- 🎨 Dark modern UI

## Programs Included

### 5/3/1 Boring But Big
- 4 days (OHP, Deadlift, Bench, Squat)
- Main lifts + BBB volume + accessories

### Science-Based Training
- 8 specialized workouts
- Back, Chest, Legs, Triceps, Shoulders
- Evidence-based exercise selection

### Powerlifting (Week 1-4)
- 4 days/week full body
- Progressive overload focus

### Bodyweight (Week 1-4)
- 4 days/week calisthenics
- No equipment needed

## How to Use

1. Select a workout from the dropdown
2. Log your sets (reps + weight)
3. Use the rest timer between sets
4. Save your progress

## Deployment

Deploy to GitHub Pages or Vercel:

```bash
# GitHub Pages
git add .
git commit -m "Add workout tracker"
git push

# Vercel
vercel --prod
```

## File Structure

- `index.html` - Main app
- `sw.js` - Service worker for offline support
- `manifest.webmanifest` - PWA manifest
- `icon-192.png` / `icon-512.png` - App icons
