import { useState } from 'react';
import './style.css';
import { Button, TextField, FormControl, InputLabel, InputAdornment, Box } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import { Link } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Toaster, toast } from 'react-hot-toast';
import styled from 'styled-components';
import { IonPage } from '@ionic/react';

import { RegisterApi } from '../../services/Api.jsx';

const StyledFormControl= styled(FormControl)({
    "& .MuiInputLabel-root": {
      right: 0,
      textAlign: "center",
      color:'white',
      
    },
    "& .MuiInputLabel-shrink": {
      marginLeft: "50px",
      position: "absolute",
      right: "0",
      left: "0",
      top: "8px",
      width: "200px", 
      background: "whitesmoke",
      borderRadius: "20px",
      color:"#FF8674" 
    },
    "& .MuiInputBase-root.MuiOutlinedInput-root": {
        borderRadius:"25px",
        height:"38px",
        color:'white',
    }
  });

const Register = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showPassword1, setShowPassword1] = useState(false)
    const [formFields, setFormFields] = useState({
        username:'',
        password:'',
        confirmPassword:''
    })
    const [showLoader, setShowLoader] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false) 
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)
    const [inputFocused, setInputFocused] = useState(false);
    const [inputFocused1, setInputFocused1] = useState(false);
    const [inputFocused2, setInputFocused2] = useState(false);


    const handleChange = (e:any) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormFields(()=>({
            ...formFields,
            [name]: value,
        }))
    }

    const handleInputFocus = () => {
        setInputFocused(true);
    };
    const handleInputBlur = () => {
        setInputFocused(false);
    };

    const handleInputFocus1 = () => {
        setInputFocused1(true);
    };
    const handleInputBlur1 = () => {
        setInputFocused1(false);
    };

    const handleInputFocus2 = () => {
        setInputFocused2(true);
    };
    const handleInputBlur2 = () => {
        setInputFocused2(false);
    };

    const signUp = (e:any) => {
        e.preventDefault();
        setShowLoader(true)

        let hasError = false;

        if(formFields.username == ''){
            setEmailError(true);
            hasError = true;
        }
        if(formFields.password == ''){
            setPasswordError(true);
            hasError = true;
        }
        if(formFields.confirmPassword == ''){
            setConfirmPasswordError(true);
            hasError = true;
        }
        if (hasError) {
            setShowLoader(false)
        }else{
            const email = `${formFields.username}@example.com`;
            RegisterApi({...formFields, email})
            .then((response:any) => {
                console.log(response);
                const user = response.data.idToken;
                toast.success('Success!')
                setShowLoader(false)
                setFormFields({
                    username:'',
                    password:'',
                    confirmPassword:''
                })
                localStorage.setItem('token', user.accessToken);
                localStorage.setItem('user', JSON.stringify(user));
            }).catch((err:any)=>{
               if (err.response.data.error.message=='EMAIL_EXISTS') {
                    toast.error('This email has been already registered!')
                    setShowLoader(false)
                    setFormFields({
                        username:'',
                        password:'',
                        confirmPassword:''
                    })
               }
               if (String(err.response.data.error.message).includes('WEAK_PASSWORD')) {
                    toast.error('Password should be at least 6 characters!')
                    setShowLoader(false)
               }
            }).finally(()=>{
                setPasswordError(false);
            })
        }
    };

    return (
        <IonPage>
            <section className='signUp'>
                <div className='loginWrapper'>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={showLoader}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    <div className='logo'></div>
                    <Box>
                        <div className='box_signUp' >
                            <Toaster
                                position="top-center"
                                reverseOrder={false}
                            />
                            <StyledFormControl fullWidth variant="outlined" sx={{ borderRadius: 20, marginLeft:'55px', position:"relative" }}>
                                <InputLabel shrink={inputFocused || formFields.username !== ''}
                                    sx={{
                                        color:'white',
                                        lineHeight:'32px',
                                        marginRight:'70px'
                                    }}
                                >
                                    Username
                                </InputLabel>
                                <TextField
                                    name='username'
                                    type="text"
                                    variant='outlined'
                                    autoComplete='off'
                                    InputProps={{
                                        inputProps: {
                                            style: { textAlign: 'center'},
                                        },
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <div style={{width:'43px', height:'43px', marginTop:'7px',marginLeft:'-14px', borderRadius:'50px', backgroundColor:'whitesmoke', display:'flex', justifyContent:'center', alignItems:'center'}}>
                                                    <PersonRoundedIcon style={{ color: '#FF8674' }} />  
                                                </div>    
                                            </InputAdornment>
                                        )
                                    }}            
                                    sx={{ marginTop: 1,marginBottom: 2, outline: 'none', borderRadius: 20, width:'26ch', height:'4.5ch', color: 'white', backgroundColor:'rgba(255, 255, 255, 0.3)', '&:before':{
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background: 'inherit',
                                        filter: 'blur(5px)',
                                        zIndex: -1,
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            border: '1px solid whitesmoke'
                                            
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                border: '1px solid whitesmoke !important',
                                                textAlign:'center',
                                                height:'5.5ch'
                                            },
                                            '&:hover fieldset': {
                                                border: '1px solid whitesmoke !important',
                                                textAlign:'center'
                                            },
                                            '& input': {
                                                paddingTop:'35px',
                                                paddingRight:'40px' 
                                            },
                                            '&.Mui-focused fieldset': {
                                                border: '2px solid whitesmoke !important',
                                                textAlign:'center',
                                            },
                                            '&.Mui-focused input':{
                                                paddingTop:'35px',
                                                paddingRight:'40px'
                                            }
                                        },
                                    }}
                                    onChange={handleChange}
                                    onFocus={handleInputFocus}
                                    onBlur={handleInputBlur}
                                    value={formFields.username}
                                />
                                </StyledFormControl>
                                {emailError ? (<span className='text-danger'>Please enter the username!</span>) : null}
                        
                                <StyledFormControl fullWidth variant="outlined" sx={{ borderRadius: 20, marginLeft:'55px', position:"relative" }}>
                                    <InputLabel shrink={inputFocused1 || formFields.password !== ''} htmlFor="password"
                                        sx={{
                                            color:'white',
                                            lineHeight:'32px',
                                            marginRight:'70px'
                                        }}
                                    >
                                        Password
                                    </InputLabel>
                                    <TextField
                                        name='password'
                                        type={showPassword === false ? "password" : "text"}
                                        variant='outlined'
                                        autoComplete='off'
                                        InputProps={{
                                            inputProps: {
                                                style: { textAlign: 'center'},
                                            },
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{cursor:'pointer'}}>
                                                    <div onClick={()=>setShowPassword(!showPassword)} style={{width:'43px', height:'43px', marginTop:'7px',marginLeft:'-14px', borderRadius:'50px', backgroundColor:'whitesmoke', display:'flex', justifyContent:'center', alignItems:'center'}}>
                                                        {showPassword === false ? <VisibilityOffIcon style={{ color: '#FF8674' }} /> : <VisibilityIcon style={{ color: '#FF8674' }} />}
                                                    </div>
                                                    
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{ marginTop: 1,marginBottom: 2, borderRadius: 20, width:'26ch', height:'4.5ch', color: 'white', backgroundColor:'rgba(255, 255, 255, 0.3)', '&:before':{
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'inherit',
                                            filter: 'blur(5px)',
                                            zIndex: -1,
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                border: '1px solid whitesmoke', 
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: '1px solid whitesmoke !important',
                                                    height:'5.5ch'
                                                },
                                                '&:hover fieldset': {
                                                    border: '1px solid whitesmoke !important'
                                                },
                                                '& input': {
                                                    paddingTop:'35px',
                                                    paddingRight:'40px' 
                                                },
                                                '&.Mui-focused fieldset': {
                                                    border: '2px solid whitesmoke !important',
                                                },
                                                '&.Mui-focused input':{
                                                    paddingTop:'35px',
                                                    paddingRight:'40px'
                                                }
                                            },
                                        }}
                                        onChange={handleChange}
                                        onFocus={handleInputFocus1}
                                        onBlur={handleInputBlur1}
                                        value={formFields.password}
                                    />
                                    {passwordError ? (<span className='text-danger'>Please enter the password!</span>) : null}
                            </StyledFormControl>
                            
                            <StyledFormControl fullWidth variant="outlined" sx={{ borderRadius: 20, marginLeft:'55px', position:"relative" }}>
                                    <InputLabel shrink={inputFocused2 || formFields.confirmPassword !== ''} htmlFor="confirmPassword"
                                        sx={{
                                            color:'white',
                                            lineHeight:'32px',
                                            marginRight:'70px'
                                        }}
                                    >
                                        Confirm Password
                                    </InputLabel>
                                    <TextField
                                        name='confirmPassword'
                                        type={showPassword1 === false ? "password" : "text"}
                                        variant='outlined'
                                        autoComplete='off'
                                        InputProps={{
                                            inputProps: {
                                                style: { textAlign: 'center'},
                                            },
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{cursor:'pointer'}}>
                                                    <div onClick={()=>setShowPassword1(!showPassword1)} style={{width:'43px', height:'43px', marginTop:'7px',marginLeft:'-14px', borderRadius:'50px', backgroundColor:'whitesmoke', display:'flex', justifyContent:'center', alignItems:'center'}}>
                                                        {showPassword1 === false ? <VisibilityOffIcon style={{ color: '#FF8674' }} /> : <VisibilityIcon style={{ color: '#FF8674' }} />}
                                                    </div>
                                                    
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{ marginTop: 1,marginBottom: 2, borderRadius: 20, width:'26ch', height:'4.5ch', color: 'white', backgroundColor:'rgba(255, 255, 255, 0.3)', '&:before':{
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'inherit',
                                            filter: 'blur(5px)',
                                            zIndex: -1,
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                border: '1px solid whitesmoke', 
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: '1px solid whitesmoke !important',
                                                    height:'5.5ch'
                                                },
                                                '&:hover fieldset': {
                                                    border: '1px solid whitesmoke !important'
                                                },
                                                '& input': {
                                                    paddingTop:'35px',
                                                    paddingRight:'40px' 
                                                },
                                                '&.Mui-focused fieldset': {
                                                    border: '2px solid whitesmoke !important',
                                                },
                                                '&.Mui-focused input':{
                                                    paddingTop:'35px',
                                                    paddingRight:'40px'
                                                }
                                            },
                                        }}
                                        onChange={handleChange}
                                        onFocus={handleInputFocus2}
                                        onBlur={handleInputBlur2}
                                        value={formFields.confirmPassword}
                                    />
                                    {confirmPasswordError ? (<span className='text-danger'>Please enter the confirm password!</span>) : null}
                            </StyledFormControl>
                            <div style={{position:'relative'}}>
                                <Button
                                    variant='contained'
                                    sx={{ marginTop: 1,borderRadius: 20, width: '34ch', height:'5.5ch', fontWeight:'bold', backgroundColor: 'rgba(255,134,116, 0.8)', '&:before':{
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background: 'inherit',
                                        filter: 'blur(5px)',
                                        zIndex: -1,
                                        },
                                        '&:hover':{
                                            border:'1px solid #FF8674',
                                            backgroundColor:'rgba(255,255,255,0.3)',
                                            color:'#FF8674'
                                        }
                                    }}
                                    onClick={signUp}
                                >
                                    Register
                                </Button>
                            </div>
                            <div style={{display:'flex', width:'268px', justifyContent:'center', alignItems:'center', marginTop:'8px'}}>
                                <p style={{color:'whitesmoke'}}>Already have an account?</p>
                                <Button>
                                    <div style={{width:'40px', height:'40px', display:'flex',  justifyContent:'center', alignItems:'center', marginTop:'5px', border:'1px solid white', borderRadius:'50px'}}>
                                        <Link to='/dbc/' style={{ textDecoration: 'none'}}><LoginRoundedIcon style={{ color: 'white'}} /></Link>
                                    </div>
                                    
                                </Button>
                            </div>
                        </div>
                    </Box>
                </div>
            </section>
        </IonPage>
    )

}

export default Register;