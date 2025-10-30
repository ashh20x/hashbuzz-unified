import { GridRenderCellParams } from '@mui/x-data-grid';
import { CampaignCards } from '../../../../../types';

// Moved budget rendering to a separate function
export function RenderBudget(cellValues: GridRenderCellParams<CampaignCards>) {
  return (
    <span>
      {cellValues?.row?.type === 'HBAR'
        ? cellValues?.row?.campaign_budget / 1e8
        : cellValues?.row?.campaign_budget /
          Math.pow(10, Number(cellValues?.row?.decimals))}
    </span>
  );
}
