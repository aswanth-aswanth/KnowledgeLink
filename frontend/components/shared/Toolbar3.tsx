'use client';

import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MicIcon from '@mui/icons-material/Mic';
import ImageIcon from '@mui/icons-material/Image';
import CreateIcon from '@mui/icons-material/Create';

interface ToolbarProps {
  onToggle: () => void;
}

const CustomToolbar: React.FC<ToolbarProps> = () => {
  const [alignment, setAlignment] = React.useState<string | null>('left');

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null,
  ) => {
    setAlignment(newAlignment);
  };

  return (
    <AppBar position="static" color="transparent">
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Box>
          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleAlignment}
            aria-label="text alignment"
          >
            <ToggleButton value="left" aria-label="left aligned">
              <Typography>Toggle</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
          <IconButton color="inherit">
            <MicIcon />
          </IconButton>
          <IconButton color="inherit">
            <ImageIcon />
          </IconButton>
          <IconButton color="inherit">
            <CreateIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CustomToolbar;
