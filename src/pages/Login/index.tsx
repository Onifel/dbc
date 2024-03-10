import { useState } from 'react';
import './style.css';
import { Button, TextField, Box, FormControl, InputAdornment, InputLabel } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';
import { Link } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import { IonPage } from '@ionic/react';

import { LoginApi } from '../../services/Api.jsx';

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
        height:"39px",
        color:'white',
    }
  });
  
const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [formFields, setFormFields] = useState({
        username:'',
        password:''
    })
    const [showLoader, setShowLoader] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [inputFocused, setInputFocused] = useState(false);
    const [inputFocused1, setInputFocused1] = useState(false);

    const history = useNavigate();

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

    const login = (e:any) => {
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
        if (hasError) {
            setShowLoader(false)
        }else{
            const email = `${formFields.username}@example.com`;
            LoginApi({...formFields, email})
            .then((response:any) => {
                console.log(response);
                const user = response.data.idToken;
                toast.success('Success!')
                setShowLoader(false)
                setFormFields({
                    username:'',
                    password:'',
                    
                })
                history('/dbc/home');
                localStorage.setItem('token', user.accessToken);
                localStorage.setItem('user', JSON.stringify(user));
            }).catch(()=>{
                toast.error('Invalid Credentials!')
                setShowLoader(false)
            }).finally(()=>{
                setPasswordError(false);
            })
        }
    }
    
    return (
        <IonPage>
            <section className='signIn'>
                <div className='loginWrapper'>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={showLoader}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    <div className='logo'></div>
                    <Box>
                        <div className='box_login' >
                            <Toaster
                                position="top-center"
                                reverseOrder={false}
                            />
                              <StyledFormControl fullWidth variant="outlined" sx={{ borderRadius: 20, marginLeft:'55px', position:"relative"}}>
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
                                                border: '1px solid whitesmoke'
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: '1px solid whitesmoke !important',
                                                    height:'5.5ch'
                                                },
                                                '&:hover fieldset': {
                                                    border: '1px solid whitesmoke !important',
                                                },
                                                '& input': {
                                                    paddingTop:'35px',
                                                    paddingRight:'40px',
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
                                        onFocus={handleInputFocus}
                                        onBlur={handleInputBlur}
                                        value={formFields.username}
                                    />
                                </StyledFormControl>
                                {emailError ? (<span className='text-danger'>Please enter the username!</span>) : null}
                        
                                <StyledFormControl fullWidth variant="outlined" sx={{ borderRadius: 20, marginLeft:'55px',position:"relative" }}>
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
                                                border: '1px solid whitesmoke'
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    border: '1px solid whitesmoke !important',
                                                    height:'5.5ch',
                                                },
                                                '&:hover fieldset': {
                                                    border: '1px solid whitesmoke !important',
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
                                        },
                                       
                                    }}
                                    onClick={login}
                                >
                                    Login
                                </Button>
                            </div>
                            
                            <div style={{display:'flex', width:'268px', justifyContent:'center', alignItems:'center', marginTop:'20px'}}>
                                <p style={{color:'whitesmoke'}}>Don't have an account?</p>
                                <Button>
                                    <div style={{width:'40px', height:'40px', display:'flex', justifyContent:'center', alignItems:'center', border:'1px solid white', borderRadius:'50px'}}>
                                        <Link to='/dbc/register' style={{ textDecoration: 'none'}}><AppRegistrationRoundedIcon style={{ color: 'white'}} /></Link>
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

export default Login;