import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import api from "../../api"
import {jwtDecode} from "jwt-decode";
import {REFRESH_TOKEN, ACCESS_TOKEN} from '../../constants';

import { ReactNode } from "react";

function ProtectedRoute({children}: {children: ReactNode}) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, [])

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try{
      const res = await api.post('/api/token/refresh/', {refersh: refreshToken});
      if(res.status === 200){
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else{
        setIsAuthorized(false);
      }
    } catch (error){
      console.log(error);
      setIsAuthorized(false);
    }
  }


  const auth = async () => {
    console.log(localStorage.getItem(ACCESS_TOKEN));
    const token = localStorage.getItem(ACCESS_TOKEN);
    if(!token){
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const currentTime = Date.now() / 1000;

    console.log(tokenExpiration, currentTime);
    if(tokenExpiration && tokenExpiration < currentTime){
      console.log("refreshing token");
      await refreshToken();
    } else{
      console.log("authorized");
      setIsAuthorized(true);
    }
  }

  if (isAuthorized === null){
    return <div>Loading...</div>
  }

  console.log(isAuthorized);

  return isAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoute;

