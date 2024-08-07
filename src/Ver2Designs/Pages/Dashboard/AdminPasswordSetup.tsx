import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Box, FormControl, FormHelperText, InputLabel, List, ListItem, OutlinedInput } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import * as React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { toast } from "react-toastify";
import { useApiInstance } from "../../../APIConfig/api";
import { useStore } from "../../../Store/StoreProvider";
import { getErrorMessage } from "../../../Utilities/helpers";
import { AdminPasswordFormState, CurrentUser, FormFelid } from "../../../types";

type CurrentFormState = AdminPasswordFormState & {
  confirmPassword: FormFelid<string>;
};

const FORM_INITIAL_STATE: CurrentFormState = {
  password: {
    value: "",
    error: false,
    helperText: "Enter a strong password",
    showPassword: false,
  },
  confirmPassword: {
    value: "",
    error: false,
    helperText: "Enter the password again",
    showPassword: false,
  },
};

const validateForm = (data: CurrentFormState, updateState: React.Dispatch<React.SetStateAction<CurrentFormState>>): boolean => {
  let isValid = true;

  //password regex
  const checkPasswordExp: RegExp = /^[a-zA-Z0-9!@#$%^&*)(+=._-]{8,}$/g;

  const password = data.password.value;
  const confirmPassword = data.confirmPassword.value;


  if (password.length < 8 || !checkPasswordExp.test(password)) {
    isValid = false;
    data.password.error = true;
    data.password.helperText = "A strong password with 8 or more that 8 character long";
  }
  if (password !== confirmPassword) {
    isValid = false;
    data.confirmPassword.error = true;
    data.confirmPassword.helperText = "Password and confirm password must be the same.";
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
      setAdminPassModalOpen(Boolean(["SUPER_ADMIN", "ADMIN"].includes(user.role) && !user.adminActive));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateForm(formData, setFormData);
    try {
      if (validation) {
        const response = await Admin.updatePassword({
          password: formData.password.value,
        });
        if (response.message) toast.success(response.message);
        // if (response.user && store?.updateState) store.updateState((_d) => ({ ..._d, currentUser: response.user }));
        if(response.user) store.dispatch({"type":"UPDATE_CURRENT_USER", payload:response.user})
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

  const handleClickShowPassword = (inputType: "password" | "confirmPassword") => {
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
        <DialogTitle id="twitter-concent-dialog-title">{"Set your admin password"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="twitter-concent-dialog-description">
            As you are an admin user so you are requested to set an admin password for accessing the Admin dashboard.
            <List>
              <ListItem>
                Password must be 8 or more that 8 character long. It should contains once uppercase , one lowercase , once numeric and special
                character
              </ListItem>
            </List>
          </DialogContentText>
          <Box>
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
                label="Confirm Password"
                type={formData.confirmPassword.showPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirm-password-input"
                placeholder="Enter a valid email"
                fullWidth
                error={formData.confirmPassword.error}
                //   helperText={formData.email.helperText}
                value={formData.confirmPassword.value}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleClickShowPassword("confirmPassword")}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {formData.confirmPassword.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                onChange={inputChangeHandler}
              />
              <FormHelperText error={formData.confirmPassword.error}>{formData.confirmPassword.helperText}</FormHelperText>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Disagree</Button> */}
          <Button type="submit" disableElevation variant="contained">
            Set Admin Password
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AdminPasswordSetup;
