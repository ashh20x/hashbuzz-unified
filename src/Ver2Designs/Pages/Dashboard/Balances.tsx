import React, { useState } from "react";
import { cardStyle } from "./CardGenUtility";
import { Grid, Card, Stack, useMediaQuery, useTheme, Divider, Box, Typography, Avatar, Button, ButtonGroup } from "@mui/material";
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";
import HederaIcon from "../../../SVGR/HederaIcon";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { EntityBalances } from "../../../types";
import { useApiInstance } from "../../../APIConfig/api";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../Utilities/Constant";

interface BalanceObject {
  activeIndex: number;
  balances: EntityBalances[];
}
const INITIAL_BALANCES: BalanceObject = {
  activeIndex: 0,
  balances: [
    {
      entityBalance: "1234.1245",
      entityIcon: "ℏ",
      entitySymbol: "ℏ",
    },
  ],
};

const Balances = () => {
  const theme = useTheme();
  const aboveXs = useMediaQuery(theme.breakpoints.up("sm"));
  const [balances, setBalances] = useState<BalanceObject>(JSON.parse(JSON.stringify(INITIAL_BALANCES)));
  const { User } = useApiInstance();

  const topUpButtons = [
    <Button key="reimburse" startIcon={<RemoveCircle />} />,
    <Button key="top-up" startIcon={<AddCircle />}/>,
  ];

  const fetchTokenBalances = React.useCallback(() => {
    try {
      (async () => {
        const balancesData = await User.getTokenBalances();
        const formateBalanceRecord = balancesData.map((d) => ({
          entityBalance: d.available_balance.toFixed(4),
          entityIcon: d.token_symbol,
          entitySymbol: "",
        }));
        setBalances((_balances) => {
          _balances.balances = [..._balances.balances, ...formateBalanceRecord];
          return { ..._balances };
        });
      })();
    } catch (err) {
      toast.error(getErrorMessage(err));
      console.log(err);
    }
  }, [User]);

  React.useEffect(() => {
    fetchTokenBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBalanceNavigator = (navigate: "next" | "prev") => {
    setBalances((_bal) => {
      const index = _bal.activeIndex;
      const length = _bal.balances.length;
      if (navigate === "next") {
        _bal.activeIndex = index <= length - 1 ? index + 1 : 0;
      } else {
        _bal.activeIndex = index >= 0 ? index - 1 : length - 1;
      }
      // _bal.activeIndex = index < length - 1 && index > 0 ? (navigate === "next" ? index + 1 : index - 1) : navigate === "prev" ? length - 1 : 0;
      return { ..._bal };
    });
  };

  return (
    <Grid item lg={3} xl={3} md={4} sm={6} xs={6}>
      <Card elevation={0} sx={cardStyle}>
        <Stack direction={aboveXs ? "row" : "column"} alignItems={aboveXs ? "flex-start" : "normal"} sx={{ height: "100%", width: "100%" }}>
          <Stack
            direction={"row"}
            alignItems="center"
            justifyContent={"center"}
            sx={{
              color: "rgba(82, 102, 255, 0.5)",
              height: "100%",
              paddingRight: aboveXs ? 2 : 0,
              paddingBottom: aboveXs ? 0 : 2,
              fontSize: 48,
            }}
          >
            <HederaIcon fill="#fff" fillBg="rgba(82, 102, 255, 0.5)" size={48} />
          </Stack>
          <Divider orientation={aboveXs ? "vertical" : "horizontal"} />
          <Box sx={{ flexGrow: 1, flexBasis: 0, maxWidth: "100%", textAlign: "left", paddingLeft: 1, paddingRight: 1 }}>
            <Stack direction={"row"} alignItems="center" justifyContent={"space-between"} sx={{ marginBottom: 2 }}>
              <Typography variant="h6" sx={{ lineHeight: 1 }}>
                {" Balances(ℏ)"}
              </Typography>
              <ButtonGroup size="small" aria-label="Balance update group" sx={{ ".MuiButton-startIcon": { margin: 0 }, justifyContent: "center" }}>
                {topUpButtons}
              </ButtonGroup>
            </Stack>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <ButtonGroup size="small" aria-label="Balance display card" sx={{ ".MuiButton-startIcon": { margin: 0 }, justifyContent: "center" }}>
                <Button
                  key="next_button"
                  startIcon={<ArrowBackIos />}
                  disabled={balances.activeIndex === 0}
                  onClick={() => handleBalanceNavigator("prev")}
                />
                <BalanceCard
                  entityBal={balances.balances[balances.activeIndex].entityBalance}
                  entityIcon={balances.balances[balances.activeIndex].entityIcon}
                  entitySymbol={balances.balances[balances.activeIndex].entitySymbol}
                  key="balance_card"
                />
                <Button
                  key="prev_button"
                  startIcon={<ArrowForwardIos />}
                  disabled={balances.activeIndex === balances.balances.length - 1}
                  onClick={() => handleBalanceNavigator("next")}
                />
              </ButtonGroup>
            </Box>
          </Box>
        </Stack>
      </Card>
    </Grid>
  );
};

interface BalanceCardProps {
  entityBal: string | number;
  entityIcon: React.ReactNode;
  entitySymbol: string;
}

const BalanceCard = ({ entityBal, entityIcon, entitySymbol }: BalanceCardProps) => {
  const theme = useTheme();
  return (
    <Stack
      direction={"row"}
      component={Card}
      elevation={0}
      sx={{ padding: 0.5, display: "inline-flex", margin: "0 auto", borderRadius: 0, border: 1, borderColor: theme.palette.primary.main }}
    >
      <Avatar variant="rounded" sx={{ width: "24px", height: "24px" }}>
        {entityIcon ?? "ℏ"}
      </Avatar>
      <Stack spacing={0.25} sx={{ marginLeft: 0.5, marginRight: 0.5 }}>
        <Typography fontWeight={500} sx={{ textAlign: "center" }}>
          {entityBal ?? "124.5678"} {entitySymbol ?? "ℏ"}
        </Typography>
      </Stack>
    </Stack>
  );
};

{
  /* <Popper
  sx={{
    zIndex: 1,
  }}
  open={open}
  anchorEl={anchorRef.current}
  role={undefined}
  transition
  disablePortal
>
  {({ TransitionProps, placement }) => (
    <Grow
      {...TransitionProps}
      style={{
        transformOrigin: placement === "bottom" ? "center top" : "center bottom",
      }}
    >
      <Paper>
        <ClickAwayListener onClickAway={handleClose}>
          <MenuList id="split-button-menu" autoFocusItem>
            {options.map((option, index) => (
              <MenuItem key={option} disabled={index === 2} selected={index === selectedIndex} onClick={(event) => handleMenuItemClick(event, index)}>
                {option}
              </MenuItem>
            ))}
          </MenuList>
        </ClickAwayListener>
      </Paper>
    </Grow>
  )}
</Popper>; */
}

export default Balances;
