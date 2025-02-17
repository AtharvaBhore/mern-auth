import { useSelector } from "react-redux"
import { useRef, useState,useEffect } from "react"
import {getStorage, uploadBytesResumable,ref, getDownloadURL} from 'firebase/storage'
import {app} from '../firebase'
import { useDispatch } from "react-redux"
import { signOut,updateUserFailure,updateUserSuccess,updateUserStart,deleteUserFailure,deleteUserStart,deleteUserSuccess } from "../redux/user/userSlice.js"

export default function Profile() {

  const fileRef = useRef(null);
  const [image,setImage] = useState(undefined);
  const [imagePercent,setImagePercent] = useState(0);
  const [imageError,setImageError] = useState(false)
  const [formData,setFormData] = useState({});
  const [updateSuccess,setUpdateSuccess] = useState(false);
  const {currentUser,loading,error} = useSelector((state)=>state.user)
  const dispatch = useDispatch();

  const handleFileUpload = async(image)=>{

    const storage = getStorage(app);
    const fileName = new Date().getTime()+image.name;
    const storageRef = ref(storage,fileName);
    const uploadTask = uploadBytesResumable(storageRef,image);

    uploadTask.on('state_changed',(snapshot)=>{
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) *100
      setImagePercent(Math.round(progress));
    },

    (error)=>{
      setImageError(true);
    },

    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then( 
        (downloadURL)=>{
        setFormData({
          ...formData,profilePicture:downloadURL
        })}
      )
    }

    )
  }

  useEffect(()=>{
    if(image){
      handleFileUpload(image);
    }
  },[image])

  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id]:e.target.value});
  }

  const handleSubmit= async(e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/users/update/${currentUser.id}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData),
      })
      const data = await res.json();
      if(data.success===false){
        dispatch(updateUserFailure(data))
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeleteAccount = async ()=>{

    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/users/delete/${currentUser.id}`,{
        method:'DELETE',
      });

      const data = await res.json();

      if(data.success===false){
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }

  }

  const handleSignout = async ()=>{
    try {

      await fetch('/auth/signout');
      dispatch(signOut());

    } catch (error) {
      console.log(error);
    }
  }

  return (

    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input type="file" ref={fileRef} hidden accept='image/*' onChange={(e)=>setImage(e.target.files[0])}/>
        <img onClick={()=>fileRef.current.click()} src={formData.profilePicture || currentUser.profileimage} alt="profileimage" className="cursor-pointer h-24 w-24 self-center object-cover rounded-full mt-2"/>
       
        <p className="text-sm self-center">
          {
            imageError?(
              <span className="text-red-700">
                Error Uploading Image
              </span>
            ):(
              (imagePercent>0&&imagePercent<100)?(<span className="text-slate-700">{`Uploading:${imagePercent} %`}</span>)
              :(imagePercent===100?(<span className="text-green-700">
                Image Uploaded Successfully
              </span>):'')
            )
          }
        </p>
       
        <input type="text" defaultValue={currentUser.username} id="username" placeholder="Username" className="bg-slate-100 rounded-lg p-3" onChange={handleChange}/>
        <input type="email" defaultValue={currentUser.email} id="email" placeholder="Email" className="bg-slate-100 rounded-lg p-3" onChange={handleChange}/>
        <input type="password" id="password" placeholder="Password" className="bg-slate-100 rounded-lg p-3" onChange={handleChange}/>
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">{loading?'Loading...':'Update'}</button>
        </form>
        <div className="flex justify-between mt-5">
          <span onClick={handleDeleteAccount} className="text-red-700 cursor-pointer">Delete Account</span>
          <span onClick={handleSignout} className="text-red-700 cursor-pointer">Sign Out</span>
        </div>

        <p className="text-red-700 mt-5">{error && 'Something went wrong!'}</p>
        <p className="text-green-700 mt-5">{updateSuccess && 'User Updated!'}</p>
      
    </div>
  )
}
