import React from "react";
import plus from "../../assets/icon-plus.svg";

type InvoiceBarProps = {
  setAddState: Function;
  numberOfInvoices: number;
};

export const InvoiceBar = (props: InvoiceBarProps) => {
  return (
    <div className="flex justify-between w-full mt-[36px] items-center h-auto md:mb-[2.4375rem] px-[1.5rem]">
      <div className="flex flex-col">
        <span className="text-[24px] font-bold tracking-[-0.75px] h-[22px] leading-4 md:textLg md:h-[33px] dark:text-white">
          Invoices
        </span>
        <span className="text-grey tracking-[-0.1px] font-medium h-[15px] leading-4 md:h-[15px] md:text-[13px] md:leading-[15px] md:tracking-[-0.1px] md:mt-[6px] dark:text-light">
          <span className="hidden md:inline">There are </span>
          {props.numberOfInvoices}{" "}
          <span className="hidden md:inline">total</span> invoices
        </span>
      </div>

      <button
        className="rounded-4xl bg-purple text-light w-[90px] h-[44px] flex items-center justify-between rounded-[4000px] md:w-[150px] md:h-[48px]  hover:opacity-80"
        onClick={() => {
          props.setAddState(true);
        }}
      >
        <div className="flex items-center justify-center bg-white ml-[6px] w-[32px] h-[32px] rounded-full ">
          <img src={plus} alt="plus" className="w-[10px] h-[10px]" />
        </div>

        <p className="text-white font-bold text-[15px] tracking-[-0.25px] mr-[15px]">
          New <span className="hidden md:inline">Invoice</span>
        </p>
      </button>
    </div>
  );
};
