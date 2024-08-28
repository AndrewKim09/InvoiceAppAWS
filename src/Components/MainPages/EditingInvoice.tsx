import {
  faAngleDown,
  faAngleUp,
  faArrowLeft,
  faBackspace,
  faBackward,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, useContext, useEffect, useState } from "react";
import { UserInput } from "./SmallComponents/UserInput";
import { InvoiceItemInput } from "./InvoiceItemInput";
import { InvoiceItemData } from "../Classes/InvoiceItemData";
import { invoiceType } from "../Classes/InvoiceType";
import { DatePicker } from "./SmallComponents/DatePicker";
import { PaymentTerms } from "./SmallComponents/PaymentTerms";
import { moveSyntheticComments, setConstantValue } from "typescript";
import { AddingInvoiceType } from "../Classes/AddingInvoiceType";
import api from "../../api";
import { MainContext } from "./MainPage";
import { PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { useParams } from "react-router-dom";
import { docClient } from "../../AwsConfig";

type AddingInvoiceProps = {
  setEditState: React.Dispatch<React.SetStateAction<boolean>>;
  invoice: invoiceType;
  setClickedInvoice: Dispatch<invoiceType | null>;
  indexToEdit: number;
};

export const EditingInvoice = (props: AddingInvoiceProps) => {
  const email = useParams<{ email: string }>().email;
  const {getInvoices} = useContext(MainContext) || {};
  //bill from info
  const [streetAddress, setStreetAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [postCode, setPostCode] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  //client info
  const [clientName, setClientName] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [clientStreetAddress, setClientStreetAddress] = useState<string>("");
  const [clientCity, setClientCity] = useState<string>("");
  const [clientPostCode, setClientPostCode] = useState<string>("");
  const [clientCountry, setClientCountry] = useState<string>("");
  //invoice info
  const [invoiceDate, setInvoiceDate] = useState<string>("");
  const [invoiceDateDay, setInvoiceDateDay] = useState<number| undefined>();
  const [invoiceDateMonth, setInvoiceDateMonth] = useState<number| undefined>();
  const [invoiceDateYear, setInvoiceDateYear] = useState<number| undefined>();
  const [paymentTerms, setPaymentTerms] = useState<number | undefined>();
  const [paymentDue, setPaymentDue] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [projectDescription, setProjectDescription] = useState<string>("");
  //invoice item info
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItemData[]>([]);

  //states
  const [datePickerActive, setDatePickerActive] = useState<boolean>(false);
  const [selectPaymentTermsActive, setSelectPaymentTermsActive] = useState<boolean>(false);

  useEffect(() => {
    setStreetAddress(props.invoice.senderAddress.street);
    setCity(props.invoice.senderAddress.city);
    setPostCode(props.invoice.senderAddress.postCode);
    setCountry(props.invoice.senderAddress.country);
    //client info
    setClientName(props.invoice.clientName);
    setClientEmail(props.invoice.clientEmail);
    setClientStreetAddress(props.invoice.clientAddress.street);
    setClientCity(props.invoice.clientAddress.city);
    setClientPostCode(props.invoice.clientAddress.postCode);
    setClientCountry(props.invoice.clientAddress.country);
    //invoice info
    setTotal(props.invoice.total);
    setInvoiceDate(props.invoice.createdAt);
    setPaymentTerms(props.invoice.paymentTerms);
    setPaymentDue(props.invoice.paymentDue);
    setProjectDescription(props.invoice.description);
    setInvoiceItems(
      props.invoice.items.map((item) => ({
        name: item.name || "", // Provide a default value if name is undefined
        quantity: item.quantity || 0,
        price: item.price || 0,
        total: item.total || 0,
      })) as InvoiceItemData[]
    );

    //get the days of the invoice date
    const date = props.invoice.createdAt.split("-");
    setInvoiceDateDay(Number(date[2]));
    setInvoiceDateMonth(Number(date[1]));
    setInvoiceDateYear(Number(date[0]));

    console.log(props.invoice)
  }, [props.invoice]);

  const months = [
    { days: 31, month: "Jan" },
    { days: 28, month: "Feb" },
    { days: 31, month: "Mar" },
    { days: 30, month: "Apr" },
    { days: 31, month: "May" },
    { days: 30, month: "Jun" },
    { days: 31, month: "Jul" },
    { days: 31, month: "Aug" },
    { days: 30, month: "Sep" },
    { days: 31, month: "Oct" },
    { days: 30, month: "Nov" },
    { days: 31, month: "Dec" },
  ]

  useEffect(() => {
    if (invoiceDateDay && invoiceDateMonth && invoiceDateYear) {
      setInvoiceDate(`${invoiceDateDay}-${months[invoiceDateMonth].month}-${invoiceDateYear}`);
    }
  }, [invoiceDateDay, invoiceDateMonth, invoiceDateYear]);

  const onSaveChanges = () => {
    console.log(
      streetAddress,
      city,
      postCode,
      country,
      clientName,
      clientEmail,
      clientStreetAddress,
      clientCity,
      clientPostCode,
      clientCountry,
      invoiceDate,
      paymentTerms,
      paymentDue,
      projectDescription,
      invoiceItems
    );

    if (
      streetAddress === "" ||
      city === "" ||
      postCode === "" ||
      country === "" ||
      clientName === "" ||
      clientEmail === "" ||
      clientStreetAddress === "" ||
      clientCity === "" ||
      clientPostCode === "" ||
      clientCountry === "" ||
      invoiceDate === "" ||
      paymentTerms === undefined ||
      paymentDue === "" ||
      projectDescription === "" ||
      invoiceItems.length == 0
    ) {
      alert("Please fill in all fields");
      return;
    }

    for (let i = 0; i < invoiceItems.length; i++) {
      if (
        invoiceItems[i].name === "" ||
        invoiceItems[i].price === 0 ||
        invoiceItems[i].quantity === 0
      ) {
        alert("Please fill in all fields");
        return;
      }
    }

    console.log("All fields filled");
    const newInvoice = new AddingInvoiceType(props.invoice.id, paymentDue, clientName, total, "pending", invoiceDate, paymentTerms || 0, projectDescription, clientEmail, { street: streetAddress, city: city, postCode: postCode, country: country }, { street: clientStreetAddress, city: clientCity, postCode: clientPostCode, country: clientCountry }, invoiceItems)
    const updateCommand = new UpdateCommand({
      TableName: "Users",
      Key: { email: email },
      UpdateExpression: "SET invoices[:index] = :new_invoice",
      ExpressionAttributeValues: {
        ":new_invoice": [newInvoice],
        ":index": props.indexToEdit,
      },
      ReturnValues: "UPDATED_NEW",
    });
    docClient.send(updateCommand).then((data) => {
      console.log(data);
      getInvoices && getInvoices().then(() => { props.setEditState(false); props.setClickedInvoice(null); });
    }).catch((err) => {
      console.log(err);
    });
  };

  const TurnOffSelectPaymentTerms = () => {
    setSelectPaymentTermsActive(false);
  }

  const TurnOffDatePicker = () => {
    setDatePickerActive(false);
  }

  return (
    <div className="pt-[33px] px-[1.5rem] flex flex-col w-[100%] z-20 bg-white absolute rounded-r-2xl md:w-[80.2vw] xl:w-auto xl:left-0 xl:top-0 xl:right-[47.5rem] dark:bg-black1">
      <div className="flex flex-col w-[100%] px-[24px] md:px-[3.5rem]">

        <p className="font-bold text-[24px] tracking-[-0.5px] mt-[1.625rem] dark:text-white">
          Edit <span className="text-grey">#</span><span className=" text-black1 dark:text-white">{props.invoice.id}</span>
        </p>

        <p className="text-purple mt-[1.375rem] font-bold tracking-[-0.25px] ">
          Bill From
        </p>
        <UserInput header={"Street Address"} setValue={setStreetAddress} value={streetAddress}/>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 ">
          <UserInput header={"City"} setValue={setCity} value={city} />
          <UserInput
            header={"Post Code"}
            setValue={setPostCode}
            value={postCode}
          />
          <div className="w-[100%] col-span-2 md:col-span-1">
            <UserInput header={"Country"} setValue={setCountry} value={country} />
          </div>
        </div>

        <p className="text-purple font-bold text-[15px] tracking-[-0.25px] mt-[2.5625rem]">
          Bill To
        </p>

        <UserInput header={"Client Name"} setValue={setClientName} value={clientName}/>
        <UserInput header={"Client Email"} setValue={setClientEmail} value={clientEmail}/>
        <UserInput
          header={"Street Address"}
          setValue={setClientStreetAddress}
          value={clientStreetAddress}
        />
       <div className="grid grid-cols-2 gap-4 md:grid-cols-3 ">
          <UserInput header={"City"} setValue={setClientCity} value={clientCity} />
          <UserInput
            header={"Post Code"}
            setValue={setClientPostCode}
            value={clientPostCode}
          />
          <div className="w-[100%] col-span-2 md:col-span-1">
            <UserInput header={"Country"} setValue={setClientCountry} value={clientCountry} />
          </div>
        </div>
        <div className="md:flex md:gap-[1.5rem]">
          <span className="w-[50%] relative">
            <UserInput header={"Invoice Date"} setValue={setInvoiceDateDay} value={invoiceDate} disabled={true}/>
            {datePickerActive && <DatePicker month={1} year={2021} setInvoiceDateDay={setInvoiceDateDay} setInvoiceDateMonth={setInvoiceDateMonth} setInvoiceDateYear={setInvoiceDateYear} TurnOffDatePicker={TurnOffDatePicker}/>}
            <FontAwesomeIcon icon={faCalendar} className="absolute bottom-[1rem] right-[1rem] text-[#7C5DFA] cursor-pointer" onClick={() => {setDatePickerActive(!datePickerActive)}}/>
          </span>
          <span className="w-[50%] relative">
            <UserInput header={"Payment Terms"} setValue={setPaymentTerms} value={ `Net ${paymentTerms ? paymentTerms : "?"} Day${paymentTerms == 1 ? "" : "s"}`} disabled={true}/>
            {selectPaymentTermsActive && <PaymentTerms setPaymentTerms={setPaymentTerms} TurnOffSelectPaymentTerms={TurnOffSelectPaymentTerms}/>}
            <FontAwesomeIcon icon={selectPaymentTermsActive ? faAngleDown : faAngleUp} className="absolute bottom-[1rem] right-[1rem] text-[#7C5DFA] cursor-pointer" onClick={() => {setSelectPaymentTermsActive(!selectPaymentTermsActive)}}/>
          </span>
        </div>
        <UserInput
          header={"Project Description"}
          setValue={setProjectDescription}
          value={projectDescription}
        />

        <p className="font-bold text-[18px] tracking-[-0.38px] mt-[4.3125rem] text-[#777F98]">
          Item List
        </p>

        <InvoiceItemInput
          invoiceItemData={invoiceItems}
          setInvoiceItemData={setInvoiceItems}
          setCompleteTotal={setTotal}
          value={invoiceItems}
        />
      </div>

      <div className="w-[100] h-[91px] pr-[1.5rem] flex justify-end items-center mt-[5.5rem] shadow-[0_-15px_30px_rgba(0,0,0,0.1)] mx-[-1.5rem] md:shadow-none">
        <button className="rounded-[4000px] py-[1rem] bg-[#F9FAFE] text-greyBlue font-bold text-[15px] tracking-[-0.25px] px-[1.5rem] hover:opacity-80" onClick ={() => {props.setEditState(false)}}>
          Cancel
        </button>
        <button
          className="rounded-[4000px] py-[1rem] bg-purple text-white font-bold text-[15px] tracking-[-0.25px] px-[1.5rem] ml-[1rem] hover:opacity-80"
          onClick={() => {
            onSaveChanges();
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
