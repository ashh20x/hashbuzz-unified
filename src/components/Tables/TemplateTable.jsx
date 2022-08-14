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

export const TemplateTable = ({
  handleReply,
  handleRetweet,
  handleLike,
  handleDownload,
  handleFollow,
  reply,
  retweet,
  like,
  download,
  follow,
  quote
}) => {
  

  const [editIdx, setEditIdx] = useState(-1);

  const startEditing = (i) => {
    setEditIdx(i);
  };
  const stopEditing = () => {
    console.log("stopping...");
    setEditIdx(-1);
    console.log(retweet);
  };
  
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
                like + "ℏ"
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
                retweet + "ℏ"
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
                quote + "ℏ"
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
                reply + "ℏ"
              )}
            </BorderlessCell>
            {/* <BorderlessCell>
              {!editIdx ? (
                <NumberInput name="follow" onChange={(e) => handleFollow(e)} placeholder={follow} />
              ) : (
                follow + "ℏ"
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
