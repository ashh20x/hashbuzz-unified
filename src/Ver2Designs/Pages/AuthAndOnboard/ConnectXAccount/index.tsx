import { useLazyGetTwitterPersonalHandleQuery } from "@/API/integration";
import PrimaryButtonV2 from "@/components/Buttons/PrimaryButtonV2";
import ChatText from "@/SVGR/ChatText";
import HederaIcon from "@/SVGR/HederaIcon";
import PencilSimple from "@/SVGR/PencilSimple";
import UserIcon from "@/SVGR/UserIcon";
import XPlatformIcon from "@/SVGR/XPlatformIcon";
import { LinkSharp } from "@mui/icons-material";
import { Alert, Box, Stack } from "@mui/material";
import { useLocation } from "react-router-dom";
import SectionHeader from "../Components/SectionHeader";
import * as styles from "./styles";

const permissions = [
  {
    icon: <UserIcon fill="#434343" size={24} />,
    text: "Access your 𝕏 account's public profile.",
  },
  {
    icon: <PencilSimple size={24} />,
    text: "Post on your behalf.",
  },
  {
    icon: <ChatText size={24} />,
    text: "Interact with your account (Posts and reposts or threads).",
  },
];

const ConnectXAccount = () => {
  const location = useLocation();
  const [getTwitterPersonalHandle, {isLoading:isLoadingTwitterHandle}] = useLazyGetTwitterPersonalHandleQuery();

  const handleConnectXAccount = async () => {
    try {
      const { url } = await getTwitterPersonalHandle().unwrap();
      // Navigate to X OAuth in the same window for stateful callback
      window.location.href = url;
    } catch (error) {
      console.error('Error getting Twitter auth URL:', error);
    }
  };

  // Check for error from navigation state (e.g., from failed callback)
  const errorFromState = location.state?.error;

  return (
    <Box sx={styles.connectXAccountStyles}>
      <Box id="content-container">
        <SectionHeader
          title="Connect your 𝕏 account"
          subtitle="Securely link your 𝕏 account to start earning with Hashbuzz."
        />
        
        {errorFromState && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorFromState}
          </Alert>
        )}

        <Box sx={styles.sectionTopContent}>
          <Stack
            sx={styles.linkIconStackContainer}
            flex={1}
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
            gap={3}
          >
            <XPlatformIcon size={45} />
            <LinkSharp fontSize="medium" />
            <HederaIcon size={48} />
          </Stack>
          <p>
            Each Hedera account can be linked to one 𝕏 account. Once linked, you’ll be redirected to your dashboard.
          </p>
        </Box>
        <Box sx={styles.sectionBottomContent}>
          <h4>By proceeding, you allow Hashbuzz to:</h4>
          <ul>
            {permissions.map(({ icon, text }, idx) => (
              <li key={idx}>
                <span>{icon}</span> {text}
              </li>
            ))}
          </ul>
          <Alert sx={styles.alertInfoContainer} variant="outlined" severity="info">We will never access private DMs or share your data without consent.</Alert>
        </Box>
      </Box>
      <Stack className="button-container-connect-x-account" sx={{ p: 2 }} direction="row" justifyContent='flex-end'>
        <PrimaryButtonV2 loading={isLoadingTwitterHandle} onClick={handleConnectXAccount}>
          Connect 𝕏 Account
        </PrimaryButtonV2>
      </Stack>
    </Box>
  );
}

export default ConnectXAccount;