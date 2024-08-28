import React, { useEffect } from 'react'
import data from '../../assets/data.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import illustration from '../../assets/illustration-empty.svg'
import { faAngleRight, faArrowRight, faCircle } from '@fortawesome/free-solid-svg-icons'
import { invoiceType as Invoice } from '../Classes/InvoiceType'

type invoicesProps = {
  setAddState: Function
  setClickedInvoice: (invoice: Invoice) => void,
  fetchedData: Invoice[]
}



export const Invoices = (props: invoicesProps) => {
  console.log(props.fetchedData)
  console.log(props.fetchedData.length)


  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 text-green-500 dark:text-[#33D69F] dark:bg-[#1F2B3F]';
      case 'pending':
        return 'bg-yellow-50 text-yellow-500 dark:text-[#FF8F00] dark:bg-[#2B2736]';
      case 'draft':
        console.log('draft')
        return 'bg-gray-100 text-[#373B53] dark:text-greyBlue dark:bg-[#292C44]';
      default:
        return '';
    }
  };

  const onExpand = (invoice: Invoice) => {
    props.setClickedInvoice(invoice)
  }

  return (
    <>
    {(props.fetchedData.length > 0) ? 
        
      props.fetchedData.map((invoice: Invoice, key: number) => {
          return (
            <div key={key} className='w-[100%] h-[134px] bg-white mt-[1rem] rounded-xl px-[1.5rem] pb-[1.375rem] pt-[1.5625rem] flex flex-col flex-wrap cursor-pointer justify-start md:grid md:grid-cols-[87px_1fr_1fr_1fr_1fr_24px] md:items-center md:justify-between md:py-[1rem] md:h-[72px] md:shadow-sm dark:bg-black3' onClick={() => {onExpand(invoice)}}>
                <p className='text-[15px] font-bold tracking-[-0.25px] h-[15px] leading-[15px] dark:text-white'><span className='text-grey '>#</span>{invoice.id}</p>
                <p className='text-[13px] text-[#858BB2] tracking-[-0.1px] order-4 self-end justify-self-between h-[15px] md:self-center md:order-3 dark:text-white'>{invoice.clientName}</p>

                <p className='text-[13px] text-[#858BB2] tracking-[-0.1px] mt-[1.5rem] h-[15px] md:mt-0 dark:text-light'>Due {invoice.paymentDue}</p>
                <p className='text-[15px] font-bold tracking-[-0.25px] h-[24px] mt-[0.5625rem] md:order-4 md:mt-0 md:text-end dark:text-white'><span className='mr-1'>$</span>{invoice.total.toString()}</p>

                {<button className={`h-[40px] w-[104px] ${getStatusClasses(invoice.status)} rounded-md font-bold order-5 self-end justify-self-between mt-[1.625rem] md:mt-0 ml-auto`}>
                  <FontAwesomeIcon icon={faCircle} className='mr-[6px] text-[8px]' />
                  <span >{capitalizeFirstLetter(invoice.status)}</span>
                </button>}
                <FontAwesomeIcon icon={faAngleRight} className=' text-[8px] order-last text-purple hidden md:inline-block ml-auto' />
            </div>
          )
        })
    
    :
    
    <div className='flex flex-col justify-center w-[206px] self-center justify-self-center grow'>
      <img src={illustration} alt='illustration' className='mx-auto' />
      <p className='text-black2 text-[24px] font-bold tracking-[-0.75px] text-center mt-[2.65rem]'>There is nothing here</p>
      <p className='text-grey text-[13px] tracking-[-0.1px] text-center mt-[1.4375rem]'>Create an invoice by clicking the <b>New</b> buton and get started</p>

    </div>
    }
    </>
  )
}
