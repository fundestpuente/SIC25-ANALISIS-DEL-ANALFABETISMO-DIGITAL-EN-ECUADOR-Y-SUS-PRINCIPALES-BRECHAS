# Digital Illiteracy Insights 2025

A comprehensive full-stack React dashboard application for analyzing digital illiteracy data in Ecuador. This application provides interactive visualizations, real-time data updates, and powerful filtering capabilities to understand digital competencies across different demographics and sectors.

## Features

- **Dashboard Principal**: Overview of key metrics including total respondents, average scores, top provinces, and demographic distributions
- **Análisis de Gráficas**: 9 interactive charts analyzing various aspects of digital literacy:
  - Average score by province
  - Score by gender and age range
  - Digital competence by company type
  - Technology usage patterns
  - Innovation participation by sector and gender
  - Digital competencies by sector
  - Correlation heatmap between digital skills
  - Age distribution by digital fundamentals
  - Radar chart of skill deficiencies by age group
- **Interactive Filters**: Dynamic filtering by province, gender, and age range
- **Real-time Updates**: Automatic data refresh every 5 minutes with manual refresh option
- **Dark Mode**: Toggle between light and dark themes
- **Download Reports**: Export dashboard data as JSON with timestamps
- **Performance Optimized**: Lazy loading and memoization for optimal performance

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Icons**: Lucide React

## Prerequisites

- Node.js 16 or higher
- npm or yarn
- FastAPI backend running at `http://localhost:8000`

## Backend Requirements

The application expects a FastAPI backend with the following endpoints:

- `GET /summary` - Summary statistics
- `GET /data` - Raw data
- `GET /analysis/provincia_puntuacion` - Province scores
- `GET /analysis/genero_puntuacion_edad` - Gender and age scores
- `GET /analysis/empresa_competencia` - Company competence data
- `GET /analysis/tecnologias_si_no` - Technology usage
- `GET /analysis/participacion_innovacion_ciiu_genero` - Innovation participation
- `GET /analysis/dashboard_competencia_digital_ciiu` - Competence by sector
- `GET /analysis/correlacion_data` - Correlation data
- `GET /analysis/edad_fundamentos_digitales` - Age distribution
- `GET /analysis/radar_deficiencias_edad` - Radar deficiencies
- `GET /filter/{column}/{value}` - Filtered data

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment

### Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Other Platforms

The built application is a static site that can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Azure Static Web Apps

Simply build the project and deploy the `dist` folder.

## Project Structure

```
src/
├── components/
│   ├── charts/
│   │   ├── HeatmapChart.tsx
│   │   └── BoxPlotChart.tsx
│   ├── ChartsAnalysis.tsx
│   ├── ChartCard.tsx
│   ├── Dashboard.tsx
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   └── StatsCard.tsx
├── context/
│   └── ThemeContext.tsx
├── types/
│   └── index.ts
├── utils/
│   ├── api.ts
│   └── chartConfig.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Configuration

Update the API base URL in `src/utils/api.ts` if your backend is hosted elsewhere:

```typescript
const API_BASE_URL = 'http://localhost:8000';
```

## Features in Detail

### Dark Mode
Click the sun/moon icon in the navbar to toggle between light and dark themes. The preference is saved to localStorage.

### Auto-Refresh
Data automatically refreshes every 5 minutes. You can also manually refresh by clicking the refresh icon in the navbar.

### Filters
Use the sidebar filters to analyze data by specific provinces, genders, or age ranges. Filters dynamically update all visualizations.

### Export Reports
Click the download icon in the navbar to export current data as a JSON file with a timestamp.

### Chart Interactions
- Hover over chart elements to see detailed tooltips
- Click the info icon on charts to learn more about each visualization
- Charts are fully responsive and adapt to screen size

## Performance Optimizations

- Lazy loading for complex chart components
- React.useMemo for expensive computations
- Optimized re-renders with proper dependency arrays
- Code splitting with React.lazy

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contact

For questions or support, please contact the development team.
