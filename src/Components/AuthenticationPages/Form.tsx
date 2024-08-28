import { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import { UserInput } from "../MainPages/SmallComponents/UserInput";
import { docClient } from "../../AwsConfig";
import { getCurrentUser, signIn } from "aws-amplify/auth";
import { UserHiddenInput } from "../MainPages/SmallComponents/UserHiddenInput";
import { get } from "http";

type FormProps = {
  route: string;
  method: string;
};

function Form({ route, method }: FormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const onSignIn = async () => {
    if(!email || !password) {
      alert('Please fill in all the fields')
      return
    }

    getCurrentUser().then((data) => {
      console.log(data.signInDetails?.loginId)
      if(data.signInDetails?.loginId) {
        navigate('/' + data.signInDetails.loginId)
      }
    }).catch((err) => {
      alert(err)
    })

    await signIn({
      username: email,
      password: password
    }).then((data) => {
      console.log(data)
      console.log(data.nextStep)
      navigate('/test/' + email)
    }).catch((err) => {
      console.log(err)
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try{

      onSignIn()
      
    }
    catch(error){
      alert(error);
    } finally{
      setLoading(false);
    }

  };

  useEffect(() => {
    getCurrentUser().then((data) => {
      console.log(data.signInDetails?.loginId)
      if(data.signInDetails?.loginId) {
        navigate('/' + data.signInDetails.loginId)
      }
    }).catch((err) => {
      alert(err)
    })
  }, [])

  useEffect(() => {
    // getCurrentUser().then((data) => {
    //   console.log(data.signInDetails?.loginId)
    //   if(data.signInDetails?.loginId) {
    //     navigate('/test/' + data.signInDetails.loginId)
    //   }
    // }).catch((err) => {
    //   alert(err)
    // })
  })

  return (
    <form className="px-[1.5rem] py-4 max-w-[500px] m-auto mt-[200px] flex flex-col items-center shadow-md border-1 border-solid border-grey" onSubmit={handleSubmit}>
      <h1>{name}</h1>
      <UserInput header="Email" value={email} setValue={setEmail} />
      <UserInput header="Password" value={password} setValue={setPassword} />
      {method === "login" ? 
            <button className="px-[1.5rem] py-2 text-black underline" type="button" onClick={() => navigate("/register")}>Sign Up</button> 
          : 
            <button className="px-[1.5rem] py-2 text-black underline" type="button" onClick={() => navigate("/login")}>Already have an account?</button>
        }
      <button className="px-[1.5rem] py-2 bg-black text-white rounded-[4000px] mt-4" type="submit">{name}</button>
      
    </form>
  );
}

export default Form;
