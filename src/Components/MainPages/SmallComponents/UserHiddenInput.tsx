import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';

export const UserHiddenInput = ({header, setValue, value}: {header?: string, setValue: Function, value?: string | number}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState<string | number | undefined>(value);

  //unusable as of now: not possible to use input and customly hide the password

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  function onValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setInputValue(newValue);
    setValue(newValue);  // Only send the raw value to the parent
  }

  function getMaskedValue(value: string | number | undefined) {
    if (!value) return '';
    return '*'.repeat(value.toString().length);
  }

  function toggleShowPassword(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setShowPassword(!showPassword);
  }

  const displayValue = showPassword ? inputValue : getMaskedValue(inputValue);

  return (
    <div className='flex flex-col w-full'>
      {header && (
        <p className='text-greyBlue mb-2 text-[13px] tracking-tight mt-6 dark:text-light'>
          {header}
        </p>
      )}
      <div className={`flex items-center w-full h-12 border-2 rounded-md text-[15px] tracking-wide font-bold px-5 dark:bg-black2 dark:border-black2 dark:text-white ${!value ? "border-red" : "border-lightgrey"}`}>
        <input 
          className="w-full border-none bg-inherit"
          value={displayValue} 
          onChange={onValueChange}
        />
        <button className='h-full ml-4 aspect-square' onClick={toggleShowPassword}>
          <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} className='text-greyBlue' />
        </button>
      </div>
    </div>
  );
}
