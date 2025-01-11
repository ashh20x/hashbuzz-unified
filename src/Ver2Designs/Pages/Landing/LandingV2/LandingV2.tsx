import { QrCode2Outlined, Wallet } from '@mui/icons-material'
import { Button } from '@mui/material'
import BuiltOnHedera from '../../../../SVGR/BuiltOnHedera'
import HashbuzzLogoMainTransparent from '../../../../SVGR/HashbuzzLogo'
import HashpackIcon from '../../../../SVGR/HashpackIcon'
import { CertikEmblem } from '../../../Components'
import * as SC from "./styles"

const LandingV2 = () => {
  return (
    <SC.LandingV2Container className='h-[100vh] w-full'>
      <div className="flex w-full h-full">
        <div className="flex-grow xl:w-1/2  2xl:w-4/6">
          <SC.ImageCarousalContainer className='h-full w-full rounded-xl relative shadow-zinc-400'>
            <div className='flex justify-start items-center w-full px-20 py-4'>
              <HashbuzzLogoMainTransparent height={96} colors={{ color1: "white", color2: 'white' }} />
            </div>
            <div className='absolute xl:bottom-[16px] 2xl:bottom-[36px] left-0 right-0 xl:py-2 xl:px-16 2xl:px-20 2xl:py-12'>
              <SC.LandingPageHeader className='font-bold text-xl xl:text-2xl 2xl:text-4xl text-white tracking-wider leading-snug'>Discover the power of hashbuzz, a dynamic platform that elevates brand communities through incentivized 𝕏 posts.</SC.LandingPageHeader>
              <SC.ContentWrapperDiv className='rounded-xl'>
                <p className='font-normal text-xs xl:text-base 2xl:text-xl text-white leading-normal'>Hashbuzz  leveraging project tokens, brands can significantly boost their visibility and exposure. This approach not only enhances token adoption within the community but also transforms regular posts into viral sensations. Expect a substantial increase in overall engagement, as your audience becomes more interactive and invested in your brand's success. Additionally, hashbuzz drives authentic interactions, builds long-term brand loyalty, and taps into new audience segments, fostering a stronger, more vibrant community around your brand.</p>
              </SC.ContentWrapperDiv>
            </div>
          </SC.ImageCarousalContainer>
        </div>
        <div className="flex-shrink xl:w-1/2 2xl:w-2/4">
          <SC.RightSideColWrapper className='relative h-full'>
            <SC.HeaderActionContainer className='w-full px-20 xl:py-2 2xl:py-4'>
              <div className='flex justify-end items-center h-24'>
                <Button variant="contained" color='primary' startIcon={<Wallet />} disableElevation>Connect</Button>
              </div>
            </SC.HeaderActionContainer>

            <SC.RightSideContentContainer className='2xl:p-10 xl:p-8 mb-10 text-white text-base xl:text-sm 2xl:text-xl'>
              <div className='flex items-center xl:mb-3 2xl:mb-6 justify-between'>
                <div className='h-full w-40'>
                  <CertikEmblem projectId="hashbuzz" dataId="68dcae96" />
                </div>
                <div className='mr-4 h-full'>
                  <BuiltOnHedera height={50} />
                </div>
              </div>
              <p className='mb-6 font-nornal '>In this proof of concept, campaigners can run 𝕏 post promos and reward their dedicated influencers with either HBAR or from a selection of whitelisted fungible HTS tokens.</p>

              <p className='mb-6 font-normal'>Our goal is to create a seamless rewarding mechanism that bridges both web2 and web3. It's all about ensuring that the right individuals receive recognition for their contributions.
                Ready to get started?</p>

              <ul className='mb-12 font-normal ps-5 list-disc'>
                <li className='2xl:mb-2 mb-1'>Learn how to launch your very first promo, watch Youtube Video </li>
                <li className='2xl:mb-2 mb-1'>Stay in the loop with our latest updates and announcements by following us on 𝕏 - Discord </li>
                <li className='2xl:mb-2 mb-1'>Read our Terms of use and Privacy Policy.</li>
              </ul>

              <p className='2xl:mb-3 xl:mb-2 mb-1 font-bold '>Join us in revolutionizing the way we share and validate information on social media.</p>

            </SC.RightSideContentContainer>

            <SC.ConnectingPlatforms className='rounded-xl hidden 2xl:flex'>
              <SC.StyledIconButton className='rounded-xl' aria-label="Connect with MetaMask">
                <HashpackIcon width={48} />
              </SC.StyledIconButton>
              <SC.StyledIconButton className='rounded-xl' aria-label="Connect with WalletConnect">
                <QrCode2Outlined fontSize="large" />
              </SC.StyledIconButton>
            </SC.ConnectingPlatforms>
          </SC.RightSideColWrapper>
        </div>
      </div>
    </SC.LandingV2Container>
  )
}

export default LandingV2
