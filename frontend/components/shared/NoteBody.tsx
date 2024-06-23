'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

const NoteBody: React.FC = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [text, setText] = useState<string>('');

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <IconButton onClick={handleToggle}>
        {isToggled ? <ToggleOnIcon /> : <ToggleOffIcon />}
      </IconButton>
      {isToggled ? (
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {text}
        </Typography>
      ) : (
        <TextField
          fullWidth
          multiline
          variant="outlined"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      )}
    </Box>
  );
};

export default NoteBody;
