import { GridRenderCellParams } from '@mui/x-data-grid';
import { CampaignCards } from '../../../../../types';

// Moved amount claimed rendering to a separate function
export function RenderAmountClaimed(
  cellValues: GridRenderCellParams<CampaignCards>
) {
  return (
    <span>
      {cellValues?.row?.type === 'HBAR'
        ? cellValues?.row?.amount_claimed / 1e8
        : cellValues?.row?.amount_claimed /
          Math.pow(10, Number(cellValues?.row?.decimals))}
    </span>
  );
}
