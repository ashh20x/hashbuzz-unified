import { AddCircle, ArrowBackIos, ArrowForwardIos, RemoveCircle } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Avatar, Box, Button, ButtonGroup, Card, Divider, Grid, Grow, ListItemAvatar, ListItemText, Paper, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popper from "@mui/material/Popper";
import React, { useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { toast } from "react-toastify";
import { useApiInstance } from "../../../APIConfig/api";
import { useStore } from "../../../Store/StoreProvider";
import HederaIcon from "../../../SVGR/HederaIcon";
import { BalOperation, EntityBalances } from "../../../types";
import { isAllowedToCmapigner, isAnyBalancesIsAvailable } from "../../../Utilities/helpers";
// import { useHashconnectService } from "../../../Wallet";
// import { useConnectToExtension } from "../../../Wallet/useConnectToExtension";
import { cardStyle } from "./CardGenUtility";
import TopupModal from "./TopupModal";

const formatBalance = (balObj: EntityBalances): string => {
  if (balObj) {
    const { entityBalance, entityType } = balObj;
    return entityType === "HBAR" ? (parseFloat(entityBalance) / 1e8).toFixed(4) : entityBalance;
  }
  return "";
};

const Balances = () => {
  const theme = useTheme();
  const aboveXs = useMediaQuery(theme.breakpoints.up("sm"));
  const store = useStore();
  const balances = store.balances;

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [topupModalData, setTopupModalData] = useState<EntityBalances | null>(null);

  // const { pairingData } = useHashconnectService();
  // const connectToExtension = useConnectToExtension();

  const { MirrorNodeRestAPI, User } = useApiInstance();
  const [balanceList, setBalanceList] = React.useState<{ operation: BalOperation }>({ operation: "topup" });
  const topUpButtonsListRef = React.useRef<HTMLDivElement>(null);
  const [entityListEl, setEntityEl] = React.useState<HTMLElement | null>(null);

  // open for the entityList popper state;
  const entityListOpen = Boolean(entityListEl);

  const handleBalanceNavigator = (navigate: "next" | "prev") => {
    setActiveIndex((index) => {
      const length = balances!.length;
      if (navigate === "next") {
        return index <= length - 1 ? index + 1 : 0;
      } else {
        return index >= 0 ? index - 1 : length - 1;
      }
    });
  };

  const handleCloseEntityList = (event: Event) => {
    if (topUpButtonsListRef.current && topUpButtonsListRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setEntityEl(null);
  };

  const handleMenuItemClick = async (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
    event.preventDefault();
    const entity = balances![index];
    if (balanceList.operation === "topup") {
      //Start Operation for the top up
      const accountId = "demo here"
      if (accountId) {
        // Request for the balances for the account id
        const accountBalReq = await MirrorNodeRestAPI.getBalancesForAccountId(accountId);
        const accountBal = accountBalReq.data.balances.find((b) => b.account === accountId);

        // User is asking for the topup of fiet hbar
        if (entity.entityType === "HBAR") {
          console.log("listed for the hbar", accountBal?.balance);
          if (accountBal?.balance) setTopupModalData(entity);
          else {
            alert("Insufficient balance");
            toast.warning("Insufficient fund to the account.");
          }
        } else {
          const tokenBalance = accountBal?.tokens.find((t) => t.token_id === entity.entityId);
          tokenBalance && tokenBalance.balance > 0 ? setTopupModalData(entity) : toast.warning(`Paired account have insufficient token balance for the token ${entity?.entityIcon}.`);
        }
      }
      setBalanceList((_d) => ({ ..._d, open: false }));
    } else {
      unstable_batchedUpdates(() => {
        setTopupModalData(entity);
        setBalanceList((_d) => ({ ..._d, open: false }));
      });
    }
  };

  const handleTopupOrReimClick = (operation: BalOperation, event?: React.MouseEvent) => {
    // event?.preventDefault();
    // if (!pairingData) {
    //   toast.warning("Connect wallet first then retry topup.");
    //   connectToExtension();
    // } else {
    //   unstable_batchedUpdates(() => {
    //     setBalanceList({
    //       operation,
    //     });
    //     //@ts-ignore
    //     setEntityEl(event ? event?.target : topUpButtonsListRef.current);
    //   });
    // }
  };

  // const syncBalance = async (evennt: React.MouseEvent) => {
  //   const tokenId = balances![activeIndex].entityId;
  //   const data = await User.syncTokenBal(tokenId);
  //   console.log(data);
  //   const newBalnnces =  store.balances.map((bal) => {
  //     if (bal.entityId !== tokenId) return bal;
  //     return { ...bal, entityBalance: (data.balance/10**(bal.decimals??6)).toFixed(4) };
  //   });
  //   store.dispatch({type:"SET_BALANCES", payload:[...newBalnnces]});
  // };

  //update balance on the first mount
  // useEffect(()=> {
  //   console.log("i am calld")
  //   // checkAndUpdateEntityBalances();
  // },[])

  const topUpButtons = [<Button key="reimburse" startIcon={<RemoveCircle />} disabled={!isAllowedToCmapigner(store?.currentUser?.role)} title="Reimburse from hashbuzz contract to your wallet" onClick={() => handleTopupOrReimClick("reimburse")} />, <Button key="top-up" disabled={!isAllowedToCmapigner(store?.currentUser?.role)} startIcon={<AddCircle />} onClick={() => handleTopupOrReimClick("topup")} title="Topup your hashbuzz account for the campaign" />];



  return (
    <React.Fragment>
      <Grid item lg={3} xl={3} md={4} sm={6} xs={6}>
        <Card elevation={0} sx={cardStyle}>
          <Stack direction={aboveXs ? "row" : "column"} alignItems={aboveXs ? "flex-start" : "normal"} sx={{ height: "100%", width: "100%", overflowY: "auto" }}>
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
              <Stack direction={"row"} alignItems="center" justifyContent={"space-between"} sx={{ marginBottom: 2, height: 30 }}>
                <Typography variant="h6" sx={{ lineHeight: 1 }}>
                  {"Balances"}
                </Typography>
                {/* {balances  && balances[activeIndex] && balances[activeIndex].entityType !== "HBAR" && (
                  <IconButton size="small" title="sync balance from contract" onClick={syncBalance}>
                    <SyncIcon fontSize="inherit" />
                  </IconButton>
                )} */}
                {balances && balances?.length > 0 ? (
                  <ButtonGroup size="small" aria-label="Balance update group" sx={{ ".MuiButton-startIcon": { margin: 0 }, justifyContent: "center" }} ref={topUpButtonsListRef}>
                    {topUpButtons}
                  </ButtonGroup>
                ) : null}
              </Stack>
              {balances && isAnyBalancesIsAvailable(balances) ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <ButtonGroup size="small" aria-label="Balance display card" sx={{ ".MuiButton-startIcon": { margin: 0 }, justifyContent: "center" }}>
                    <Button key="next_button" startIcon={<ArrowBackIos />} disabled={activeIndex === 0} onClick={() => handleBalanceNavigator("prev")} />
                    <BalanceCard
                      entityBal={
                        //balances![activeIndex].entityType === "HBAR" ? (parseFloat(balances![activeIndex].entityBalance)/1e8).toFixed(4):balances![activeIndex].entityBalance}
                        formatBalance(balances[activeIndex])
                      }
                      entityIcon={balances[activeIndex]?.entityIcon}
                      // entitySymbol={balances[activeIndex]?.entitySymbol}
                      key="balance_card"
                    />
                    <Button key="prev_button" startIcon={<ArrowForwardIos />} disabled={activeIndex === balances!.length - 1} onClick={() => handleBalanceNavigator("next")} />
                  </ButtonGroup>
                </Box>
              ) : (
                <Stack sx={{ marginTop: 3 }} direction={"row"} justifyContent={"center"}>
                  <Button
                    variant="contained"
                    disableElevation
                    sx={{ width: 120, margin: "0  auto" }}
                    // startIcon={<HederaIcon size={20} fill="white" />}
                    startIcon={"ℏ"}
                    disabled={!isAllowedToCmapigner(store?.currentUser?.role)}
                    endIcon={<KeyboardArrowDownIcon />}
                    onClick={(event) => handleTopupOrReimClick("topup", event)}
                  >
                    Topup
                  </Button>
                </Stack>
              )}
            </Box>
          </Stack>
          <Popper
            sx={{
              zIndex: 1,
            }}
            open={entityListOpen}
            anchorEl={entityListEl}
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
                  <ClickAwayListener onClickAway={handleCloseEntityList}>
                    <MenuList id="entityList-for-topup" autoFocusItem>
                      {balances!.map((bal, index) => (
                        <MenuItem disabled={!isAllowedToCmapigner(store?.currentUser?.role)} onClick={(event) => handleMenuItemClick(event, index)}>
                          <ListItemAvatar>{bal?.entityIcon}</ListItemAvatar>
                          <ListItemText>
                            {formatBalance(bal)} {bal.entitySymbol + " "}
                          </ListItemText>
                          {balanceList.operation === "reimburse" ? (
                            <Typography variant="body2" color="text.secondary">
                              {"(max)"}
                            </Typography>
                          ) : null}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Card>
      </Grid>
      <TopupModal data={topupModalData} open={Boolean(topupModalData)} onClose={() => setTopupModalData(null)} operation={balanceList.operation} />
    </React.Fragment>
  );
};

interface BalanceCardProps {
  entityBal: string | number;
  entityIcon: React.ReactNode;
}

const BalanceCard = ({ entityBal, entityIcon }: BalanceCardProps) => {
  const theme = useTheme();
  return (
    <Stack direction={"row"} component={Card} elevation={0} sx={{ padding: 0.5, display: "inline-flex", margin: "0 auto", borderRadius: 0, border: 1, borderColor: theme.palette.primary.main }}>
      <Avatar variant="rounded" sx={{ width: "auto", height: "auto", padding: "5px" }}>
        {entityIcon ?? "HBAR"}
      </Avatar>
      <Stack spacing={0.25} sx={{ marginLeft: 0.5, marginRight: 0.5 }}>
        <Typography fontWeight={500} sx={{ textAlign: "center" }}>
          {entityBal ?? "124.5678"}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Balances;
