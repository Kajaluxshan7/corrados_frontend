import { Card, Skeleton, Box, Grid } from "@mui/material";
import { radius } from "../theme";

interface CardSkeletonProps {
  /** Height of the image area. */
  imageHeight?: number;
  /** Number of body text lines. */
  lines?: number;
}

/**
 * Content-shaped loading placeholder that matches the geometry of the site's
 * content cards (image header + title + body lines). Replaces the bare
 * `CircularProgress` spinners so grids fade in gracefully instead of popping.
 *
 * Phase 1 primitive — see UIUX_PREMIUM_PLAN.md §4.1.
 */
export default function CardSkeleton({ imageHeight = 200, lines = 3 }: CardSkeletonProps) {
  return (
    <Card sx={{ height: "100%", overflow: "hidden", borderRadius: `${radius.md}px` }}>
      <Skeleton variant="rectangular" height={imageHeight} animation="wave" />
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width="40%" height={24} animation="wave" sx={{ mb: 1.5 }} />
        <Skeleton variant="text" width="80%" height={28} animation="wave" sx={{ mb: 1 }} />
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            width={i === lines - 1 ? "60%" : "100%"}
            animation="wave"
          />
        ))}
      </Box>
    </Card>
  );
}

interface CardGridSkeletonProps {
  count?: number;
  columns?: { xs?: number; sm?: number; md?: number };
  imageHeight?: number;
}

/** Renders a responsive grid of CardSkeletons matching the page's card grid. */
export function CardGridSkeleton({
  count = 6,
  columns = { xs: 12, sm: 6, md: 4 },
  imageHeight = 200,
}: CardGridSkeletonProps) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid key={i} size={columns}>
          <CardSkeleton imageHeight={imageHeight} />
        </Grid>
      ))}
    </Grid>
  );
}
