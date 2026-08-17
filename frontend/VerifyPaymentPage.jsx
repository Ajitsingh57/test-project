import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

export default function VerifyPaymentPage() {
    const [statusMsg,setStatusMsg]=useState("Verifying Payment...");
    const navigate=useNavigate();
    const location=useLocation();
    const search=location.search || "";
    useEffect(()=>{
        let cancelled=false;
        const verifyPayment=async()=>{
            const params=new URLSearchParams(search);
            const rawSession=params.get("session_id");
            const session_id=rawSession ?rawSession.trim():null;
            const payment_status=params.get("payment_status");
            const token=localStorage.getItem("authToken");
            if(payment_status==="cancel"){
                navigate('/checkout',{replace:true});
                return;
            }
            if(!session_id){
                setStatusMsg("No session id found in url");
                return ;
            }
            try {
                setStatusMsg("Conferming payment with server");
                const API_BASE = import.meta.env.VITE_API_BASE_URL;
                const res= await axios.get(`${API_BASE}/api/orders/confirm`,{
                    params:{session_id},
                    headers:token?{Authorization:`Bearer ${token}`}:{},
                    timeout:15000,
                });
                if(cancelled)return;
                if(res?.data?.success){
                    setStatusMsg("Payment Done. redirecting...");
                    navigate('/my-orders',{replace:true});
                }
                else{
                    const msg=res?.data?.message || "Payment not completed";
                    setStatusMsg(msg);
                }
            }catch (err) {
        console.error("Verification error:", err);
        const status = err?.response?.status;
        const serverMsg = err?.response?.data?.message;

        if (status === 404) {
          setStatusMsg(
            serverMsg ||
              "Payment session not found. If you were charged, contact support with your session id."
          );
        } else if (status === 400) {
          setStatusMsg(
            serverMsg || "Payment not completed or invalid request."
          );
        } else {
          setStatusMsg(
            serverMsg ||
              "There was an error confirming your payment. If you were charged, please contact support."
          );
        }
      }
        };
        verifyPayment();
        return ()=>{
            cancelled=true;

        }
    },[search,navigate]);
  return (
    <div className='min-h-screen flex items-center justify-center text-white p-4'>
      <div className='text-center max-w-lg'>
        <p className='mb-2'>{statusMsg}</p>
        <p className='text-sm opacity-70'>
            If this page shows "Session not found ",try creating session again or contact with support
        </p>
      </div>
    </div>
  )
}
// for the payment to be paid and order place we requrire this