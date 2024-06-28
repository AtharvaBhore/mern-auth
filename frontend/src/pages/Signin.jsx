import { useState } from "react"
import { Link,useNavigate } from "react-router-dom"
import {signInFailure,signInSuccess,signInStart} from "../redux/user/userSlice.js"
import { useDispatch, useSelector } from "react-redux";


export default function Signin() {

  const [formData,setFormData] = useState({});
  const {loading,error} = useSelector((state)=>state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({...formData,[e.target.id]:e.target.value });
  }
  
  const handleSubmit = async (e) =>{

    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('http://localhost:3000/auth/signin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(formData)})
      const data = await res.json();
      if(data.success===false){
        dispatch(signInFailure(data.message))
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/')
    } catch (error) {
      dispatch(signInFailure(error))
    }

  }

  return (
    <div className="max-w-lg p-3 mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-3" action="">
        <input onChange={handleChange} type="email" name="email" id="email" placeholder="Email" className="bg-slate-100 p-3 rounded-lg" />
        <input onChange={handleChange} type="password" name="password" id="password" placeholder="Password" className="bg-slate-100 p-3 rounded-lg" />
        <button disabled = {loading} className="disabled:opacity-80 hover:opacity-95 bg-slate-700 uppercase text-white p-3 rounded-lg">{loading?'Loading...':'Sign In'}</button>
      </form>
      <div className="mt-5 gap-2 flex">
        <p>Dont have an account?</p>
        <Link to='/signup'>
        <span className="text-blue-500">Sign Up</span>
        </Link>
      </div>
      <p className="text-red-700 mt-5">
        {error?error.message || 'Something went wrong!':''}
        </p>
    </div>
  )
}
