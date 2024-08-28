import React, { useState } from 'react'
import Form from './Form';
import { UserInput } from '../MainPages/SmallComponents/UserInput';
import { useNavigate } from 'react-router-dom';
import { signUp } from 'aws-amplify/auth';
import { UserHiddenInput } from '../MainPages/SmallComponents/UserHiddenInput';

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const OnSignUp = async () => {
    if(!password || !email || !phone) {
      alert('Please fill in all the fields')
      return
    }

    console.log(phone)
    await signUp({
      username: email,
      password: password,
      options: {
        userAttributes: {
          phone_number: "+1" + phone
        }
      }
    }).then((data) => {
      console.log(data)
      console.log(data.nextStep)
      
      navigate('/confirm/' + email)
      
    }).catch((err) => {
      console.log(err)
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      OnSignUp()
    }
    catch(error){
      alert(error);
    }
  };
  return(
    <form className="px-[1.5rem] py-4 max-w-[500px] m-auto mt-[200px] flex flex-col items-center shadow-md border-1 border-solid border-grey" onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      <UserInput header="Email" value={email} setValue={setEmail} />
      <UserInput header="Password" value={password} setValue={setPassword} />
      <UserInput header="Phone" value={phone} setValue={setPhone} />
      
      <button className="px-[1.5rem] py-2 text-black underline" type="button" onClick={() => navigate("/login")}>Already have an account?</button>
      <button className="px-[1.5rem] py-2 bg-black text-white rounded-[4000px] mt-4" type="submit">Register</button>
      
    </form>
  )
}

export default Register;