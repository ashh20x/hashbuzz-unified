import { GridRenderCellParams } from '@mui/x-data-grid';
import { CampaignCards } from '../../../../../types';

// Moved amount spent rendering to a separate function
export function RenderAmountSpent(
  cellValues: GridRenderCellParams<CampaignCards>
) {
  return (
    <span>
      {cellValues?.row?.type === 'HBAR'
        ? cellValues?.row?.amount_spent / 1e8
        : cellValues?.row?.amount_spent /
          Math.pow(10, Number(cellValues?.row?.decimals))}
    </span>
  );
}
