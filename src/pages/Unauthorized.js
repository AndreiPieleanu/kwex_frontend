import React from 'react';
import { Container, Card, CardContent, Typography } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';

const Unauthorized = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="shadow-lg p-4" style={{ maxWidth: '500px' }}>
        <CardContent className="text-center">
          <Typography variant="h4" color="error" gutterBottom>
            Unauthorized Access
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            You do not have permission to view this page.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Unauthorized;
