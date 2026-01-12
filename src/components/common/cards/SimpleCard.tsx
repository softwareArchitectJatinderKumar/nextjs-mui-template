import { Card, CardContent, Typography } from '@mui/material';

export default function SimpleCard({ title='', content='' }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography>{content}</Typography>
      </CardContent>
    </Card>
  );
}
