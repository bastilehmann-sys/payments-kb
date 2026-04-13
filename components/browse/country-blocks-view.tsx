'use client';

import type { CountryBlockGroup } from '@/lib/queries/documents';
import { CountryBlocksTabs } from './country-blocks-tabs';

interface CountryBlocksViewProps {
  blocks: CountryBlockGroup[];
}

export function CountryBlocksView({ blocks }: CountryBlocksViewProps) {
  return <CountryBlocksTabs blocks={blocks} />;
}
