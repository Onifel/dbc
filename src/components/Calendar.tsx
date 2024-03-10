import React, { useState } from 'react';
import { DateCalendar} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

interface CalendarProps {
    onShowAddButton: (show: boolean) => void;
    onSelectedDate: (date: Date) => void;
    hasEvent: boolean;
}
  

const Calendar: React.FC<CalendarProps>  = ({ onShowAddButton, onSelectedDate, hasEvent}) => {
    const [selectedDate, setSelectedDate] = useState<Date| null>(null);


    const handleDaySelect = (date:any) => {
        setSelectedDate(date);
        onShowAddButton(true);
        onSelectedDate(date);
        hasEvent
    }

   
    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
                value={selectedDate}
                onChange={handleDaySelect}
                sx={{
                    width:'350px',
                    height:'auto',
                    bgcolor:'rgb(232, 232, 228)',
                    border: "1px solid rgb(255,134,116)",
                    borderRadius: "20px",
                    marginLeft: '20px',
                    marginRight: '20px',
                    "& .MuiPickersCalendarHeader-root": {
                        color: "rgb(114,114,112)",
                    },
                    "& .MuiTypography-root": {
                        color: "rgb(255,134,116)",
                    },
                    "& .MuiPickersDay-root": {
                        color: "rgb(114,114,112)",
                    },
                    "& .MuiButtonBase-root.MuiPickersDay-root.Mui-selected": {
                        backgroundColor: hasEvent ? "rgb(232, 232, 228)" : "#FF8674",
                        color: hasEvent ? "rgb(114,114,112)" : "#fff",
                        border: hasEvent ? "1px solid #FF8674" : "none"
                    },
                    '@media (max-width:430px)': {
                        width:'415px'
                    },
                    '@media (max-width:412px)': {
                        width:'397px'
                    },
                    '@media (max-width:390px)': {
                        width:'375px'
                    },
                    '@media (max-width:360px)': {
                        width:'345px'
                    },
                    '@media (max-width:320px)': {
                        width:'305px'
                    },
                }} 
            />
            </LocalizationProvider>
        </div>
    );
};

export default Calendar;
