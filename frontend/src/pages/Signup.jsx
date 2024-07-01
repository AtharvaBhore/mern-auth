import { useState } from "react"
import { Link,useNavigate } from "react-router-dom"
import OAuth from "../components/OAuth";

export default function Signup() {

  const [formData,setFormData] = useState({});
  const [error,setError] = useState(false);
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData,[e.target.id]:e.target.value });
  }
  
  const handleSubmit = async (e) =>{

    try {
      setLoading(true);
      setError(false);
      e.preventDefault();
      //const backendPort = import.meta.env.VITE_PORT;
      const res = await fetch(`/auth/signup`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(formData)})
      const data = await res.json();
      setLoading(false);
      if(data.success===false){
        setError(true);
        return;
      }
      setError(false);
      navigate('/signin')
    } catch (error) {
      setLoading(false);
      setError(true)
    }

  }

  return (
    <div className="max-w-lg p-3 mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-3" action="">
        <input onChange={handleChange} type="text" name="username" id="username" placeholder="Username" className="bg-slate-100 p-3 rounded-lg" />
        <input onChange={handleChange} type="password" name="password" id="password" placeholder="Password" className="bg-slate-100 p-3 rounded-lg" />
        <input onChange={handleChange} type="email" name="email" id="email" placeholder="Email" className="bg-slate-100 p-3 rounded-lg" />
        <button disabled = {loading} className="disabled:opacity-80 hover:opacity-95 bg-slate-700 uppercase text-white p-3 rounded-lg">{loading?'Loading...':'Sign Up'}</button>
        <OAuth/>
      </form>
      <div className="mt-5 gap-2 flex">
        <p>Have an account?</p>
        <Link to='/signin'>
        <span className="text-blue-500">Sign In</span>
        </Link>
      </div>
      <p className="text-red-700 mt-5">{error && 'Something went wrong!'}</p>
    </div>
  )
}
