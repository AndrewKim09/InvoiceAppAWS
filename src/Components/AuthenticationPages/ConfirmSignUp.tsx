import { confirmSignUp } from 'aws-amplify/auth';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const ConfirmSignUp = () => {
  const [code, setCode] = useState('')
  const navigate = useNavigate();

  const { email } = useParams<{ email: string }>();
  console.log(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    let newCode = code.split('');
    newCode[index] = e.target.value;
    setCode(newCode.join(''));

    // Automatically focus the next input field
    if (e.target.value && index < 5) {
      (document.getElementById(`digit-${index + 1}`) as HTMLInputElement).focus();
    }
  };

  const onVerify = async () => {
    if(email == null){
      console.log('Email is null')
      return
    }
    if(code.length !== 6){
      console.log('Code is not 6 digits')
      return
    }
    await confirmSignUp({
      username: email,
      confirmationCode: code
    }).then((data) => {
      console.log(data.nextStep)
      console.log('User verified')
      navigate('/test')
    }).catch((err) => {
      console.log(err)
    })
  }

  return (
    <main>
      <div className='fixed mx-auto my-auto z-30 w-[100%] max-w-[480px] max-h-[249px] bg-white rounded-xl p-4 inset-0 flex flex-col items-center'>
        <h1 className='font-bold'>Check email for a verification code</h1>
        <div className='flex justify-between w-full px-20 mt-10'>
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              id={`digit-${index}`}
              type="text"
              maxLength={1}
              className='w-8 p-2 text-xl font-bold text-center text-black border-b-2 border-solid border-purple'
              value={code[index] || ''}
              onChange={(e) => handleChange(e, index)}
            />
          ))}
        </div>
        <button className=' py-2 mt-10 text-white rounded-md w-[50%] bg-purple' onClick={() => {onVerify()}}>Confirm</button>
      </div>
    </main>
  );
};
