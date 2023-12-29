import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import { IconButton, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
const TwitterTextField = () => {
  const [text, setText] = useState("");
  // const [wordCount, setWordCount] = useState(0);
  const MAX_WORD_COUNT = 280;

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const inputText = event.target.value;
    // setWordCount(words.length);
    setText(inputText);
  };

 

  return (
    <Stack sx={{ p:1, paddingBottom:0, border: "1px solid #cccc" , borderRadius:1 }}>
      <TextField
        multiline
        fullWidth
        // sx={{p:2}}
        // rows={""}
        variant="standard"
        // label="What's happening?"
        placeholder="What's happening?"
        value={text}
        onChange={handleTextChange}
        inputProps={{
          maxLength: MAX_WORD_COUNT,
        }}
      />
      <Stack sx={{ borderTop: "1px solid #ccc", padding: 1 }} direction={"row"} justifyContent={"space-between"}>
        <Typography>{`${text.length}/${MAX_WORD_COUNT}`}</Typography>
        <Stack direction={"row"} justifyContent={"flex-end"}>
          <IconButton>
            <InsertEmoticonIcon />
          </IconButton>
        </Stack>
      </Stack>
      {/*<Typography variant="body2" color={wordCount > MAX_WORD_COUNT ? 'error' : 'inherit'}>
        {text.length}/{MAX_WORD_COUNT}
      </Typography>*/}
      {/* <EmojiPicker onEmojiClick={handleEmojiSelect} /> */}
      {/* <Button variant="contained" onClick={handlePreviewClick}>
        Preview
      </Button>  */}
    </Stack>
  );
};

export default TwitterTextField;
