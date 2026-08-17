import React from 'react'
import { signUpStyles } from '../assets/dummyStyles'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import axios from 'axios';

export default function SignUpPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate=useNavigate();
    const [submitting,setSubmitting]=useState(false);
    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    const handleSubmit = async (e) => {
    e.preventDefault();
    // enforce all fields
    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all fields.", {
        position: "top-right",
        autoClose: 4000,
        theme: "light",
      });
      return;
    }

    // simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.", {
        position: "top-right",
        autoClose: 4000,
        theme: "light",
      });
      return;
    }

    // require remember me explicitly
    if (!rememberMe) {
      toast.error("Please tick 'Remember me' to continue.", {
        position: "top-right",
        autoClose: 4000,
        theme: "light",
      });
      return;
    }

   setSubmitting(true);
   try {
    const resp= await axios.post(
      `${API_BASE}/api/auth/register`,{
        name:name.trim(),
        email:email.trim().toLowerCase(),
        password
      },{
        headers:{"Content-Type":"application/json"},
      }
    );
    const data=resp.data;
    if(data && data.token){
      if(rememberMe){
        localStorage.setItem("authToken",data.token);
        localStorage.setItem("user",JSON.stringify(data.user ?? {}));
      }
      else{
        sessionStorage.setItem("authToken",data.token);
        sessionStorage.setItem("user",JSON.stringify(data.user ?? {}));
      }
       // success
    toast.success("Signup successful", {
      position: "top-right",
      autoClose: 1200,
      theme: "light",
    });
     setTimeout(() => {
      navigate("/login");
    }, 1250);
    }
    else{
      toast.error(data.message || "Unexpected error from server",{
        position:"top-right",
        autoClose:4000,
        theme:"light",
      })
    }
   }catch (err) {
      // Prefer server-provided message if available
      const serverMsg = err?.response?.data?.message;
      const status = err?.response?.status;

      if (status === 409) {
        toast.error(serverMsg || "User already exists.", {
          position: "top-right",
          autoClose: 4000,
          theme: "light",
        });
      } else if (serverMsg) {
        toast.error(serverMsg, {
          position: "top-right",
          autoClose: 4000,
          theme: "light",
        });
      } else {
        toast.error("Server error. Please try again later.", {
          position: "top-right",
          autoClose: 4000,
          theme: "light",
        });
      }
      console.error("Signup error:", err?.response ?? err);
    } finally{
      setSubmitting(false);
    }
  
  };
  return (
    <div className={signUpStyles.pageContainer} style={signUpStyles.pageFontStyle}>
      <ToastContainer/>
      <button onClick={()=>navigate("/login")} className={signUpStyles.backButton}>
            <ArrowLeft className={signUpStyles.backIcon}/>
            <span className={signUpStyles.backText}>Back to login </span>
      </button>
      <div className={signUpStyles.formContainer}>
        <div className={signUpStyles.card}>
        <div className={signUpStyles.decorativeCircle}></div>
        <h1 className={signUpStyles.title} style={signUpStyles.pageFontStyle}>
            Create Account
        </h1>
        <p className={signUpStyles.subtitle}>
            Simple  Sign Up to get you started
        </p>
        <form onSubmit={handleSubmit} className={signUpStyles.form}>
            <label htmlFor="name" className={signUpStyles.label}>Full Name</label>
            <div className={signUpStyles.inputContainer}>
                <div className={signUpStyles.inputIconContainer}>
                    <User className={signUpStyles.inputIcon}/>
                </div>
                <input type="text" value={name} onChange={(e)=>setName(e.target.value)} id='name' placeholder='Enter your Full Name' className={signUpStyles.inputField} required disabled={submitting} />
            </div>
            <label htmlFor="email" className={signUpStyles.label}>Email</label>
            <div className={signUpStyles.inputContainer}>
                <div className={signUpStyles.inputIconContainer}>
                    <Mail className={signUpStyles.inputIcon}/>
                </div>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} id='email' placeholder='your@example.com' className={signUpStyles.inputField} required disabled={submitting} />
            </div>
            <div>
            <label htmlFor="password" className={signUpStyles.label}>Password</label>
            <div className={signUpStyles.inputContainer}>
                <div className={signUpStyles.inputIconContainer}>
                    <Lock className={signUpStyles.inputIcon}/>
                </div>
                <input type={showPassword?"text":"password"} value={password} onChange={(e)=>setPassword(e.target.value)} id='create password' placeholder='Password' className={signUpStyles.inputField} required disabled={submitting} />
                <button type='button' onClick={()=>setShowPassword(!showPassword)} className={signUpStyles.passwordToggleButton}>
                    {
                        showPassword?(
                            <EyeOff className={signUpStyles.passwordToggleIcon}/>
                        ):(
                            <Eye className={signUpStyles.passwordToggleIcon}/>
                        )
                    }
                </button>
                </div>
            </div>
            <div className={signUpStyles.checkboxContainer}>
                    <label  className={signUpStyles.checkboxLabel}>
                        <input type="checkbox" checked={rememberMe} onChange={()=>setRememberMe(!rememberMe)} required className={signUpStyles.checkboxInput} disabled={submitting} />
                        <span className={signUpStyles.checkboxText}>Remember Me </span>
                    </label>
            </div>
            <button type='submit' className={`${signUpStyles.submitButton} ${submitting?signUpStyles.submitButtonDisabled:""}`} disabled={submitting} >
              {submitting?"Creating account":"Sign Up"}
            </button>
        </form>
                <div className={signUpStyles.bottomContainer}>
                        <span className={signUpStyles.bottomText}>
                            Already Have an Account{"  "}
                        </span>
                        <Link to="/login" className={signUpStyles.loginLink}>Login</Link>
                </div>
        </div>
      </div>
    </div>
  )
}
