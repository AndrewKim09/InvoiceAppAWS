import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Dispatch, useEffect, useState } from 'react'

interface DatePickerProps {
    month: number;
    year: number;
    setInvoiceDateDay: Function;
    setInvoiceDateMonth: Function;
    setInvoiceDateYear: Function;
    TurnOffDatePicker: Function;
  }

export const DatePicker = (props: DatePickerProps) => {
  const [day, setDay] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);

  const months: { days: number, month: string }[] = [
    { days: 31, month: 'Jan'},
    { days: 28, month: 'Feb'},
    { days: 31, month: 'Mar'},
    { days: 30 , month: 'Apr'},
    { days: 31 , month: 'May'},
    { days: 30 , month: 'Jun'},
    { days: 31 , month: 'Jul'},
    { days: 31 , month: 'Aug'},
    { days: 30 , month: 'Sep'},
    { days: 31 , month: 'Oct'},
    { days: 30 , month: 'Nov'},
    { days: 31 , month: 'Dec'},
  ]
  
  

  const currentDate = new Date();

  const OnNextMonth = () => {
    if(!month || !year) return;
    if(month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }

  const OnPrevMonth = () => {
    if(!month || !year) return;
    if(month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  }

  useEffect(() => {
    console.log(`${day} ${months[month|| 0].month} ${year}`)
    if(!month || !year || !day) return;
    props.setInvoiceDateDay(day);
    props.setInvoiceDateMonth(month);
    props.setInvoiceDateYear(year);
    props.TurnOffDatePicker();
  }, [month, year, day])

  const onDayClick = (day: number) => {
    setDay(day);
  }


  useEffect(() => {
    setMonth(props.month);
    setYear(props.year);
  }, [props.month, props.year])

  if(!props.month || months[props.month] === undefined || !props.year || props.year > currentDate.getFullYear()) {
    alert('Invalid month or year. Please provide a valid month and year.')
  }

  return (
    <div className='w-[35%] min-w-[215px] absolute h-[240px] px-[1.51rem] pt-[1.625rem] pb-[1.9375rem] bg-white shadow-xl rounded-xl right-2 z-40'>
      { month && year?
      <>
        <div className='flex justify-between'>
          <FontAwesomeIcon icon={faAngleLeft} className='text-[#7C5DFA] cursor-pointer' onClick={() => {OnPrevMonth()}}/>
          <p className='font-bold text-[15px] tracking-[-0.25px] text-black1'>{months[month].month} {props.year}</p>
          <FontAwesomeIcon icon={faAngleRight} className='text-[#7C5DFA] cursor-pointer' onClick={() => {OnNextMonth()}}/>
        </div>
        <div className='grid grid-cols-7 grid-rows-5 mt-[2rem] items-center font-bold'>
          {Array.from({ length: 35 }).map((_, i) => (
            <div className={`${i < months[month].days ? "cursor-pointer hover:text-purple" : "opacity-20 pointer-events-none"}`} key={i} onClick={() => {onDayClick(i+1)}}>{ i < months[month].days ? i + 1: i + 1 - months[month].days}</div>
          ))}
        </div>
      </>
      :
      null
    }
    </div>
  )
}
