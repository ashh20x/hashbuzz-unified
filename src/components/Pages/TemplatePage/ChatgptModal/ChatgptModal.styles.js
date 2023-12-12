import { Modal } from "@mui/material";
import styled from "styled-components";

export const StyledChatgptModal = styled(Modal)`
display: flex;
align-items: center;
.modal-box{
    background: #fff;
          border-radius: 8px;
          width: 500px;
          height: 500px;
          padding: 20px;
          margin: auto;
          overflow: scroll;
          -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;

}
.modal-box::-webkit-scrollbar {
  display: none;
}


.title{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#modal-modal-title{
    background: #c5b5c5;
    padding: 10px;
    border-radius: 10px;
    color: white;
}
#modal-modal-description{
    position: relative;
    .response{
        width: 80%;
        /* margin: auto; */
        display: flex;
        align-items: end;
        

        
        p{

            color: white;
            background: rgb(121, 91, 121);
            padding: ${(props)=>props.chatResponse? "10px":"0"};
    border-radius: 10px;
        }

    }
    .question{
        width: 60%;
        justify-content: end;
        display: flex;
        
        
        p{

            color: white;
            background: #c5b5c5;
            padding: ${(props)=>props.chatResponse? "10px":"0"};
    border-radius: 10px;
    width: 100%;
    word-break: break-word;
        }

    }
    .form{
        width: 100%;
        display: flex;
        margin-top: 250px;
        position: sticky;
        bottom: -10px;
    height: 60px;
    align-items: self-end;
    background: transparent;
    backdrop-filter: blur(10px);
        
        input{
            width: 90%;
            height: 40px;
            border: 1px solid #c5b5c5;
            border-radius: 10px;
            color: rgb(121 91 121);
            font-size: 20px;
            outline: 1px solid rgb(121 91 121);
            
           
        }
        button{
            width: 40px;
            padding: 0;
            border: none;
            background: transparent;
        }
    }
}
`