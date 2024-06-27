import { Link } from "react-router-dom"

export default function Signup() {
  return (
    <div className="max-w-lg p-3 mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4 p-3" action="">
        <input type="text" name="username" id="username" placeholder="Username" className="bg-slate-100 p-3 rounded-lg" />
        <input type="password" name="password" id="password" placeholder="Password" className="bg-slate-100 p-3 rounded-lg" />
        <input type="email" name="email" id="email" placeholder="Email" className="bg-slate-100 p-3 rounded-lg" />
        <button className="disabled:opacity-80 hover:opacity-95 bg-slate-700 uppercase text-white p-3 rounded-lg">Sign Up</button>
      </form>
      <div className="mt-5 gap-2 flex">
        <p>Have a account?</p>
        <Link to='/signin'>
        <span className="text-blue-500">Sign in</span>
        </Link>
      </div>
    </div>
  )
}
