import React from 'react';
import { Typography, Box } from '@mui/material';

function PrivacyPolicy() {
    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>Privacy Policy</Typography>
            <Typography paragraph>
                We value your privacy and are committed to protecting your personal data. This privacy policy explains 
                how we collect, use, and protect your information. By using our app, you consent to the collection and 
                use of your information as described here.
            </Typography>
            <Typography variant="h6" gutterBottom>Information Collection</Typography>
            <Typography paragraph>
                We collect basic information, such as your name and email address, to provide and improve our service. 
                We do not share your personal data with third parties.
            </Typography>
            <Typography variant="h6" gutterBottom>Use of Information</Typography>
            <Typography paragraph>
                Your data is used solely to deliver our services, manage your account, and send notifications about 
                important updates.
            </Typography>
            <Typography variant="h6" gutterBottom>Data Security</Typography>
            <Typography paragraph>
                We implement appropriate security measures to protect your information from unauthorized access.
            </Typography>
        </Box>
    );
}

export default PrivacyPolicy;
