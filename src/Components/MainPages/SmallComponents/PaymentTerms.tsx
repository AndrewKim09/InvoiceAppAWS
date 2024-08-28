import React, { Dispatch, SetStateAction } from 'react'

interface DatePickerProps {
  setPaymentTerms: Dispatch<SetStateAction<number | undefined>>;
  TurnOffSelectPaymentTerms: Function
}
export const PaymentTerms = (props: DatePickerProps) => {
  const onSet = (paymentTerms: number) =>{
    props.setPaymentTerms(paymentTerms);
    props.TurnOffSelectPaymentTerms();
  }

  return (
    <div className='w-[35%] min-w-[215px] absolute h-[240px] bg-white shadow-xl rounded-xl right-2 grid grid-rows-4 items-center z-30'>
      <div className='font-bold text-black1 text-[15px] tracking-[-0.25px] border-b border-greyBlue px-[1.5rem] h-full flex items-center cursor-pointer' onClick={() => {onSet(1)}}>
        Net 1 Day
      </div>
      <div className='font-bold text-black1 text-[15px] tracking-[-0.25px] border-b border-greyBlue px-[1.5rem] h-full flex items-center cursor-pointer' onClick={() => {onSet(7)}}>
        Net 7 Days
      </div>
      <div className='font-bold text-black1 text-[15px] tracking-[-0.25px] border-b border-greyBlue px-[1.5rem] h-full flex items-center cursor-pointer' onClick={() => {onSet(14)}}>
        Net 14 Days
      </div>
      <div className='font-bold text-black1 text-[15px] tracking-[-0.25px] px-[1.5rem] h-full flex items-center cursor-pointer' onClick={() => {onSet(30)}}>
        Net 30 Days
      </div>
    </div>
  )
}
