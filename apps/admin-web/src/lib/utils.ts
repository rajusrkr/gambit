import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const cryptoCoins = [
  {
    coin: "0G_USDC",
  },
  {
    coin: "0G_USDC_PERP",
  },
  {
    coin: "2Z_USDC",
  },
  {
    coin: "2Z_USDC_PERP",
  },
  {
    coin: "AAVE_USDC",
  },
  {
    coin: "AAVE_USDC_PERP",
  },
  {
    coin: "ADA_USDC_PERP",
  },
  {
    coin: "AERO_USDC_PERP",
  },
  {
    coin: "APEX_USDC_PERP",
  },
  {
    coin: "APE_USDC",
  },
  {
    coin: "APR_USDC",
  },
  {
    coin: "APT_USDC",
  },
  {
    coin: "APT_USDC_PERP",
  },
  {
    coin: "ARB_USDC_PERP",
  },
  {
    coin: "ASTER_USDC_PERP",
  },
  {
    coin: "AVAX_USDC_PERP",
  },
  {
    coin: "AVNT_USDC_PERP",
  },
  {
    coin: "BERA_USDC_PERP",
  },
  {
    coin: "BLUE_USDC",
  },
  {
    coin: "BNB_USDC",
  },
  {
    coin: "BNB_USDC_PERP",
  },
  {
    coin: "BOME_USDC",
  },
  {
    coin: "BONK_USDC",
  },
  {
    coin: "BTC_USDC",
  },
  {
    coin: "BTC_USDC_PERP",
  },
  {
    coin: "CLOUD_USDC",
  },
  {
    coin: "CRV_USDC_PERP",
  },
  {
    coin: "DEEP_USDC",
  },
  {
    coin: "DOGE_USDC",
  },
  {
    coin: "DOGE_USDC_PERP",
  },
  {
    coin: "DOT_USDC_PERP",
  },
  {
    coin: "DRIFT_USDC",
  },
  {
    coin: "ENA_USDC",
  },
  {
    coin: "ENA_USDC_PERP",
  },
  {
    coin: "ES_USDC",
  },
  {
    coin: "ETH_USDC",
  },
  {
    coin: "ETH_USDC_PERP",
  },
  {
    coin: "FARTCOIN_USDC_PERP",
  },
  {
    coin: "FLOCK_USDC",
  },
  {
    coin: "FLOCK_USDC_PERP",
  },
  {
    coin: "HBAR_USDC_PERP",
  },
  {
    coin: "HYPE_USDC",
  },
  {
    coin: "HYPE_USDC_PERP",
  },
  {
    coin: "IO_USDC",
  },
  {
    coin: "IP_USDC_PERP",
  },
  {
    coin: "JTO_USDC",
  },
  {
    coin: "JTO_USDC_PERP",
  },
  {
    coin: "JUP_USDC",
  },
  {
    coin: "JUP_USDC_PERP",
  },
  {
    coin: "KAITO_USDC_PERP",
  },
  {
    coin: "KMNO_USDC",
  },
  {
    coin: "KMNO_USDC_PERP",
  },
  {
    coin: "LDO_USDC",
  },
  {
    coin: "LDO_USDC_PERP",
  },
  {
    coin: "LINEA_USDC_PERP",
  },
  {
    coin: "LINK_USDC",
  },
  {
    coin: "LINK_USDC_PERP",
  },
  {
    coin: "LTC_USDC_PERP",
  },
  {
    coin: "MET_USDC",
  },
  {
    coin: "MET_USDC_PERP",
  },
  {
    coin: "MNT_USDC_PERP",
  },
  {
    coin: "NEAR_USDC_PERP",
  },
  {
    coin: "NS_USDC",
  },
  {
    coin: "ONDO_USDC",
  },
  {
    coin: "ONDO_USDC_PERP",
  },
  {
    coin: "OP_USDC_PERP",
  },
  {
    coin: "PAXG_USDC_PERP",
  },
  {
    coin: "PENDLE_USDC_PERP",
  },
  {
    coin: "PENGU_USDC",
  },
  {
    coin: "PENGU_USDC_PERP",
  },
  {
    coin: "PEPE_USDC",
  },
  {
    coin: "PIPE_USDC",
  },
  {
    coin: "PIPE_USDC_PERP",
  },
  {
    coin: "POL_USDC",
  },
  {
    coin: "PRCL_USDC",
  },
  {
    coin: "PUMP_USDC",
  },
  {
    coin: "PUMP_USDC_PERP",
  },
  {
    coin: "PYTH_USDC",
  },
  {
    coin: "PYTH_USDC_PERP",
  },
  {
    coin: "RAY_USDC",
  },
  {
    coin: "RENDER_USDC",
  },
  {
    coin: "SEI_USDC",
  },
  {
    coin: "SEI_USDC_PERP",
  },
  {
    coin: "SHIB_USDC",
  },
  {
    coin: "SOL_USDC",
  },
  {
    coin: "SOL_USDC_PERP",
  },
  {
    coin: "SONIC_USDC",
  },
  {
    coin: "STRK_USDC",
  },
  {
    coin: "SUI_USDC",
  },
  {
    coin: "SUI_USDC_PERP",
  },
  {
    coin: "SWTCH_USDC",
  },
  {
    coin: "S_USDC_PERP",
  },
  {
    coin: "TAO_USDC_PERP",
  },
  {
    coin: "TIA_USDC_PERP",
  },
  {
    coin: "TON_USDC_PERP",
  },
  {
    coin: "TRUMP_USDC",
  },
  {
    coin: "TRUMP_USDC_PERP",
  },
  {
    coin: "UNI_USDC",
  },
  {
    coin: "UNI_USDC_PERP",
  },
  {
    coin: "USDT_USDC",
  },
  {
    coin: "VIRTUAL_USDC_PERP",
  },
  {
    coin: "WAL_USDC",
  },
  {
    coin: "WCT_USDC",
  },
  {
    coin: "WEN_USDC",
  },
  {
    coin: "WIF_USDC",
  },
  {
    coin: "WIF_USDC_PERP",
  },
  {
    coin: "WLD_USDC",
  },
  {
    coin: "WLD_USDC_PERP",
  },
  {
    coin: "WLFI_USDC",
  },
  {
    coin: "WLFI_USDC_PERP",
  },
  {
    coin: "W_USDC",
  },
  {
    coin: "W_USDC_PERP",
  },
  {
    coin: "XLM_USDC_PERP",
  },
  {
    coin: "XPL_USDC",
  },
  {
    coin: "XPL_USDC_PERP",
  },
  {
    coin: "XRP_USDC",
  },
  {
    coin: "XRP_USDC_PERP",
  },
  {
    coin: "ZEC_USDC_PERP",
  },
  {
    coin: "ZORA_USDC_PERP",
  },
  {
    coin: "ZRO_USDC",
  },
  {
    coin: "ZRO_USDC_PERP",
  },
  {
    coin: "kBONK_USDC_PERP",
  },
  {
    coin: "kPEPE_USDC_PERP",
  },
  {
    coin: "kSHIB_USDC_PERP",
  },
];
