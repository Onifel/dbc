import React, { useState, forwardRef } from 'react';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useNavigate} from 'react-router-dom';
import { Button} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import Slide from '@mui/material/Slide';
import Calendar from '../../components/Calendar';
import dayjs, {Dayjs} from 'dayjs';
import utc from 'dayjs/plugin/utc';
import './home.css';
import { IonPage, IonFooter, IonHeader } from '@ionic/react';
import { signOut } from "firebase/auth";
import { auth, db } from '../../services/firebase';
import { getMessaging, getToken } from "firebase/messaging";


dayjs.extend(utc)

interface Event {
    id: number;
    date: string;
    title: string;
    customer: string;
    startTime: string;
    endTime: string;
    stylist: string;
}

const Transition = forwardRef<HTMLDivElement, any>(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Home = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [idEvent, setIdEvent] = useState(0);
    const [editId, setEditId] = useState<number>(0);
    const [title, setTitle] = useState('');
    const [customer, setCustomer] = useState('');
    const [stylist, setStylist] = useState('');
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [showAddButton, setShowAddButton] = useState<boolean>(false);
    const [displayEvents, setDisplayEvents] = useState<boolean>(false);
    const [selectedStartTime, setSelectedStartTime] = useState<dayjs.Dayjs | null>(null);
    const [selectedEndTime, setSelectedEndTime] = useState<dayjs.Dayjs | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [hasEvent, setHasEvent] = useState<boolean>(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTitle('');
        setCustomer('');
        setSelectedStartTime(null);
        setSelectedEndTime(null);
        setStylist('');
    };

    const handleDelete = (id:number) => {
        const updatedEvents = events.filter((e) => e.id !== id);
        setEvents([...updatedEvents]);
    }

    const handleEdit = (id:any) => {
        const eventToEdit:any = events.find((e) => e.id === id);
        setEditId(id);
        setOpen(true);
        setTitle(eventToEdit.title);
        setCustomer(eventToEdit.customer);
        setSelectedStartTime(eventToEdit.selectedStartTime);
        setSelectedEndTime(eventToEdit.selectedEndTime);
        setStylist(eventToEdit.stylist);
    }

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
       setTitle(newValue);
       
    };

    const handleChange1 = (e:React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
       setCustomer(newValue);
       
    };

    const handleChange2 = (e:React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
       setStylist(newValue);
       
    };

    const handleShowAddButton = (value:any) => {
        setShowAddButton(value);
    };

    const checkForEvents = (date:any) => {
        return events.some(event => event.date === date.format('DD-MM-YYYY'));

    };
    
    const handleSelectedDate = (date:any) => {
        setSelectedDate(date);
        setHasEvent(checkForEvents(date));
    };

    const handleSubmit = async (e:any) => {
        e.preventDefault();

        if(editId) {
            const updatedEvents:any = events.map((event)=> event.id === editId
            ? {
                ...event, 
                title:title, 
                customer:customer, 
                startTime:selectedStartTime!.format('HH:mm'), 
                endTime:selectedEndTime!.format('HH:mm'), 
                stylist:stylist
                }
            : event
            );
            setEvents([...updatedEvents]);
            setEditId(0);
            setOpen(false);
            setTitle('');
            setCustomer('');
            setSelectedStartTime(null);
            setSelectedEndTime(null);
            setStylist('');
            return;
        }else {
            
            const newEvent: Event = {
                id: idEvent + 1,
                date: selectedDate!.format('DD-MM-YYYY'),
                title: title,
                customer: customer,
                startTime: selectedStartTime!.format('HH:mm'),
                endTime: selectedEndTime!.format('HH:mm'), 
                stylist: stylist
            };
            setEvents(prevEvents => [...prevEvents, newEvent]);
            setIdEvent(prevIdEvent => prevIdEvent + 1);
            console.log(newEvent);
            
        } 

        const notificationPayload = {
            notification: {
              title: 'Hey DreamBox team!',
              date: `${selectedDate}`,
              body: `Event: ${title}, 
                    Start Time: ${selectedStartTime}, 
                    End Time: ${selectedEndTime}, 
                    Customer: ${customer}, 
                    Stylist: ${stylist}`
            },
            data: {
              eventId: title,
              eventDetails: {
                date: selectedDate,
                title: title,
                customer: customer,
                startTime: selectedStartTime,
                endTime: selectedEndTime,
                stylist: stylist
              }
            }
          };
        
        try {
            const deviceTokens = await getDeviceTokensForTargetDevices();
    
            if (deviceTokens.length > 0) {
                await Promise.all(deviceTokens.map(async (token:any) => {
                    await sendNotificationToDevice(token, notificationPayload);
                }));
                
                console.log("Notifications sent successfully");
                setDisplayEvents(true);
            } else {
                console.log("No device tokens available to send notifications");
            }
        } catch (error) {
            console.error("Error sending notifications:", error);
        }
    }

    const getDeviceTokensForTargetDevices = async () => {
        try {
            const querySnapshot = await db.collection!('deviceTokens').get(); 
            const tokens = querySnapshot.docs.map((doc:any) => doc.data().token); 
            console.log("Device tokens retrieved successfully:", tokens);
            return tokens; 
        } catch (error) {
            console.error("Error retrieving device tokens:", error);
            return [];
        }
    };
    
    const sendNotificationToDevice = async ( deviceToken:any, payload:any ) => {
            const messaging: any = getMessaging();

            try {
                const token = await getToken(messaging);
                console.log("Device token:", token);
                await messaging.sendToDevice(deviceToken, payload);
                console.log("Notification sent successfully to device:", deviceToken);
            } catch (error) {
                console.error("Error sending notification to device:", deviceToken, error);
            }
    };
    

    const history = useNavigate();

    const logout = async () => {
       await signOut(auth);
       localStorage.removeItem('token');
       localStorage.removeItem('user');
       history('/dbc/');
    }

    return(
        <IonPage>
            <section className='box_calendar'>
                <IonHeader className='header'>
                    <Button onClick={logout} ><LogoutRoundedIcon style={{ color: '#FF8674'}} /></Button>
                </IonHeader>
                <div className='cal'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div>
                           <Calendar
                                onShowAddButton={handleShowAddButton}
                                onSelectedDate={handleSelectedDate}
                                hasEvent={hasEvent}
                            />
                        </div>
                    </LocalizationProvider>
                </div>
                <IonFooter className='footer'>
                                       
                    <div className="events">
                        {
                            selectedDate && (
                                <div className='date'>{dayjs(selectedDate).utcOffset(+360).format('DD-MM-YYYY')}</div>
                            )
                        }
                        <div className='eventFlex'>
                            {
                                events.map((event:any) => {
                                    if (event.date === selectedDate!.format('DD-MM-YYYY')) {
                                        return(
                                            <div className="event" key={event.id}>
                                                <div className='event-title'>{event.title}</div>
                                                <div className='event-customer'>{event.customer}</div>
                                                <div className='event-time'>{event.startTime}</div>
                                                <div className='event-time'>{event.endTime}</div>
                                                <div className='event-stylist'>{event.stylist}</div>
                                                <div className='btns'>
                                                    
                                                        <DeleteRoundedIcon style={{color:'#fff', fontSize:'medium'}} onClick={()=>handleDelete(event.id)}/>
                                                    
                                                    &nbsp;
                                                    
                                                        <BorderColorRoundedIcon style={{color:'#fff', fontSize:'medium'}} onClick={()=>handleEdit(event.id)}/>
                                                </div>
                                                
                                            </div>
                                        );
                                    } else {
                                        return null;
                                    }
                                })
                            }
                        </div>
                    </div>
                        {
                            !showAddButton ? (<div></div>) : (
                                <div className='add-event'> 
                                    <Button sx={{
                                        backgroundColor: 'transparent',
                                        cursor: 'pointer',
                                        overrides:{
                                            MuiButton: {
                                                '&:focus':{
                                                    borderColor:'transparent'
                                                }
                                            }
                                        }
                                        }}  
                                        onClick={handleClickOpen}>
                                        <AddRoundedIcon style={{color:'rgba(114,114,112,0.5)', fontSize:'medium'}} />
                                    </Button>
                                </div>
                            )
                        }
                    
                            <div className="add-event-wrapper active">
                                <Dialog
                                    open={open}
                                    TransitionComponent={Transition}
                                    keepMounted
                                    PaperProps={{
                                        component: 'form',
                                        onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
                                            e.preventDefault();
                                            const formData = new FormData(e.currentTarget);
                                            const formJson = Object.fromEntries(formData.entries());
                                            const title = formJson.title;
                                            const customer = formJson.customer;
                                            const startTime= formJson.selectedStartTime;
                                            const endTime = formJson.selectedEndTime;
                                            const stylist = formJson.stylist;
                                            handleSubmit(e);
                                            handleClose();
                                        },
                                    }}
                                    sx={{
                                        borderRadius:'20px'
                                    }}
                                >
                                    <DialogTitle sx={{
                                        width: '100%',
                                        height: '50px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0 20px',
                                        color: 'rgb(114,114,112)',
                                        borderBottom: '1px solid #f5f5f5'
                                        }}
                                    >
                                        <div className="title">Event</div>
                                        <div className="close-event">
                                            <Button sx={{
                                                height: '25px',
                                                fontSize: '10px',
                                                cursor: 'pointer',
                                                backgroundColor: 'transparent',
                                                overrides:{
                                                    MuiButton: {
                                                        '&:focus':{
                                                            borderColor:'transparent'
                                                        }
                                                    }
                                                }
                                                }}  
                                                onClick={handleClose}
                                            >
                                                <CloseRoundedIcon style={{ fontSize:'medium', color:'rgb(114,114,112)'}} />
                                            </Button>
                                        </div>
                                    </DialogTitle>
                                    <DialogContent sx={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '5px',
                                            padding: '20px',
                                            position: 'relative',
                                            }}
                                    >
                                        <div className="add-event-input">
                                            <TextField
                                                    type="text" 
                                                    label="Title" 
                                                    value={title}
                                                    name="title" 
                                                    id="title" 
                                                    variant="outlined"
                                                    autoFocus
                                                    autoComplete='off'
                                                    sx={{
                                                        width: '100%',
                                                        height: '100%',
                                                        marginTop:'20px',
                                                        fontSize: '12px',
                                                        fontWeight: '500',
                                                        borderBottom: '1px solid rgba(255,134,116, 0.2)',
                                                        backgroundColor: '#fff',
                                                        color: 'rgba(114,114,112, 0.5)',
                                                        '& .MuiFormLabel-root':{
                                                            color: 'rgba(114,114,112, 0.5) !important',
                                                        },
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': {
                                                                borderColor: 'white !important',
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'white !important',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: 'white !important',
                                                            },
                                                        },
                                                        '& .MuiInputBase-root':{
                                                            color: 'rgba(114,114,112, 0.8) !important',
                                                        },
                                                    }}
                                                    onChange={handleChange}
                                            />
                                        </div>
                                        <div className="add-event-input">
                                            <TextField
                                                    type="text" 
                                                    label="Customer" 
                                                    value={customer}
                                                    name="customer" 
                                                    id="customer" 
                                                    variant="outlined"
                                                    autoFocus
                                                    autoComplete='off'
                                                    sx={{
                                                        width: '100%',
                                                        height: '100%',
                                                        marginTop:'20px',
                                                        fontSize: '12px',
                                                        fontWeight: '500',
                                                        borderBottom: '1px solid rgba(255,134,116, 0.2)',
                                                        backgroundColor: '#fff',
                                                        color: 'rgba(114,114,112, 0.5)',
                                                        '& .MuiFormLabel-root':{
                                                            color: 'rgba(114,114,112, 0.5) !important',
                                                        },
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': {
                                                                borderColor: 'white !important',
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'white !important',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: 'white !important',
                                                            },
                                                        },
                                                        '& .MuiInputBase-root':{
                                                            color: 'rgba(114,114,112, 0.8) !important',
                                                        },
                                                    }}
                                                    onChange={handleChange1}
                                            />
                                        </div>
                                        <div className="add-event-input" style={{ zIndex: 1000 }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <MobileTimePicker 
                                                        label="Start time"
                                                        value={selectedStartTime}
                                                        sx={{
                                                            width: '100%',
                                                            height: '100%',
                                                            marginTop:'20px',
                                                            borderBottom: '1px solid rgba(255,134,116, 0.2)',
                                                            padding: '0 10px',
                                                            fontSize: '12px',
                                                            fontWeight: '500',
                                                            backgroundColor: '#fff',
                                                            color: 'rgba(114,114,112, 0.5)',
                                                            '& .MuiFormLabel-root':{
                                                                color: 'rgba(114,114,112, 0.5) !important', 
                                                            },
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': {
                                                                    borderColor: 'white !important',
                                                                },
                                                                '&:hover fieldset': {
                                                                    borderColor: 'white !important',
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: 'white !important',
                                                                },
                                                            },
                                                            '& .MuiInputBase-root':{
                                                                color: 'rgba(114,114,112, 0.8) !important',
                                                            },
                                                        }}
                                                        slotProps={{
                                                            mobilePaper:{
                                                                sx:{
                                                                    "& .MuiPaper-root.MuiDialog-paper":{
                                                                        borderRadius:'25px',
                                                                    },
                                                                    "& .MuiPickersLayout-contentWrapper":{
                                                                        borderTop:'1px solid rgba(114,114,112, 0.4) !important',
                                                                        borderBottom:'1px solid rgba(114,114,112, 0.4) !important',
                                                                    },
                                                                    "& .MuiPickersToolbarText-root.Mui-selected ":{
                                                                        color: 'rgba(255,134,116, 0.8) !important',
                                                                    },
                                                                    "& .MuiClock-wrapper": {
                                                                        backgroundColor:'rgba(255,134,116, 0.8)'
                                                                    },
                                                                    "& .MuiClockNumber-root": {
                                                                        color:'rgba(114,114,112, 0.4)'
                                                                    },
                                                                    "& .MuiClockNumber-root.Mui-selected": {
                                                                        backgroundColor:'rgba(255,134,116, 0.8) !important',
                                                                        color:'#fff'
                                                                    },
                                                                    "& .MuiClock-pin": {
                                                                        backgroundColor:'rgba(255,134,116, 0.8)'
                                                                    },
                                                                    "& .MuiClockPointer-root": {
                                                                        backgroundColor:'rgba(255,134,116, 0.8)'
                                                                    },
                                                                    "& .MuiClockPointer-thumb": {
                                                                        border:'16px solid rgba(255,134,116, 0.8) !important',
                                                                    },
                                                                    "& .MuiDialogContent-root": {
                                                                        borderRadius:'25px'
                                                                    },
                                                                    "& .MuiButtonBase-root": {
                                                                        '&.MuiButton-root':{
                                                                            color: "rgba(255,134,116, 0.8)"
                                                                        },
            
                                                                    },
                                                                }
                                                            }
                                                        }}
                                                        onChange={(time) => setSelectedStartTime(time)}
                                                />
                                            </LocalizationProvider>
                                        </div>
                                        <div className="add-event-input">
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <MobileTimePicker 
                                                        label="End time"
                                                        value={selectedEndTime}
                                                        sx={{
                                                            width: '100%',
                                                            height: '100%',
                                                            marginTop:'20px',
                                                            borderBottom: '1px solid rgba(255,134,116, 0.2)',
                                                            padding: '0 10px',
                                                            fontSize: '12px',
                                                            fontWeight: '500',
                                                            backgroundColor: '#fff',
                                                            color: 'rgba(114,114,112, 0.5)',
                                                            '& .MuiFormLabel-root':{
                                                                color: 'rgba(114,114,112, 0.5) !important', 
                                                            },
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': {
                                                                    borderColor: 'white !important',
                                                                },
                                                                '&:hover fieldset': {
                                                                    borderColor: 'white !important',
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: 'white !important',
                                                                },
                                                            },
                                                            '& .MuiInputBase-root':{
                                                                color: 'rgba(114,114,112, 0.8) !important',
                                                            },
                                                        }}
                                                        slotProps={{
                                                            mobilePaper:{
                                                                sx:{
                                                                    "& .MuiPaper-root.MuiDialog-paper":{
                                                                        borderRadius:'25px',
                                                                    },
                                                                    "& .MuiPickersLayout-contentWrapper":{
                                                                        borderTop:'1px solid rgba(114,114,112, 0.4) !important',
                                                                        borderBottom:'1px solid rgba(114,114,112, 0.4) !important',
                                                                    },
                                                                    "& .MuiPickersToolbarText-root.Mui-selected ":{
                                                                        color: 'rgba(255,134,116, 0.8) !important',
                                                                    },
                                                                    "& .MuiClock-wrapper": {
                                                                        backgroundColor:'rgba(255,134,116, 0.8)'
                                                                    },
                                                                    "& .MuiClockNumber-root": {
                                                                        color:'rgba(114,114,112, 0.4)'
                                                                    },
                                                                    "& .MuiClockNumber-root.Mui-selected": {
                                                                        backgroundColor:'rgba(255,134,116, 0.8) !important',
                                                                        color:'#fff'
                                                                    },
                                                                    "& .MuiClock-pin": {
                                                                        backgroundColor:'rgba(255,134,116, 0.8)'
                                                                    },
                                                                    "& .MuiClockPointer-root": {
                                                                        backgroundColor:'rgba(255,134,116, 0.8)'
                                                                    },
                                                                    "& .MuiClockPointer-thumb": {
                                                                        border:'16px solid rgba(255,134,116, 0.8) !important',
                                                                    },
                                                                    "& .MuiDialogContent-root": {
                                                                        borderRadius:'25px'
                                                                    },
                                                                    "& .MuiButtonBase-root": {
                                                                        '&.MuiButton-root':{
                                                                            color: "rgba(255,134,116, 0.8)"
                                                                        },
            
                                                                    },
                                                                }
                                                            }
                                                        }}
                                                        onChange={(time) => setSelectedEndTime(time)}
                                                />
                                            </LocalizationProvider>
                                        </div>
                                        <div className="add-event-input">
                                            <TextField
                                                    type="text" 
                                                    label="Stylist" 
                                                    value={stylist}
                                                    name="stylist" 
                                                    id="stylist" 
                                                    variant="outlined"
                                                    autoFocus
                                                    autoComplete='off'
                                                    sx={{
                                                        width: '100%',
                                                        height: '100%',
                                                        marginTop:'20px',
                                                        fontSize: '12px',
                                                        fontWeight: '500',
                                                        borderBottom: '1px solid rgba(255,134,116, 0.2)',
                                                        backgroundColor: '#fff',
                                                        color: 'rgba(114,114,112, 0.5)',
                                                        '& .MuiFormLabel-root':{
                                                            color: 'rgba(114,114,112, 0.5) !important',
                                                        },
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': {
                                                                borderColor: 'white !important',
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'white !important',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: 'white !important',
                                                            },
                                                        },
                                                        '& .MuiInputBase-root':{
                                                            color: 'rgba(114,114,112, 0.8) !important',
                                                        },
                                                    }}
                                                    onChange={handleChange2}
                                            />
                                        </div>
                                    </DialogContent>
                                    <DialogActions sx={{
                                            paddingBottom: '15px'
                                        }}
                                    >
                                        <Button 
                                                sx={{
                                                    height: '30px',
                                                    outline: 'none',
                                                    border: 'none',
                                                    backgroundColor: 'rgba(255,134,116, 0.8)',
                                                    borderRadius: '20px',
                                                    cursor: 'pointer',
                                                    color:'#fff',
                                                    fontSize:'10px',
                                                    '&:hover':{
                                                        color: 'rgb(255,134,116)',
                                                        backgroundColor: 'transparent',
                                                        border: '1px solid rgb(255,134,116)'
                                                    },
                                                    overrides:{
                                                        MuiButton: {
                                                            '&:focus':{
                                                                borderColor:'transparent'
                                                            }
                                                        }
                                                    }
                                                }}
                                                type='submit'
                                        >
                                            {editId ? "Edit" : "Add"}
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                </IonFooter>
            </section>
        </IonPage>
    )            
}

export default Home;