import React from 'react';
import logo from '../../assets/logo.svg';
import moonIcon from '../../assets/icon-moon.svg';
import sunIcon from '../../assets/icon-sun.svg';
import avatar from '../../assets/image-avatar.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { signOut } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

type NavBarProps = {
  darkMode: boolean;
  toggleNightMode: () => void;
}

export const NavBar = (props: NavBarProps) => {

  const navigate = useNavigate()

  const onSignOut = () => {
    signOut().then(() => {
    navigate("/")
    }).catch((err) => {
      console.log(err)
    })
  }

  return (
    <div className="bg-black4 h-[72px] flex items-center md:h-[80px] xl:h-auto xl:min-w-[103px] xl:flex-col xl:rounded-r-2xl">
      <div className="w-[72px] h-full rounded-tr-2xl rounded-br-2xl bg-purple flex items-center justify-center relative md:w-[80px] xl:w-full xl:min-h-[103px] xl:max-h-[103px]">
        <img src={logo} alt="logo" className="w-[32px] h-[32px] z-20" />
        <div className="absolute bottom-0 w-full h-1/2 bg-lightPurple rounded-tl-2xl rounded-br-2xl"></div>
      </div>
      <div className="ml-auto flex items-center border-r-2 border-[#494E6E] grow pr-[24px] justify-end h-full xl:w-full xl:border-r-0 xl:border-b-2 xl:ml-0 xl:justify-center xl:pr-0 xl:items-end xl:pb-[2.00625rem]">
        {!props.darkMode ? 
            <img src={moonIcon} alt="moon" className="w-[24px] h-[24px] cursor-pointer xl:w-[20px] xl:h-[20px]" onClick={props.toggleNightMode} />
          :
            <img src={sunIcon} alt="sun" className="w-[24px] h-[24px] cursor-pointer xl:w-[20px] xl:h-[20px]" onClick={props.toggleNightMode} />
        }
      </div>
      <div className="w-[80px] flex justify-center items-center py-[1.5rem] xl:w-full">
        <FontAwesomeIcon icon={faSignOut} className="fa-lg aspect-square rounded-full xl:w-[40px] cursor-pointer text-grey" onClick={() => {onSignOut()}} />
      </div>
    </div>
  )
}
