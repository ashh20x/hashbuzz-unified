import FramePath from "@/SVGR/FramePath"
import HashbuzzLogoMainTransparent from "@/SVGR/HashbuzzLogo"
import { IconButton, Stack } from "@mui/material"
import { stepsMobileHeaderStyles } from "./styles"


const StepsMobileHeader = () => {
    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={stepsMobileHeaderStyles}>
            <HashbuzzLogoMainTransparent height={40}/>
            <IconButton size="small">
                <FramePath size={32} />
            </IconButton>
        </Stack>
    )
}

export default StepsMobileHeader;