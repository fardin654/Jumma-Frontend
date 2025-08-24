import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  IconButton,
  Divider
} from '@mui/material';
import { 
  Favorite, 
  Code, 
  Email, 
  GitHub, 
  LinkedIn 
} from '@mui/icons-material';

function Footer({ trip }) {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box 
      component="footer"
      sx={{
        py: 4,
        mt: 4,
        borderTop: 1,
        borderColor: 'grey.100'
      }}
    >
      <Container maxWidth="lg">
        {/* Main footer content */}
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          {/* Made with love */}
          <Box 
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.875rem',
              color: 'text.secondary'
            }}
          >

            <Typography variant="body2" component="span">
              Made by Md Fardin
            </Typography>
          </Box>
          
          {/* Copyright */}
          <Typography 
            variant="caption" 
            sx={{ color: 'text.disabled' }}
          >
            © {currentYear} Jumma Expense. All rights reserved.
          </Typography>
          
          {/* Social links */}
          <Box 
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mt: 1
            }}
          >
            <IconButton
              href="mailto:fardinmd654@gmail.com"
              aria-label="Email"
              sx={{ 
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              <Email fontSize="small" />
            </IconButton>
            <IconButton
              href="https://github.com/fardin654/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              sx={{ 
                color: 'text.secondary',
                '&:hover': { color: 'text.primary' }
              }}
            >
              <GitHub fontSize="small" />
            </IconButton>
            <IconButton
              href="https://linkedin.com/in/muhammad-fardin/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              sx={{ 
                color: 'text.secondary',
                '&:hover': { color: 'primary.dark' }
              }}
            >
              <LinkedIn fontSize="small" />
            </IconButton>
          </Box>
          
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;