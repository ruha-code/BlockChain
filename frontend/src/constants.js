export const GYM_COIN_ADDRESS     = "0x39d2035722ea88e5547076B6FCd83ce8f517d050";
export const USER_PROFILE_ADDRESS = "0xa8a12f46E237F227A35f6DE65dd2d9dB5eEaFB10";
export const SEPOLIA_CHAIN_ID     = "0xaa36a7";
export const SEPOLIA_EXPLORER     = "https://sepolia.etherscan.io";

export const GYM_COIN_ABI = [
  // ERC-20 standard
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  // Owner
  "function owner() view returns (address)",
  // Buy / Sell
  "function buy(uint256 gcAmount) payable",
  "function sell(uint256 gcAmount)",
  "function sellRate() view returns (uint256)",
  "function buyRate() view returns (uint256)",
  // Limits
  "function maxBuyAmount() view returns (uint256)",
  "function maxSellAmount() view returns (uint256)",
  "function setLimits(uint256 maxBuy, uint256 maxSell)",
  // Rates
  "function setRates(uint256 sellRate, uint256 buyRate)",
  // Withdraw
  "function withdraw()",
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event TokensBought(address indexed buyer, uint256 gcAmount, uint256 ethAmount)",
  "event TokensSold(address indexed seller, uint256 gcAmount, uint256 ethAmount)",
  "event RatesUpdated(uint256 newSellRate, uint256 newBuyRate)",
];

export const USER_PROFILE_ABI = [
  "function registerUser(string _username, string _email)",
  "function updateUser(string _username, string _email)",
  "function getUserInfo(address _account) view returns (string, string, address)",
  "function isRegistered(address _account) view returns (bool)",
  "event UserRegistered(address indexed account, string username, string email)",
  "event UserUpdated(address indexed account, string username, string email)",
];
