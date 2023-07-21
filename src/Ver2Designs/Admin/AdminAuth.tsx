import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Box, Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, Typography, useTheme } from "@mui/material";
import React from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useApiInstance } from "../../APIConfig/api";
import HashbuzzLogoMainTransparent from "../../SVGR/HashbuzzLogo";
import { AdminPasswordFormState } from "../../types";
import { getErrorMessage } from "../../Utilities/helpers";

const FORM_INITIAL_STATE: AdminPasswordFormState = {
  password: {
    value: "",
    error: false,
    helperText: "Enter a strong password",
    showPassword: false,
  },
};

const validateForm = (data: AdminPasswordFormState, updateState: React.Dispatch<React.SetStateAction<AdminPasswordFormState>>): boolean => {
  let isValid = true;
  const checkPasswordExp: RegExp = /^[a-zA-Z0-9!@#$%^&*)(+=._-]{8,}$/g;
  const password = data.password.value;

  if (password.length < 8 || !checkPasswordExp.test(password)) {
    isValid = false;
    data.password.error = true;
    data.password.helperText = "A strong password with 8 or more that 8 character long";
  }

  updateState({ ...data });

  return isValid;
};

const AdminAuth = () => {
  const theme = useTheme();
  const [formData, setFormData] = React.useState<AdminPasswordFormState>(JSON.parse(JSON.stringify(FORM_INITIAL_STATE)));
  const { Auth } = useApiInstance();
  const [cookies, setCookies] = useCookies(["adminToken"]);
  const navigate = useNavigate();

  React.useEffect(() =>{
    navigate("/admin");
  },[cookies.adminToken, navigate])

  const handleClickShowPassword = () => {
    setFormData((__prev) => {
      __prev.password.showPassword = !__prev.password.showPassword;
      return { ...__prev };
    });
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as "password";
    const value = event.target.value;

    setFormData((__prev) => {
      __prev[name].value = value;
      return { ...__prev };
    });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateForm(formData, setFormData);
    try {
      if (validation) {
        const response = await Auth.adminLogin({
          password: formData.password.value,
        });
        if (response.adminToken) toast.success("Logged in successfully");
        setCookies("adminToken", response.adminToken);
        // if (response.user && store?.updateState) store.updateState((_d) => ({ ..._d, currentUser: response.user }));
        // unstable_batchedUpdates(() => {
        //   setAdminPassModalOpen(false);
        //   setFormData(JSON.parse(JSON.stringify(FORM_INITIAL_STATE)));
        // });
      }
    } catch (err) {
      //@ts-ignore
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", height: "100vh", background: "hsl(0, 0%, 95%)" }}>
      <Box sx={{ width: 500 }}>
        <Box sx={{ textAlign: "center", marginBottom: 2 }}>
          <HashbuzzLogoMainTransparent height={100} />
          <Typography variant="h3" component={"h1"}>
            Hashbuzz Admin
          </Typography>
        </Box>
        <Box
          component={"form"}
          sx={{ boxShadow: theme.shadows[1], backgroundColor: "#E1D9FF", padding: 3, borderRadius: 2, marginTop: 15 }}
          onSubmit={handleFormSubmit}
        >
          <FormControl fullWidth sx={{ marginBottom: 1.25 }} required>
            <InputLabel htmlFor="#admin-auth-password-input">Password</InputLabel>
            <OutlinedInput
              label="Password"
              type={formData.password.showPassword ? "text" : "password"}
              name="password"
              id="admin-auth-password-input"
              placeholder="Enter your password"
              fullWidth
              error={formData.password.error}
              //   helperText={formData.email.helperText}
              value={formData.password.value}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleClickShowPassword()}
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
          <Box sx={{ marginBottom: 2, marginTop: 2, textAlign: "center" }}>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminAuth;
