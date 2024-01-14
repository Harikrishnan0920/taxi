import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Api_url } from "./env_variable";
import { toast } from "react-toastify";
import axios from "axios";
import { fetchUserDetails } from "./commonFuntions";
import Modal from 'react-modal';
import ReceiptModal from "../components/Reciept";
import { useNavigate } from "react-router-dom";

const ChatBox = ({
  roomId,
  firstmessage,
  booked,
  setBooked,
  driverData,
  handleDeleteCustomer,
  setuserDatasFetch,
  amount,//is in bookedby put a loop and take it out 
  Driverid,
  savepassengerDetails,
  logged,
  setdriverData
}) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [firstSend, setFirstSend] = useState(firstmessage ? true : false);
  const [finalPayment, SetFinalpayment] = useState(amount??null);
  const [ourSide, SetOurSide] = useState();
  const [confirm,setConfirm]=useState()
  const [openReciept,setOpenReciept]=useState(true)
  const Navigate = useNavigate();

useEffect(()=>{
  if(!driverData ){

SetFinalpayment(amount)
  
 let onAride= localStorage.getItem("booked")
 console.log(onAride)
  if(onAride?.includes(roomId)){
    setConfirm(true)
  }
  }
},[amount])

const customStylesForReciept = {
  content: {
    width: '50%',
    height: '50%', 
    margin: 'auto', 
  },
};

