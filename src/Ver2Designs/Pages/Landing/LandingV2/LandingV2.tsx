import { Wallet } from '@mui/icons-material'
import { Button } from '@mui/material'
import BuiltOnHedera from '../../../../SVGR/BuiltOnHedera'
import HashbuzzLogoMainTransparent from '../../../../SVGR/HashbuzzLogo'
import MetaMaskLogo from '../../../../SVGR/MetaMaskLogo'
import WalletConnectLogo from '../../../../SVGR/WalletconnectLogo'
import * as SC from "./styles"

const LandingV2 = () => {
  return (
    <SC.LandingV2Container className='h-[100vh] w-full'>
      <div className="flex w-full h-full">
        <div className="flex-grow  w-4/6">
          <SC.ImageCarousalContainer className='h-full w-full rounded-xl relative shadow-zinc-400'>
            <div className='flex justify-start items-center w-full px-20 py-4'>
              <HashbuzzLogoMainTransparent height={96} colors={{ color1: "white", color2: 'white' }} />
            </div>
            <div className='absolute bottom-[36px] left-0 right-0 p-20'>
              <SC.LandingPageHeader className='font-bold text-4xl text-white tracking-wider leading-snug'>Discover the power of hashbuzz, a dynamic platform that elevates brand communities through incentivized 𝕏 posts.</SC.LandingPageHeader>
              <SC.ContentWrapperDiv className='rounded-xl'>
                <p className='font-normal text-xl text-white leading-normal'>Hashbuzz  leveraging project tokens, brands can significantly boost their visibility and exposure. This approach not only enhances token adoption within the community but also transforms regular posts into viral sensations. Expect a substantial increase in overall engagement, as your audience becomes more interactive and invested in your brand's success. Additionally, hashbuzz drives authentic interactions, builds long-term brand loyalty, and taps into new audience segments, fostering a stronger, more vibrant community around your brand.</p>
              </SC.ContentWrapperDiv>
            </div>
          </SC.ImageCarousalContainer>
        </div>
        <div className="flex-shrink w-2/4">
          <SC.RightSideColWrapper className='relative h-full'>
            <SC.HeaderActionContainer className='w-full px-20 py-4'>
              <div className='flex justify-end items-center h-24'>
                <Button variant="contained" color='primary' startIcon={<Wallet />} disableElevation>Connect</Button>
              </div>
            </SC.HeaderActionContainer>

            <SC.RightSideContentContainer className='px-20 py-4 text-white'>
              <p className='mb-6 font-nornal '>In this proof of concept, campaigners can run 𝕏 post promos and reward their dedicated influencers with either HBAR or from a selection of whitelisted fungible HTS tokens.</p>

              <p className='mb-6 font-normal'>Our goal is to create a seamless rewarding mechanism that bridges both web2 and web3. It's all about ensuring that the right individuals receive recognition for their contributions.
                Ready to get started?</p>

              <ul className='mb-12 font-normal ps-5 list-disc'>
                <li className='mb-2'>Learn how to launch your very first promo, watch Youtube Video </li>
                <li className='mb-2'>Stay in the loop with our latest updates and announcements by following us on 𝕏 - Discord </li>
                <li className='mb-2'>Read our Terms of use and Privacy Policy.</li>
              </ul>

              <p className='mb-3 font-bold '>Join us in revolutionizing the way we share and validate information on social media.</p>

            </SC.RightSideContentContainer>

            <SC.ConnectingPlatforms className='rounded-xl'>
              <SC.StyledIconButton className='rounded-xl' aria-label="Connect with MetaMask">
                <MetaMaskLogo size={48} />
              </SC.StyledIconButton>
              <SC.StyledIconButton className='rounded-xl' aria-label="Connect with WalletConnect">
                <WalletConnectLogo size={48} />
              </SC.StyledIconButton>
            </SC.ConnectingPlatforms>

            <div className='absolute left-0  bottom-0 px-8'>
              <BuiltOnHedera height={100} />
            </div>

          </SC.RightSideColWrapper>
        </div>
      </div>
    </SC.LandingV2Container>
  )
}

export default LandingV2
