
import React from "react";
import HashbuzzLogoMainTransparent from "../../../../SVGR/HashbuzzLogo";
import useMediaLocalQuery from "../../../../hooks/userMedisQuery";
import HeaderAction from "./HeaderAction";

const HeaderSection = () => {
    const isSmallScreen = useMediaLocalQuery('sm', 'down');
    return (
        <div className='flex mb-4 sticky sm:relative  top-[-1px] z-50 bg-[#00051d] sm:bg-transparent'>
            <div className='w-1/2'>
                <div className='flex justify-start items-center w-full px-0 py-0  md:px-20 xl:py-4'>
                    <HashbuzzLogoMainTransparent height={isSmallScreen ? 40 : 96} colors={{ color1: "white", color2: 'white' }} />
                </div>
            </div>
            <div className='w-1/2'>
                <HeaderAction />
            </div>
        </div>
    )
};

export default HeaderSection;