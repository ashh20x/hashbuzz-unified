import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Box, List, ListItem, OutlinedInput, FormControl, TextField, InputLabel, FormHelperText, ListItemText } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import * as React from "react";
import { useApiInstance } from "../../../APIConfig/api";
import { useStore } from "../../../Providers/StoreProvider";
import { AdminPasswordFormState, CurrentUser, FormFelid } from "../../../types";
import { unstable_batchedUpdates } from "react-dom";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../Utilities/Constant";

type CurrentFormState =  AdminPasswordFormState & {
  conformPassword: FormFelid<string>;
}

const FORM_INITIAL_STATE:CurrentFormState = {
  email: {
    value: "",
    error: false,
    helperText: "Enter valid email, that you will use for further admin login",
  },
  password: {
    value: "",
    error: false,
    helperText: "Enter a strong password",
    showPassword: false,
  },
  conformPassword: {
    value: "",
    error: false,
    helperText: "Enter the password again",
    showPassword: false,
  },
};

const validateForm = (data: CurrentFormState, updateState: React.Dispatch<React.SetStateAction<CurrentFormState>>): boolean => {
  let isValid = true;

  //email regex
  const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const checkPasswordExp: RegExp = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,}$/g;

  const email = data.email.value;
  const password = data.password.value;
  const confirmPassword = data.conformPassword.value;

  if (!expression.test(email)) {
    isValid = false;
    data.email.error = true;
    data.email.helperText = "Enter email in correct format";
  }
  if (password.length < 8 || !checkPasswordExp.test(password)) {
    isValid = false;
    data.password.error = true;
    data.password.helperText = "A strong password with 8 or more that 8 character long";
  }
  if (password !== confirmPassword) {
    isValid = false;
    data.conformPassword.error = true;
    data.conformPassword.helperText = "Password and confirm password must be the same.";
  }

  updateState({ ...data });

  return isValid;
};

interface AdminPasswordSetupProps {
  user: CurrentUser;
}

const AdminPasswordSetup = ({ user }: AdminPasswordSetupProps) => {
  const [adminPassModalOpen, setAdminPassModalOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<CurrentFormState>(JSON.parse(JSON.stringify(FORM_INITIAL_STATE)));
  const { Admin } = useApiInstance();
  const store = useStore();

  //!! check for user state and update modal
  React.useEffect(() => {
    unstable_batchedUpdates(() => {
      setAdminPassModalOpen(Boolean(["SUPER_ADMIN", "ADMIN"].includes(user.role) && !user.emailActive));
      setFormData((__prev) => {
        __prev["email"].value = user.email;
        return { ...__prev };
      });
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateForm(formData, setFormData);
    try {
      if (validation) {
        const response = await Admin.updatePassword({
          email: formData.email.value,
          password: formData.password.value,
        });
        if (response.message) toast.success(response.message);
        if (response.user && store?.updateState) store.updateState((_d) => ({ ..._d, currentUser: response.user }));
        unstable_batchedUpdates(() => {
          setAdminPassModalOpen(false);
          setFormData(JSON.parse(JSON.stringify(FORM_INITIAL_STATE)));
        });
      }
    } catch (err) {
      //@ts-ignore
      toast.error(getErrorMessage(err));
    }
  };

  const handleClickShowPassword = (inputType: "password" | "conformPassword") => {
    setFormData((__prev) => {
      __prev[inputType].showPassword = !__prev[inputType].showPassword;
      return { ...__prev };
    });
  };
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((__prev) => {
      //@ts-ignore
      __prev[name].value = value;
      return { ...__prev };
    });
  };

  return (
    <Dialog
      open={adminPassModalOpen}
      onClose={(event, reason) => {}}
      aria-labelledby="twitter-concent-dialog-title"
      aria-describedby="twitter-concent-dialog-description"
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle id="twitter-concent-dialog-title">{"Reset your email & password"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="twitter-concent-dialog-description">
            As you are an admin user so you are requested to reset your email and password for accessing the Admin dashboard.
            <List>
              <ListItem>User your personal email</ListItem>
              <ListItem>
                Password must be 8 or more that 8 character long. It should contains once uppercase , one lowercase , once numeric and special
                character
              </ListItem>
            </List>
          </DialogContentText>
          <Box>
            <TextField
              label="Email"
              type={"email"}
              name="email"
              id="email"
              required
              placeholder="Enter a valid email"
              fullWidth
              error={formData.email.error}
              helperText={formData.email.helperText}
              value={formData.email.value}
              onChange={inputChangeHandler}
              sx={{ marginBottom: 1.25 }}
            />
            <FormControl fullWidth sx={{ marginBottom: 1.25 }} required>
              <InputLabel htmlFor="password-input">Password</InputLabel>
              <OutlinedInput
                label="Password"
                type={formData.password.showPassword ? "text" : "password"}
                name="password"
                id="password-input"
                placeholder="Enter a valid email"
                fullWidth
                error={formData.password.error}
                //   helperText={formData.email.helperText}
                value={formData.password.value}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleClickShowPassword("password")}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {formData.password.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                onChange={inputChangeHandler}
              />
              <FormHelperText error={formData.password.error}>{formData.password.helperText}</FormHelperText>
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: 1.25 }} required>
              <InputLabel htmlFor="confirm-password-input">Confirm password</InputLabel>
              <OutlinedInput
                label="Conform Password"
                type={formData.conformPassword.showPassword ? "text" : "password"}
                name="conformPassword"
                id="confirm-password-input"
                placeholder="Enter a valid email"
                fullWidth
                error={formData.conformPassword.error}
                //   helperText={formData.email.helperText}
                value={formData.conformPassword.value}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleClickShowPassword("conformPassword")}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {formData.conformPassword.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                onChange={inputChangeHandler}
              />
              <FormHelperText error={formData.conformPassword.error}>{formData.conformPassword.helperText}</FormHelperText>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Disagree</Button> */}
          <Button type="submit" disableElevation variant="contained">
            Update Email & Password
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AdminPasswordSetup;