const receiptContent = `
  <div>
    <h2>Receipt</h2>
    <p>Transaction Date: ${new Date().toLocaleDateString()}</p>
    <p>Amount Paid: $${finalPayment}</p>
    <p>Driver ID: ${Driverid}</p>
    <p>Payment Method: Cash</p>
  </div>
`;

  useEffect(() => {
    let newSocket = io("http://localhost:8000");

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket");
      newSocket.emit("joinRoom", { roomId });
    });

    newSocket.on("message", (data) => {
      console.log("Received message:", data);
      debugger
      if (
        !booked  &&
        data?.text?.includes("Booking accepted with amount")
      ) {
        if(driverData){
        savepassengerDetails()
        }
        if(booked){ setBooked(true);
          updateBooking(data.text);
        }else{
        updateBooking(data.text,"bookthis");
        }
      }
      if(!driverData&&data.text.includes("**Driver Cancelled Booking**")){
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      }
      setMessages((prevMessages) => [...prevMessages, data]);
    });
   
    let sides = driverData ? "D" : "C";
    newSocket.on("negotiate", (prize) => {
      if (prize.side == sides) {
        SetOurSide(true);
      } else {
        SetOurSide(false);
      }

      SetFinalpayment(prize.text);
    });

    newSocket.on("confirmbooking",(confirm)=>{
    console.log(confirm)
    if(confirm.text==true){
      setConfirm(true)
      sides=="D"?localStorage.setItem(`booked`,roomId+","+driverData?._id,):localStorage.setItem("booked",roomId+","+Driverid)
      }else{
      if(sides=="D"){
        toast.success("Travel Completed")
        setTimeout(() => {
          
      
          window.location.reload()
        }, 3000);
      }
      localStorage.clear()
    }
    })

    newSocket.on("disconnect", (message) => {
      console.log(message);
    });

    setSocket(newSocket);

    if (firstSend) {
      setNewMessage(firstmessage);
      sendMessage();
      // Update state to false after sending the first message
    }

    // Clean up the socket connection when the component unmounts
    return () => newSocket.disconnect();
  }, [roomId]);

  const sendMessage = (initial, cancelMessage) => {
    // Send a message to the server
    debugger
    if (socket) {
      socket.emit("message", {
        roomId,
        text: cancelMessage
          ? cancelMessage
          : driverData
          ? "Driver: " + newMessage
          : "Passenger: " + newMessage,
      });
      // Clear the input field
      if(firstSend && amount) negotiateFunc()
      if(initial=="Driverquit") updateBooking(null, "cancel");
      if (firstSend && initial == "initalmessage") setFirstSend(false);
      setNewMessage("");
    }
    if (initial == "Userquit") {
      handleDeleteCustomer();
    }
  };

  const negotiateFunc = () => {
    SetOurSide(true);
    socket.emit("negotiate", {
      roomId,
      text: finalPayment,
      side: driverData ? "D" : "C",
    });
  };

  const Confirmed = () => {
  socket.emit("confirmbooking",{
roomId,
text:true

  })


  };

  const updateBooking = async (bookedby, fromDriver,tripcomplete) => {
    debugger
    try {
      const response = await axios.put(
        `${Api_url}/updateBooking/${
          fromDriver ? roomId : sessionStorage.getItem("uID")
        }`,
        {
          bookedby: bookedby,
          Username:fromDriver?"driver":"customer",
          driverid:fromDriver?sessionStorage.getItem("uID"):roomId
        }
      );

      if (response.data.statusCode == 200) {
        if (fromDriver=="cancel") {
          
          window.location.reload();
          return;
          
        }
        fetchUserDetails(setuserDatasFetch);
      }
      console.log(response.data.message);
    } catch (error) {
      if (fromDriver=="cancel") {
        
        
        
        window.location.reload();
        return;
      }
      if(tripcomplete){
        fetchUserDetails()
      }
      console.error("Error updating booking:", error);
    }
  };

  let removeCustomer = async (Tc) => {
    debugger
    if (driverData) {
      sendMessage("Driverquit","**Driver Cancelled Booking**")
  
      return;
    }

    setBooked(false);
    if(!Tc){
    sendMessage("Userquit", "**Customer Cancelled Booking**");
    }
    handleDeleteCustomer()
    updateBooking(null)


  };
 

  let travelComplete=()=>{
setConfirm(false)
      socket.emit("confirmbooking",{
roomId,
text:false
  })

  toast.success("Thank you , Book again for Quick rides")
  setTimeout(() => {

    setMessages([])
    removeCustomer("Travel complete")
  }, 3000);
  }

 
  console.log(firstSend);
  return (
    <div className="chat-box">
      <button
        onClick={() => {
          removeCustomer();
        }}
      >
        cancel booking
      </button>
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index}>{message.text}</div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        readOnly={firstSend}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button
        onClick={() => {
          sendMessage("initalmessage");
        }}
      >
        Send
      </button>
      {firstSend ? "!! Click send to Confirm booking" : ""}

      <div>
        <span>
          <input
            placeholder="Negotiate $"
            value={finalPayment}
            onChange={(e) => {
              SetFinalpayment(e.target.value), SetOurSide(e.target.value);
            }}
          ></input>
        </span>
        {confirm ? (
          <div>
         { !driverData?
         <div>
       <Modal
        isOpen={openReciept}
        onRequestClose={()=>{setOpenReciept(false)}}
        contentLabel="Reciept"
        style={customStylesForReciept}
      >
        <ReceiptModal receiptContent={receiptContent} onClose={()=>{setOpenReciept(false)}}/>
      </Modal>
         <button onClick={()=>{travelComplete()}}>CAB BOOKED ,click when the ride ends</button>
         </div>
         :
          <div>On trip </div>}
           </div>
        ) : (
          <span>
            {ourSide ? (
              <button
                onClick={() => {
                  negotiateFunc();
                }}
              >
                Negotiate
              </button>
            ) : (
              <button
                onClick={() => {
                  Confirmed()
                }}
              >
               { firstSend?"^":"Confirm to book in the amount or keep typing"}
              </button>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
// confirm button<-user if click prize of user sent will reciept come
// input box under negotiote <-user type prize click send button for that

// <--driver side button comes cofirm prise if confirm confirm
// <--withnegotiation box give prize

// <-go to user <confirm confirm

// confirm <- to who didnot request last
// input <- to who request last

// confirm <-
// input <-inputs value
// confirm <-lift it away from user

// user requested 2000
//<confirm button presents for driver
