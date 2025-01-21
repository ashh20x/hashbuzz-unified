import { QrCode2Outlined, Wallet } from '@mui/icons-material';
import { Button, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import React from "react";
import useMediaLocalQuery from '../../../../hooks/userMedisQuery';
import HashpackIcon from "../../../../SVGR/HashpackIcon";
import * as SC from './styles';
import { useHashconnectService } from '../../../../Wallet';
import { useConnectToExtension } from '../../../../Wallet/useConnectToExtension';
import { QRCodeDialog } from '../../../Components/SpeedDialActions';

const HeaderAction = () => {
    const isSmallScreen = useMediaLocalQuery('sm', 'down');
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const { pairingString, availableExtension } = useHashconnectService();
    const connectToExtension = useConnectToExtension();
    const [qrCodeOpen, setQrCodeOpen] = React.useState(false);


    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleConnectorButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.target as HTMLElement);
    }

    /** Qr code listner */

    const handleQrCodeGen = () => {
        if (pairingString) {
          handleClose();
          setQrCodeOpen(true);
        }
        handleClose();
      };


      /** On connect hashpack handler */
      const connectHashpack = async () => {
        try {
          if (isSmallScreen) {
            handleQrCodeGen();
          }
          if (availableExtension) {
            connectToExtension();
          } else {
            // await sendMarkOFwalletInstall();
            // Taskbar Alert - Hashpack browser extension not installed, please click on <Go> to visit HashPack website and install their wallet on your browser
            alert(
              "Alert - HashPack browser extension not installed, please click on <<OK>> to visit HashPack website and install their wallet on your browser.  Once installed you might need to restart your browser for Taskbar to detect wallet extension first time."
            );
            window.open("https://www.hashpack.app");
          }
        } catch (e) {
          console.log(e);
        }finally{
            handleClose();
        }
      };
    

    const isMenuOpen = Boolean(anchorEl);
    return (<>
        <SC.HeaderActionContainer className='w-full px-2 py-0 xl:-20 xl:py-2 2xl:py-4'>
            <div className='flex justify-end items-center  xl:h-24'>
                <Tooltip title="Connect with Wallet" arrow>
                    {isSmallScreen ? <IconButton onClick={handleConnectorButtonClick} color='primary' size='small'><Wallet /></IconButton> :
                        <Button variant="contained" color='primary' startIcon={<Wallet />} onClick={handleConnectorButtonClick} disableElevation>Connect</Button>}
                </Tooltip>
                <Menu
                    anchorEl={anchorEl}
                    id="wallet-connectors"
                    open={isMenuOpen}
                    onClose={handleClose}
                    onClick={handleClose}
                    slotProps={{
                        paper: {
                            elevation: 0,
                            sx: SC.ConnectorMenuListStyles(),
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={connectHashpack}>
                        <span className='inline-block mr-2'>
                            <HashpackIcon width={24} />
                        </span>
                        Haspack wallet
                    </MenuItem>
                    <MenuItem  onClick={handleQrCodeGen} >
                        <span className='inline-block mr-2'>
                            <QrCode2Outlined fontSize="medium" />
                        </span>
                        Qr Code
                    </MenuItem>
                </Menu>
            </div>
        </SC.HeaderActionContainer>
        <QRCodeDialog
        open={qrCodeOpen}
        onclose={() => {
          setQrCodeOpen(false);
          // handleClose()
        }}
      />
  </>  )
};

export default HeaderAction;