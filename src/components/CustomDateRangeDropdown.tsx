import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import "./Dashboard.css";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';

interface Props {
  setDateRange: (range: string) => void;
}

export default function CustomDateRangeDropdown({ setDateRange }: Props) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const id = open ? 'date-range-popover' : undefined;

  const formatDate = (date: Date | null) =>
    date ? format(date, 'MM/dd/yy') : '';

  const handleOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const applyRange = () => {
    if (startDate && endDate) {
      const newRange = `${formatDate(startDate)}-${formatDate(endDate)}`;
      setDateRange(newRange);
      handleClose();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ margin: '1%' }}>
         <Box sx={{display: 'flex', gap: '6px'}}>
        <label style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '8px', display: 'block' }}>
          Date range:
        </label>
       
        <Box
          onClick={handleOpen}
          sx={{
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '4px',
            width: '150px',
            height: '15px',
            cursor: 'pointer',
            backgroundColor: '#fff',
            userSelect: 'none',
            fontSize: '10px'
          }}
        >
          {startDate && endDate
            ? `${formatDate(startDate)} - ${formatDate(endDate)}`
            : 'Select custom date range'}
        </Box>
         <Button
       
              className="outlined-button"
              onClick={applyRange}
                 style={{fontSize: '8px', margin: '1px',marginBottom: '2.5%',
   
   textTransform: 'none',
    backgroundColor: 'orange',
    padding: '2px 11px',
    borderRadius: '50px',
    border: 'none',
    cursor: 'pointer',
    color: 'black',
fontWeight: 'bold'}}
              disabled={!startDate || !endDate}
            >
              Generate
            </Button>
            </Box>

      <Popover
  open={open}
  anchorEl={anchorEl}
  onClose={handleClose}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
>
  <Box
    sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      maxWidth: '100%',   // avoid overflow
    }}
  >
    <Box sx={{ display: 'flex', gap: 1 }}>
    <DatePicker
  label="Start date"
  value={startDate}
  onChange={(newValue) => setStartDate(newValue)}
  slotProps={{
    textField: {
      size: 'small',
      sx: {
        width: '150px', 
        '& .MuiInputBase-root': {
          fontSize: '0.75rem',
          padding: '0px 6px',
          height: 32,
        },
        '& .MuiInputBase-input': {
          fontSize: '0.75rem',
          padding: '4px 6px',
        },
        '& .MuiInputLabel-root': {
          fontSize: '0.75rem',
        },
      },
    },
  }}
/>
<DatePicker
  label="End date"
  value={endDate}
  onChange={(newValue) => setEndDate(newValue)}
  slotProps={{
    textField: {
      size: 'small',
      sx: {
        width: '150px', 
        '& .MuiInputBase-root': {
          fontSize: '0.75rem',
          padding: '0px 6px',
          height: 32,
        },
        '& .MuiInputBase-input': {
          fontSize: '0.75rem',
          padding: '4px 6px',
        },
        '& .MuiInputLabel-root': {
          fontSize: '0.75rem',
        },
      },
    },
  }}
/>

    </Box>
  </Box>
</Popover>

    
      </Box>
    </LocalizationProvider>
  );
}
