export type SupportedCoins = 'sui' | 'cetus';

export const CoinTypes: Record<SupportedCoins, string> = {
  sui: '0x2::sui::SUI',
  cetus: '0x6864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS',
};
