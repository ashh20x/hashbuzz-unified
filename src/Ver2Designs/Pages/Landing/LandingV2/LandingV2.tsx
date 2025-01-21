import React from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../../../Store/StoreProvider'
import { useHashconnectService } from '../../../../Wallet'
import { useHandleAuthenticate } from '../../../../Wallet/useHandleAuthenticate'
import HeaderSection from './HeaderSection'
import LandingPageContent from './LandingPageContent'
import LandingPageHeroContent from './LandingPageHeroContent'
import * as SC from "./styles"

const LandingV2 = () => {
    const store = useStore();
    const [cookies] = useCookies(["aSToken"]);
    const { pairingData = null } = useHashconnectService();
    const { handleAuthenticate, authStatusLog } = useHandleAuthenticate();
    const navigate = useNavigate();
    const ping = store.ping;
    const auth = store.auth;
    const pairedAccount = pairingData?.accountIds[0];

  React.useEffect(() => {
    if ((cookies.aSToken && ping.status && pairedAccount) || auth?.auth) {
      navigate("/dashboard");
    }
  }, [cookies.aSToken, navigate, pairedAccount, ping]);

  React.useEffect(() => {
    if (pairedAccount && !ping.status && !cookies.aSToken) {
      handleAuthenticate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairedAccount, ping, cookies]);

  return (
    <SC.LandingV2Container className='h-[100vh] w-full'>
      <div className='h-full overflow-y-auto sm:overflow-hidden'>
        <HeaderSection />
        <div className="flex flex-col sm:flex-row w-full h-full sm:h-auto">
          <div className="mb-4 sm:mb-0 flex-grow w-full xl:w-1/2  2xl:w-4/6">
            <SC.ImageCarousalContainer className='h-full w-full rounded-xl relative shadow-zinc-400'>
              <LandingPageHeroContent />
            </SC.ImageCarousalContainer>
          </div>
          <div className="flex-shrink w-full xl:w-1/2 2xl:w-2/4">
            <SC.RightSideColWrapper className='relative h-full'>
              <LandingPageContent authStatusLog={authStatusLog} pairingData={pairingData} />
            </SC.RightSideColWrapper>
          </div>
        </div>
      </div>
    </SC.LandingV2Container>
  )
}

export default LandingV2
