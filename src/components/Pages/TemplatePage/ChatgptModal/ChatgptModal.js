import React, { useState } from "react";
import { StyledChatgptModal } from "./ChatgptModal.styles";
import { Box, Typography } from "@mui/material";
import { IoIosSend } from "react-icons/io";
import { useApiInstance } from "../../../../APIConfig/api";
import { Loader } from "../../../Loader/Loader";
import { RxCross2 } from "react-icons/rx";

const ChatgptModal = ({ showChatModal, setShowChatModal }) => {
  const { Campaign } = useApiInstance();

  const handleClose = () => {
    setShowChatModal(false);
  };
  const [responseText, setResponseText] = useState();
  const [chatResponseBack, setChatResponseBack] = useState();
  const [question, setQuestion] = useState();
  const [showLoading, setShowLoading] = useState(false);
  const handleButtonClick = async (e) => {
    e.preventDefault();

    setShowLoading(true);
    const data = {
      message: responseText,
    };
    try {
      const response = await Campaign.chatResponse(data);
      setChatResponseBack(response?.message);
      setQuestion(responseText);

      setShowLoading(false);
      setResponseText("");
      console.log(response, "campaign message");
    } catch (error) {
      setShowLoading(false);
      console.log(error);
    }
  };
  console.log(responseText, "responseText");
  return (
    <StyledChatgptModal open={showChatModal} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" chatResponse={chatResponseBack}>
      <div className="modal-box"
        
      >
        <div className="title">
          <Typography id="modal-modal-title" variant="h6" component="span">
            Hey, wait for your response.....!
          </Typography>
          <RxCross2 size={20} color="rgb(121 91 121)" style={{ cursor: "pointer" }} onClick={handleClose} />
        </div>

        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <div className="fullBox" style={{width: "100%",justifyContent: "end", display:"flex"}}>

          <div className="question">
            <p>{question}</p>
          </div>
          </div>
          <div className="response">
            <p>{chatResponseBack}</p>
            {/* <TypeAnimation
      sequence={[
        // Same substring at the start will only be typed out once, initially
        chatResponseBack,
        1000, // wait 1s before replacing "Mice" with "Hamsters"
        
      ]}
      wrapper="span"
      speed={50}
      style={{ fontSize: '2em', display: 'inline-block' }}
      repeat={Infinity}
    /> */}
          </div>

          <form onSubmit={handleButtonClick} className="form">
            <input type="text" onChange={(e) => setResponseText(e.target.value)} value={responseText} required />
            <button type="submit">
              <IoIosSend size={30} color="rgb(121 91 121)" style={{ cursor: "pointer" }} />
            </button>
          </form>
        </Typography>
        <Loader open={showLoading} />
      </div>
    </StyledChatgptModal>
  );
};

export default ChatgptModal;
