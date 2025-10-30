import { GridRenderCellParams } from '@mui/x-data-grid';
import { getSymbol } from '../../../../../comman/helpers';
import { useAppSelector } from '../../../../../Store/store';
import { CampaignCards } from '../../../../../types';

// Moved RenderSymbol to a separate function
export function RenderSymbol(
  props: GridRenderCellParams<CampaignCards, CampaignCards, CampaignCards>
) {
  const { balances } = useAppSelector(s => s.app);
  return (
    <span>
      {props.row?.type === 'HBAR'
        ? 'HBAR'
        : getSymbol(balances, props.row?.fungible_token_id ?? '')}
    </span>
  );
}
