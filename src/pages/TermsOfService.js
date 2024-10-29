import React from 'react';
import { Typography, Box } from '@mui/material';

function TermsOfService() {
    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>Terms of Service</Typography>
            <Typography paragraph>
                Welcome to our app. By using this app, you agree to comply with and be bound by the following terms of 
                service. Please read them carefully.
            </Typography>
            <Typography variant="h6" gutterBottom>Acceptance of Terms</Typography>
            <Typography paragraph>
                By registering an account or using this app, you agree to abide by these terms. If you do not agree, 
                please discontinue use of our services.
            </Typography>
            <Typography variant="h6" gutterBottom>User Conduct</Typography>
            <Typography paragraph>
                You agree to use the app responsibly and not misuse the services provided. Any misuse may result in 
                suspension or termination of your account.
            </Typography>
            <Typography variant="h6" gutterBottom>Changes to Terms</Typography>
            <Typography paragraph>
                We reserve the right to modify these terms at any time. Updates will be posted, and your continued use 
                of the app constitutes acceptance of the changes.
            </Typography>
        </Box>
    );
}

export default TermsOfService;
