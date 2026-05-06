export const GYM_COIN_ADDRESS = "0x969ACbDaA87BeF8DA6eD2a071a593c93eBf2d5c4";
export const USER_PROFILE_ADDRESS = "0x442B63C25Aa9feC42a0FCD2dBb7eB1E845273Ee2";
export const SEPOLIA_CHAIN_ID = "0xaa36a7";
export const SEPOLIA_EXPLORER = "https://sepolia.etherscan.io";

export const GYM_COIN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function buy(uint256 gcAmount) payable",
  "function sell(uint256 gcAmount)",
  "function setRates(uint256 _sellRate, uint256 _buyRate)",
  "function sellRate() view returns (uint256)",
  "function buyRate() view returns (uint256)",
  "function owner() view returns (address)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event TokensBought(address indexed buyer, uint256 gcAmount, uint256 ethAmount)",
  "event TokensSold(address indexed seller, uint256 gcAmount, uint256 ethAmount)",
];

export const USER_PROFILE_ABI = [
  "function registerUser(string _username, string _email)",
  "function updateUser(string _username, string _email)",
  "function getUserInfo(address _account) view returns (string, string, address)",
  "function isRegistered(address _account) view returns (bool)",
  "event UserRegistered(address indexed account, string username, string email)",
];
