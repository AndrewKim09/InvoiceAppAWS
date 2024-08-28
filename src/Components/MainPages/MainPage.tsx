import React, { useEffect, useState, createContext, Dispatch} from "react";
import { NavBar } from "./NavBar";
import { InvoiceBar } from "./InvoiceBar";
import { Invoices } from "./Invoices";
import { AddingInvoice } from "./AddingInvoice";
import { invoiceType } from "../Classes/InvoiceType";
import { ClickedInvoiceExpand } from "./ClickedInvoiceExpand";
import data from "../../assets/data.json";
import api from "../../api";
import { docClient } from "../../AwsConfig";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { useParams } from "react-router-dom";

type MainContextType = {
  getInvoices: Function;
}

const MainContext = createContext<null | MainContextType>(null);

function App() {
  const [addState, setAddState] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [clickedInvoice, setClickedInvoice] = useState<invoiceType | null>(
    null
  );
  const [apiData, setApiData] = useState<invoiceType[]>([]);
  const [fetchedData, setFetchedData] = useState(data);
  const [editState, setEditState] = useState(false);
  const [addStateHeight, setAddStateHeight] = useState("h-[1655.5px]");

  const email = useParams<{ email: string }>().email;

  const MainProvider = ({ children }: { children: React.ReactNode }) => {
    return (
      <MainContext.Provider value={{ getInvoices }}>
        {children}
      </MainContext.Provider>
    );
  }

  const toggleNightMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    setAddStateHeight(addStateHeight);
  }, [addStateHeight]);

  const getInvoices = async () => {
    const command = new GetCommand({
      TableName: "Users",
      Key: {
        email: email
      }
    })

    docClient.send(command).then((data) => {
      if(data.Item)
        setApiData(data.Item.invoices);
      else
        alert('user not found')
    }).catch((err) => {
      console.log(err)
    })
  }

  useEffect(() => {
    console.log(apiData);
  }, [apiData]);

  useEffect(() => {
    getInvoices();
  }, []);

  return (
    <MainProvider>
    <div className="flex flex-col xl:flex-row min-h-[100vh] h-auto dark:bg-black1 App ">
      <NavBar toggleNightMode={toggleNightMode} darkMode={darkMode} />
      <div
        className={`w-[100%] h-[100%] grow xl:grow-0 xl:px-0 xl:w-[100%] xl:pt-[4.0625rem] xl:pb-[3.375rem] relative ${
          addState || editState ? "h-[1936.5px] md:h-[1605.5px]" : 'max-h-[100%]'
        }`}
      >
        <div
          className="xl:w-[50.7vw] w-[100%] h-[100%] flex flex-col md:mx-auto"
        >
          {addState && <AddingInvoice setAddState={setAddState} />}
          {addState && <div className="absolute top-0 bottom-0 left-0 right-0 z-10 hidden bg-black opacity-20 md:block"></div>}
          {clickedInvoice ? (
            <ClickedInvoiceExpand
              index={apiData.indexOf(clickedInvoice)}
              editState={editState}
              setEditState={setEditState}
              invoice={clickedInvoice}
              setClickedInvoice={setClickedInvoice}
            />
          ) : (
            <>
              <InvoiceBar
                setAddState={setAddState}
                numberOfInvoices={fetchedData.length}
              />
              <div className="flex flex-col h-[100%] w-[100%] px-[1.5rem]">
                <Invoices
                  setAddState={setAddState}
                  setClickedInvoice={setClickedInvoice}
                  fetchedData={apiData}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </MainProvider>
  );
}

export default App;  export type { MainContextType }; export { MainContext };

