
import React from "react";
import * as SC from "./styles";
import { CertikEmblem } from "../../../Components";
import BuiltOnHedera from "../../../../SVGR/BuiltOnHedera";
import { Link } from "@mui/material";
import { HashConnectTypes } from "hashconnect";
import { AuthenticationLog } from "../../../../Wallet/useHandleAuthenticate";


interface Props {
    pairingData: HashConnectTypes.SavedPairingData | null
    authStatusLog: AuthenticationLog[]

}

const LandingPageContent = ({ pairingData, authStatusLog }: Props) => {
    const pairedAccount = pairingData?.accountIds[0];

    return (
        <SC.RightSideContentContainer className='2xl:p-10 p-4 xl:p-8 mb-10 text-white text-sm xl:text-sm 2xl:text-xl'>
            <div className='flex items-center mb-4 xl:mb-3 2xl:mb-6 justify-between'>
                <div className='h-full w-40'>
                    <CertikEmblem projectId="hashbuzz" dataId="68dcae96" />
                </div>
                <div className='mr-4 h-full'>
                    <BuiltOnHedera height={50} />
                </div>
            </div>

            {pairedAccount ? (
                <div className="flex flex-wrap my-2 bg-slate-100 text-stone-700 rounded py-2 px-4">
                    <div className="w-full sm:w-1/2">
                        <h4 className="text-xl">{pairedAccount}</h4>
                    </div>
                    <div className="w-full sm:w-1/2">
                        {authStatusLog.length > 0 ? (
                            <div className={`alert ${authStatusLog[authStatusLog.length - 1]?.type ?? "info"}`}>
                                {authStatusLog[authStatusLog.length - 1]?.message ?? "Message"}
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : null}

            <p className='mb-6 font-nornal '>In this proof of concept, campaigners can run 𝕏 post promos and reward their dedicated influencers with either HBAR or from a selection of whitelisted fungible HTS tokens.</p>

            <p className='mb-6 font-normal'>Our goal is to create a seamless rewarding mechanism that bridges both web2 and web3. It's all about ensuring that the right individuals receive recognition for their contributions.
                Ready to get started?</p>

            <ul className='mb-12 font-normal ps-5 list-disc'>
                <li className='2xl:mb-2 mb-1'>Learn how to launch your very first promo,  <Link href="https://youtu.be/zqpnoHG3JAk?si=PXX8KNDo902I-it2">watch Youtube Video.</Link> </li>
                <li className='2xl:mb-2 mb-1'>Stay in the loop with our latest updates and announcements by following us on <Link href="https://x.com/hashbuzzsocial">𝕏</Link> - <Link href="https://discord.gg/6Yrg4u8bvB"> Discord.</Link></li>
                <li className='2xl:mb-2 mb-1'>Read our <Link href="https://www.hashbuzz.social/terms-of-use">Terms of use </Link> and <Link href="https://www.hashbuzz.social/privacy-policy"> Privacy Policy.</Link></li>
            </ul>

            <p className='2xl:mb-3 xl:mb-2 mb-1 font-bold '>Join us in revolutionizing the way we share and validate information on social media.</p>

        </SC.RightSideContentContainer>
    )
}

export default LandingPageContent;