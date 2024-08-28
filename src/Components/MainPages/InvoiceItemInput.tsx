import React, { Dispatch, SetStateAction, useEffect, useState, useContext } from 'react';
import { UserInput } from './SmallComponents/UserInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { InvoiceItemData } from '../Classes/InvoiceItemData';

type InvoiceItemInputProps = {
  invoiceItemData: Array<InvoiceItemData>,
  setInvoiceItemData: Dispatch<SetStateAction<Array<InvoiceItemData>>>
  setCompleteTotal: Dispatch<SetStateAction<number>>
  value?: InvoiceItemData[];
};

export const InvoiceItemInput = (props: InvoiceItemInputProps) => {
  const [name, setName] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number[]>([]);
  const [price, setPrice] = useState<number[]>([]);
  const [total, setTotal] = useState<number[]>([]);

  useEffect(() => {
    if (props.value) {
      props.setInvoiceItemData(props.value);
      const names = props.value.map(item => item.name || '');
      const quantities = props.value.map(item => item.quantity || 0);
      const prices = props.value.map(item => item.price || 0);
      const totals = props.value.map(item => (item.quantity || 0) * (item.price || 0));

      setName(names);
      setQuantity(quantities);
      setPrice(prices);
      setTotal(totals);
    }
  }, [props.value, props]);

  const onDelete = (index: number) => {
    const newInvoiceItems = props.invoiceItemData.filter((_, i) => i !== index);
    props.setInvoiceItemData(newInvoiceItems);
    setName(name.filter((_, i) => i !== index));
    setQuantity(quantity.filter((_, i) => i !== index));
    setPrice(price.filter((_, i) => i !== index));
    setTotal(total.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItemData, value: String | number) => {
    const newInvoiceItems = [...props.invoiceItemData];
    const changedItem = newInvoiceItems[index];

    if (field === 'name') {
      setName(name.map((name, i) => i === index ? value as string : name));
      changedItem.name = value as string;
    } else if (field === 'quantity') {
      setQuantity(quantity.map((qty, i) => i === index ? value as number : qty));
      changedItem.quantity = value as number
    } else if (field === 'price') {
      setPrice(price.map((price, i) => i === index ? value as number : price));
      changedItem.price = value as number;
    }

    // Recalculate the total
    const newTotal = [...total];
    newTotal.forEach((item, i) => {
      if (i === index) {
        newTotal[i] = Number(changedItem.quantity) * Number(changedItem.price);
      }
    });
    setTotal(newTotal);

    // Recalculate the total of all the invoices together
    var totalSum = 0;
    newTotal.forEach((item) => {
      totalSum += item;
    });
    props.setCompleteTotal(totalSum);

    changedItem.total = newTotal[index];

    props.setInvoiceItemData(newInvoiceItems.map((item, i) => i === index ? changedItem : item));
  };

  const handleAddNewItem = () => {
    const newItem = new InvoiceItemData();
    props.setInvoiceItemData([...props.invoiceItemData, newItem]);
    setName([...name, '']);
    setQuantity([...quantity, 0]);
    setPrice([...price, 0]);
    setTotal([...total, 0]);
  };

  return (
    <div className='flex flex-col items-center gap-[1.5rem] h-[300px] overflow-y-auto'>
      {props.invoiceItemData.length > 0 && (
        <>
          {props.invoiceItemData.map((item, index) => (
            <div key={index} className='flex flex-col md:flex-row md:gap-[1.5rem]'>
              <div className='md:min-w-[214px]'>
                <UserInput
                  header='Item Name'
                  index={index}
                  setValue={(value: string) => handleItemChange(index, 'name', value)}
                  value={name[index]}
                />
              </div>
              <div className='grid grid-cols-[2fr_3fr_3fr] gap-4 md:gap-[1.5rem]'>
                <UserInput
                  header='Qty.'
                  index={index}
                  setValue={(value: number) => handleItemChange(index, 'quantity', value)}
                  value={quantity[index]}
                />
                <UserInput
                  header='Price'
                  index={index}
                  setValue={(value: number) => handleItemChange(index, 'price', value)}
                  value={price[index]}
                />
                <div className='flex items-center'>
                  <div className='flex flex-col text-greyBlue w-[100%]'>
                    {index == 0 && <p className='hidden md:block text-[13px] tracking-[-0.1px] mt-[1.5rem]'>Total</p>}
                    <p className='mb-[9px] text-[13px] tracking-[-0.1px] mt-[1.5rem] md:hidden'>Total</p>
                    <input
                      className='w-[100%] h-[48px] rounded-md text-[15px] tracking-[-0.25px] font-bold md:bg-white dark:bg-inherit dark:text-lightGrey'
                      value={Number(item.quantity) * Number(item.price)}
                      disabled
                    />
                  </div>
                  <FontAwesomeIcon
                    icon={faTrash}
                    className='text-greyBlue ml-[0.625rem] self-end mb-4 cursor-pointer hover:text-red'
                    onClick={() => onDelete(index)}
                  />
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      <button
        className='bg-[#F9FAFE] text-greyBlue font-bold text-[15px] tracking-[-0.25px] w-[100%] min-h-[48px] rounded-[5000px] dark:bg-black3 dark:text-lightGrey'
        onClick={handleAddNewItem}
      >
        + Add New Item
      </button>
    </div>
  );
};
