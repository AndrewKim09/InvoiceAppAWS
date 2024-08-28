import React, {Dispatch, SetStateAction, useContext } from 'react'
import api from '../../api';
import { invoiceType } from '../Classes/InvoiceType';
import { MainContext } from './MainPage';
import { docClient } from '../../AwsConfig';
import { DeleteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { useParams } from 'react-router-dom';

interface DeletePopUpProps {
  setDeleteState: Dispatch<SetStateAction<boolean>>;
  setClickedInvoice: Dispatch<SetStateAction<invoiceType | null>>;
  index: number;
}

export const DeletePopUp = (props: DeletePopUpProps) => {
  const mainContext = useContext(MainContext);
  const getInvoices = mainContext?.getInvoices;
  const email = useParams<{ email: string }>().email;
  console.log(props.index)
  const deleteInvoiceCommand = new UpdateCommand({
    TableName: "Users",
    Key: { email: email },
    UpdateExpression: `REMOVE invoices[${props.index}]`,
    ReturnValues: "UPDATED_NEW",
  })

  const onDelete = async () => {
    docClient.send(deleteInvoiceCommand).then((data) => {
      alert('Invoice deleted')
      console.log(data)
      getInvoices && getInvoices()
      props.setDeleteState(false)
      props.setClickedInvoice(null);
    }).catch((err) => {
      console.log(err)
    })
  }
    
  
  return (
    <div className='fixed mx-auto inset-0 my-auto rounded-md z-30 w-[100%] max-w-[480px] max-h-[249px] py-[3.1875rem] px-[3rem] flex flex-col bg-white opacity-100 dark:bg-black2'>
      <p className='font-bold text-[24px] tracking-[-0.5px] leading-[32px] text-black3 dark:text-white'>Confirm Deletion</p>
      <p className='font-medium text-[13px] tracking-[-0.1px] leading-[22px] text-grey mt-[.75rem] dark:text-light'>Are you sure you want to delete invoice #XM9141? This action cannot be undone.</p>
      <div className='flex justify-end gap-[1.5rem] mt-[2.5rem]'>
      <button className='w-[134px] h-[44px] bg-[#f9f9f9] text-black3 font-bold text-[15px] tracking-[-0.25px] rounded-md dark:bg-black3 dark:text-lightGrey' onClick={() => {props.setDeleteState(false)}}>Cancel</button>
        <button className='w-[134px] h-[44px] bg-[#ec5757] text-white font-bold text-[15px] tracking-[-0.25px] rounded-md ' onClick={() => {onDelete()}}>Delete</button>
      </div>
    </div>
  )
}
