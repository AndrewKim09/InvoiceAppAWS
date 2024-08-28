import React from 'react'

export const UserInput = ({header, setValue, value, index, disabled}: {header?: string, setValue: Function, value?: String | number, index?: number, disabled?: boolean}) => {

  return (
    <div className='flex flex-col w-[100%] '>
      {!index? <p className='text-greyBlue mb-[.5625rem] text-[13px] tracking-[-0.1px] mt-[1.5rem] dark:text-light'>{header}</p>: index == 0 ? <p className='text-greyBlue mb-[.5625rem] text-[13px] tracking-[-0.1px] mt-[1.5rem]'>{header}</p> : <p className='text-greyBlue mb-[.5625rem] text-[13px] tracking-[-0.1px] mt-[1.5rem] md:hidden md:min-w-[75px]'>{header}</p>}
      <input className={`w-[100%] h-[48px] border-2 border-solid border-lightGrey rounded-md text-[15px] tracking-[-0.25px] font-bold px-[20px] dark:bg-black2 dark:border-black2 dark:text-white ${(value == "" || value == undefined ) ? "border-red" : "border-lightgrey"}`} value={value?.toString()} onChange={(e) => {setValue(e.target.value)}} disabled={disabled}/>
    </div>
  )
}
