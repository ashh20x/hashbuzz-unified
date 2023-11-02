import { TableBody, TableRow } from "@mui/material";
import { templateHeadRow } from "../../Data/Template";
import {
  BorderlessCell,
  BorderlessHead,
  CustomRowHead,
  CustomTable,
  CustomTableRow,
  NumberInput
} from "./CreateTable.styles";

import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { useStore } from "../../Store/StoreProvider";

export const TemplateTable = ({
  handleReply,
  handleRetweet,
  handleLike,
  handleDownload,
  handleFollow,
  reply,
  retweet,
  selectedToken,
  like,
  download,
  follow,
  quote
}) => {
  
const store = useStore()
  const [editIdx, setEditIdx] = useState(-1);

  const startEditing = (i) => {
    setEditIdx(i);
  };
  const stopEditing = () => {
    console.log("stopping...");
    setEditIdx(-1);
    console.log(retweet);
  };
  let currentToken = store?.balances?.filter(item=>
    item?.entityId === selectedToken
  );
  return (
    <CustomTable stickyHeader aria-label="simple table">
      <CustomRowHead>
        <TableRow>
          {templateHeadRow.map((item) => (
            <BorderlessHead
              key={item.id}
              align={item.align}
              style={{ minWidth: item.minWidth, width: item.width }}
            >
              {item.label}
            </BorderlessHead>
          ))}
        </TableRow>
      </CustomRowHead>
      <TableBody>
          <CustomTableRow selectable={false} >
            
            <BorderlessCell>
              {!editIdx ? (
                <NumberInput type='number' onKeyPress={(event) => {
                  if (event.code === 'Minus') {
                    event.preventDefault();
                  }
                }}
                step="0.1"
                min="0"
                name="like" onChange={(e) => handleLike(e)} placeholder={like} />
              ) : (
                like + `${currentToken?.[0]?.entityIcon ? currentToken?.[0]?.entityIcon: "ℏ"}`
              )}
            </BorderlessCell>
            <BorderlessCell>
              {!editIdx ? (
                <NumberInput type='number' min="0" onKeyPress={(event) => {
                  if (event.code === 'Minus') {
                    event.preventDefault();
                  }
                }}
                step="0.1" name="retweet" onChange={(e) => handleRetweet(e)} placeholder={retweet} />
              ) : (
                retweet + `${currentToken?.[0]?.entityIcon ? currentToken?.[0]?.entityIcon: "ℏ"}`
              )}
            </BorderlessCell>
           
            <BorderlessCell>
              {!editIdx ? (
                <NumberInput
                type='number' min="0" onKeyPress={(event) => {
                  if (event.code === 'Minus') {
                    event.preventDefault();
                  }
                }}
                step="0.1"
                  name="quote"
                  onChange={(e) => handleDownload(e)}
                  placeholder={quote}
                />
              ) : (
                quote + `${currentToken?.[0]?.entityIcon ? currentToken?.[0]?.entityIcon: "ℏ"}`
              )}
            </BorderlessCell>
            <BorderlessCell>
              {!editIdx ? (
                <NumberInput type='number' min="0" onKeyPress={(event) => {
                  if (event.code === 'Minus') {
                    event.preventDefault();
                  }
                }}
                step="0.1" name="comment" onChange={(e) => handleReply(e)} placeholder={reply} />
              ) : (
                reply + `${currentToken?.[0]?.entityIcon ? currentToken?.[0]?.entityIcon: "ℏ"}`
              )}
            </BorderlessCell>
            {/* <BorderlessCell>
              {!editIdx ? (
                <NumberInput name="follow" onChange={(e) => handleFollow(e)} placeholder={follow} />
              ) : (
                follow + `${currentToken?.[0]?.entityIcon ? currentToken?.[0]?.entityIcon: "ℏ"}`
              )}
            </BorderlessCell> */}

            <BorderlessCell>
              {editIdx ? (
                <EditIcon onClick={() => startEditing()} />
              ) : (
                <CheckIcon onClick={() => stopEditing()} />
              )}
            </BorderlessCell>
          </CustomTableRow>
      </TableBody>
    </CustomTable>
  );
};
