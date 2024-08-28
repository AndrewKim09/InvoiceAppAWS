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
import { DatePicker } from "./SmallComponents/DatePicker";
import { PaymentTerms } from "./SmallComponents/PaymentTerms";
import api from "../../api";
import { invoiceType } from "../Classes/InvoiceType";
import { AddingInvoiceType } from "../Classes/AddingInvoiceType";
import {MainContext} from "./MainPage";
import { docClient } from "../../AwsConfig";
import { PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { useParams } from "react-router-dom";
import {v4 as uuidv4} from 'uuid'

type AddingInvoiceProps = {
  setAddState: Function;
};

export const AddingInvoice = (props: AddingInvoiceProps) => {
  const email = useParams<{ email: string }>().email;
  //bill from info
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [postCode, setPostCode] = useState("");
  const [country, setCountry] = useState("");
  //client info
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientStreetAddress, setClientStreetAddress] = useState("");
  const [clientCity, setClientCity] = useState("");
  const [clientPostCode, setClientPostCode] = useState("");
  const [clientCountry, setClientCountry] = useState("");
  //invoice info
  const [invoiceDate, setInvoiceDate] = useState<string>("");
  const [invoiceDateDay, setInvoiceDateDay] = useState<number | undefined>();
  const [invoiceDateMonth, setInvoiceDateMonth] = useState<number | undefined>();
  const [invoiceDateYear, setInvoiceDateYear] = useState<number | undefined>();
  const [paymentTerms, setPaymentTerms] = useState<number | undefined>();
  const [paymentDue, setPaymentDue] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [total, setTotal] = useState<number>(0);

  //invoice item info
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItemData[]>([]);

  //date picker
  const [datePickerActive, setDatePickerActive] = useState(false);
  //payment terms
  const [selectPaymentTermsActive, setSelectPaymentTermsActive] = useState(false)

  const {getInvoices} = useContext(MainContext) || {};

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

  const checkFields = () => {
    const missingFields = [];
    if (streetAddress === "") missingFields.push("Street Address");
    if (city === "") missingFields.push("City");
    if (postCode === "") missingFields.push("Post Code");
    if (country === "") missingFields.push("Country");
    if (clientName === "") missingFields.push("Client Name");
    if (clientEmail === "") missingFields.push("Client Email");
    if (clientStreetAddress === "") missingFields.push("Client Street Address");
    if (clientCity === "") missingFields.push("Client City");
    if (clientPostCode === "") missingFields.push("Client Post Code");
    if (clientCountry === "") missingFields.push("Client Country");
    if (invoiceDateDay === undefined) missingFields.push("Invoice Date day");
    if (invoiceDateMonth === undefined) missingFields.push("Invoice Date month");
    if (invoiceDateYear === undefined) missingFields.push("Invoice Date year");
    if (paymentTerms === undefined) missingFields.push("Payment Terms");
    if (paymentDue === "") missingFields.push("Payment Due");
    if (projectDescription === "") missingFields.push("Project Description");
    if (invoiceItems.length === 0) missingFields.push("Invoice Items");
    if (total === 0) missingFields.push("Total");

    if (missingFields.length > 0) {
      alert(`Please fill in the following fields: ${missingFields.join(", ")}`);
      return false;
    }
    else{
      return true;
    }
  };

  const onSaveChanges = () => {
    console.log(
      streetAddress,
      city,
      postCode,
      country,
      clientName,
      clientEmail,
      clientStreetAddress,
      total,
      clientCity,
      clientPostCode,
      clientCountry,
      invoiceDateDay,
      invoiceDateMonth,
      invoiceDateYear,
      paymentTerms,
      paymentDue,
      projectDescription,
      invoiceItems
    );

      if(checkFields()){
        addInvoice();
      }
      else{
        return;
      }

    console.log("All fields filled");
  };

  function generateSixDigitKey() {
    const uuid = uuidv4();

    const digits = uuid.replace(/\D/g, '').slice(0, 6);

    return digits;
  }

  const addInvoice = () => {
    console.log("Adding invoice");
    const invoiceId = generateSixDigitKey();
    var newInvoice = new AddingInvoiceType(invoiceId, paymentDue, clientName, total, "pending", invoiceDate, paymentTerms || 0, projectDescription, clientEmail, { street: streetAddress, city: city, postCode: postCode, country: country }, { street: clientStreetAddress, city: clientCity, postCode: clientPostCode, country: clientCountry }, invoiceItems)
    newInvoice = JSON.parse(JSON.stringify(newInvoice));
    console.log(newInvoice);

    const updateCommand = new UpdateCommand({
      TableName: "Users",
      Key: { email: email },
      UpdateExpression: "SET invoices = list_append(if_not_exists(invoices, :empty_list), :new_invoice)",
      ExpressionAttributeValues: {
        ":new_invoice": [newInvoice],
        ":empty_list": [],
      },
      ReturnValues: "UPDATED_NEW",
    });

    docClient.send(updateCommand).then((data) => {
      console.log(data);
      alert("Invoice added successfully");
      getInvoices && getInvoices().then(() => {props.setAddState(false);})
      props.setAddState(false);
    }).catch((error) => {
      console.log(error);
    });
  }

  const setPaymentDueDate = () => {
    console.log(paymentTerms, invoiceDateDay, invoiceDateMonth, invoiceDateYear)
    if(paymentTerms != undefined && invoiceDateDay != undefined && invoiceDateMonth != undefined && invoiceDateYear != undefined){ 
      const newDay = invoiceDateDay + paymentTerms;
      if(newDay > months[invoiceDateMonth].days){
        const newMonth = invoiceDateMonth + 1;
        if(newMonth > 11){
          setPaymentDue(`${invoiceDateYear + 1}-${months[0].month}-${newDay - months[invoiceDateMonth].days}`);
        } else {
          setPaymentDue(`${invoiceDateYear}-${months[newMonth].month}-${newDay - months[invoiceDateMonth].days}`);
        }
      }
      else{
        setPaymentDue(`${invoiceDateYear}-${months[invoiceDateMonth].month}-${newDay}`);
      }
    }
    else{
      console.log("payment terms or invoice date not set")
    }
  }

  const TurnOffDatePicker = () => {
    setDatePickerActive(false);
  }

  const TurnOffSelectPaymentTerms = () => {
    setSelectPaymentTermsActive(false);
  }

  const onSaveAsDraft = () => {
    const invoiceId = generateSixDigitKey();
    const newInvoice = new AddingInvoiceType(
      invoiceId,
      paymentDue, 
      clientName, 
      total, 
      "draft", 
      invoiceDate, 
      paymentTerms || 0, 
      projectDescription, 
      clientEmail, 
      { street: streetAddress, city: city, postCode: postCode, country: country }, 
      { street: clientStreetAddress, city: clientCity, postCode: clientPostCode, country: clientCountry }, 
      invoiceItems)

    console.log(newInvoice);
    api.post("api/invoices/", newInvoice)
    .then((res) => {
      console.log(res.data);
      alert("Invoice saved as draft successfully");
      getInvoices && getInvoices().then(() => {props.setAddState(false);})
      props.setAddState(false);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    if(invoiceDateDay != undefined && invoiceDateMonth != undefined && invoiceDateYear != undefined){ 
      console.log(invoiceDateMonth)
      setInvoiceDate(`${invoiceDateDay}-${months[invoiceDateMonth].month}-${invoiceDateYear}`);
    }
    setPaymentDueDate();
  }, [paymentTerms, invoiceDateDay, invoiceDateMonth, invoiceDateYear])


  return (
    <div className="pt-[33px] px-[1.5rem] md flex flex-col w-[100%] z-20 bg-white absolute md:px-[3.5rem] rounded-r-2xl md:w-[80.2vw] xl:w-auto xl:left-0 xl:top-0 xl:right-[47.5rem] xl:min-w-[603px] dark:bg-black1">
      <div className="flex flex-col w-[100%] px-[24px] md:px-0">

        <p className="font-bold text-[24px] tracking-[-0.5px] mt-[1.625rem] dark:text-white">
          New Invoice
        </p>

        <p className="text-purple mt-[1.375rem] font-bold tracking-[-0.25px] ">
          Bill From
        </p>
        <UserInput header={"Street Address"} setValue={setStreetAddress} />

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

        <UserInput header={"Client Name"} setValue={setClientName} />
        <UserInput header={"Client Email"} setValue={setClientEmail} />
        <UserInput
          header={"Street Address"}
          setValue={setClientStreetAddress}
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
        />

        <p className="font-bold text-[18px] tracking-[-0.38px] mt-[4.3125rem] text-[#777F98]">
          Item List
        </p>

        <InvoiceItemInput
          invoiceItemData={invoiceItems}
          setInvoiceItemData={setInvoiceItems}
          setCompleteTotal={setTotal}
        />
      </div>

      <div className="w-[100] h-[91px] px-[1.5rem] flex justify-between items-center mt-[5.5rem] shadow-[0_-15px_30px_rgba(0,0,0,0.1)] mx-[-1.5rem]  md:shadow-none">
        <button className="rounded-[4000px] py-[1rem] bg-[#F9FAFE] text-greyBlue font-bold text-[15px] tracking-[-0.25px] px-[1.5rem] dark:text-lightGrey dark:bg-black3" onClick ={() => {props.setAddState(false)}}>
          Discard
        </button>
        <span>
          <button className="rounded-[4000px] py-[1rem] font-bold text-[15px] tracking-[-0.25px] px-[1.5rem] ml-[1rem] text-grey bg-black1 dark:bg-black4 dark:text-lightGrey" onClick={() => {onSaveAsDraft()}}>
            Save as Draft
          </button>
          <button
            className="rounded-[4000px] py-[1rem] bg-purple text-white font-bold text-[15px] tracking-[-0.25px] px-[1.5rem] ml-[1rem]"
            onClick={() => {
              onSaveChanges();
            }}
          >
            Save & send
          </button>
        </span>
      </div>
    </div>
  );
};
