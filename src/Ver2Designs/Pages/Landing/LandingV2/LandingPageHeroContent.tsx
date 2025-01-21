import React from "react";
import * as SC from "./styles";

const LandingPageHeroContent = () => {
    return (
        <div className='sm:absolute xl:bottom-[16px] 2xl:bottom-[36px] left-0 right-0 xl:py-2 xl:px-16 2xl:px-20 2xl:py-12'>
            <SC.LandingPageHeader className='font-bold text-lg mb-4 sm:mb-9  xl:text-2xl 2xl:text-4xl text-white tracking-wider leading-snug'>Discover the power of hashbuzz, a dynamic platform that elevates brand communities through incentivized 𝕏 posts.</SC.LandingPageHeader>
            <SC.ContentWrapperDiv className='rounded-xl'>
                <p className='font-normal text-sm xl:text-base 2xl:text-xl text-white leading-normal'>Hashbuzz  leveraging project tokens, brands can significantly boost their visibility and exposure. This approach not only enhances token adoption within the community but also transforms regular posts into viral sensations. Expect a substantial increase in overall engagement, as your audience becomes more interactive and invested in your brand's success. Additionally, hashbuzz drives authentic interactions, builds long-term brand loyalty, and taps into new audience segments, fostering a stronger, more vibrant community around your brand.</p>
            </SC.ContentWrapperDiv>
        </div>
    )
}

export default LandingPageHeroContent;