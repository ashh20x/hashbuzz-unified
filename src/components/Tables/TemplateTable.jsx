import { TableBody, TableHead, TableRow } from "@mui/material";
import { templateHeadRow } from "../../Data/Template";
import {
  BorderlessCell,
  BorderlessHead,
  CustomRowHead,
  CustomTable,
  CustomTableRow,
  NumberInput,
} from "./CreateTable.styles";

import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
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
}) => {
  

  const [editIdx, setEditIdx] = useState(-1);

  const startEditing = (i) => {
    console.log("editing");
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
                <NumberInput name="reply" onChange={(e) => handleReply(e)} placeholder={reply} />
              ) : (
                reply + "h"
              )}
            </BorderlessCell>
            <BorderlessCell>
              {!editIdx ? (
                <NumberInput name="retweet" onChange={(e) => handleRetweet(e)} placeholder={retweet} />
              ) : (
                retweet + "h"
              )}
            </BorderlessCell>
            <BorderlessCell>
              {!editIdx ? (
                <NumberInput name="like" onChange={(e) => handleLike(e)} placeholder={like} />
              ) : (
                like + "h"
              )}
            </BorderlessCell>
            <BorderlessCell>
              {!editIdx ? (
                <NumberInput
                  name="download"
                  onChange={(e) => handleDownload(e)}
                  placeholder={download}
                />
              ) : (
                download + "h"
              )}
            </BorderlessCell>
            <BorderlessCell>
              {!editIdx ? (
                <NumberInput name="follow" onChange={(e) => handleFollow(e)} placeholder={follow} />
              ) : (
                follow + "h"
              )}
            </BorderlessCell>

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
