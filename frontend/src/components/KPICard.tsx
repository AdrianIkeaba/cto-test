import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  progress?: number;
}

export function KPICard({
  title,
  value,
  unit = '',
  icon,
  color = 'primary',
  trend,
  progress,
}: KPICardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease-in-out',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom sx={{ fontSize: '0.875rem' }}>
              {title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                {value}
              </Typography>
              {unit && (
                <Typography variant="body2" color="textSecondary">
                  {unit}
                </Typography>
              )}
            </Box>
          </Box>
          {icon && (
            <Box
              sx={{
                p: 1,
                borderRadius: 1,
                backgroundColor: `${color}.light`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: `${color}.main`,
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        {trend && (
          <Typography
            variant="caption"
            sx={{
              color: trend.isPositive ? 'success.main' : 'error.main',
              mt: 1,
              display: 'block',
            }}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </Typography>
        )}

        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                backgroundColor: `${color}.light`,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: `${color}.main`,
                },
              }}
            />
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              {progress}% utilization
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default KPICard;
