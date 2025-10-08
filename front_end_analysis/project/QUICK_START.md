# Quick Start Guide

## Getting Started

1. **Start the development server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

2. **Ensure your FastAPI backend is running** at `http://localhost:8000`

## Key Features

### Navigation
- **Dashboard Principal** (`/`): Overview with key metrics and demographic charts
- **Análisis de Gráficas** (`/charts`): All 9 detailed analysis charts

### Interactive Elements

1. **Dark Mode Toggle**: Click the sun/moon icon in the navbar
2. **Refresh Data**: Click the refresh icon (auto-refreshes every 5 minutes)
3. **Download Report**: Click the download icon to export data as JSON
4. **Filters**: Use the sidebar to filter by province, gender, or age range
5. **Chart Info**: Click the info icon on any chart to learn more about it

### Charts Included

1. **Horizontal Bar**: Average score by province
2. **Grouped Bar**: Score by gender and age range
3. **Stacked Bar**: Digital competence by company type
4. **Grouped Bar**: Technology usage (Yes/No)
5. **Stacked Bar**: Innovation participation by CIIU and gender
6. **Multi-bar**: Digital competencies by CIIU
7. **Heatmap**: Correlations between digital skills
8. **Box Plot**: Age distribution by digital fundamentals knowledge
9. **Radar**: Skill deficiencies by age group

## API Configuration

If your backend is hosted elsewhere, update the API base URL in `src/utils/api.ts`:

```typescript
const API_BASE_URL = 'http://your-backend-url.com';
```

## Build for Production

```bash
npm run build
npm run preview
```

The built files will be in the `dist/` directory.

## Troubleshooting

### Backend Connection Issues
- Ensure FastAPI backend is running at `http://localhost:8000`
- Check that all required endpoints are available
- Verify CORS is configured correctly on the backend

### Charts Not Loading
- Check browser console for API errors
- Verify data format matches expected structure
- Ensure Chart.js is properly registered

### Dark Mode Not Working
- Clear localStorage and refresh
- Check if `dark` class is being applied to `<html>` element

## Next Steps

1. Customize the color scheme in `src/utils/chartConfig.ts`
2. Add more filters in the sidebar
3. Implement user authentication if needed
4. Deploy to Vercel or your preferred platform

For detailed documentation, see README.md
