export const GYM_COIN_ADDRESS     = "0x833a676dD16D8f5FA5F696ff1DC41ea9Bd3EB425";
export const USER_PROFILE_ADDRESS = "0xAB2C9BDB09a4692eC9a2B00AD2a4C160F763ADc9";
export const SEPOLIA_CHAIN_ID     = "0xaa36a7";
export const SEPOLIA_EXPLORER     = "https://sepolia.etherscan.io";

// Role hashes — computed at runtime via ethers.id() in useWallet.js

export const GYM_COIN_ABI = [
  // ── ERC-20 ──
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  // ── Core ──
  "function buy(uint256 gcAmount) payable",
  "function sell(uint256 gcAmount)",
  "function sellRate() view returns (uint256)",
  "function buyRate() view returns (uint256)",
  "function adminAddress() view returns (address)",
  // ── Limits ──
  "function maxBuyAmount() view returns (uint256)",
  "function maxSellAmount() view returns (uint256)",
  "function setLimits(uint256 maxBuy, uint256 maxSell)",
  // ── Membership ──
  "function buyMembership()",
  "function isMember(address) view returns (bool)",
  "function membershipExpiry(address) view returns (uint256)",
  "function membershipPrice() view returns (uint256)",
  "function membershipDuration() view returns (uint256)",
  "function setMembershipConfig(uint256 price, uint256 duration)",
  // ── Blacklist ──
  "function blacklisted(address) view returns (bool)",
  "function blacklistAddress(address account)",
  "function unblacklistAddress(address account)",
  // ── Pause ──
  "function paused() view returns (bool)",
  "function pause()",
  "function unpause()",
  // ── Rates ──
  "function setRates(uint256 sellRate, uint256 buyRate)",
  // ── Roles ──
  "function hasRole(bytes32 role, address account) view returns (bool)",
  "function grantRole(bytes32 role, address account)",
  "function revokeRole(bytes32 role, address account)",
  // ── Withdraw ──
  "function withdraw()",
  // ── Events ──
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event TokensBought(address indexed buyer, uint256 gcAmount, uint256 ethAmount)",
  "event TokensSold(address indexed seller, uint256 gcAmount, uint256 ethAmount)",
  "event RatesUpdated(uint256 newSellRate, uint256 newBuyRate)",
  "event LimitsUpdated(uint256 maxBuy, uint256 maxSell)",
  "event Blacklisted(address indexed account)",
  "event Unblacklisted(address indexed account)",
  "event MembershipPurchased(address indexed member, uint256 expiry)",
  "event MembershipConfigUpdated(uint256 price, uint256 duration)",
  "event Paused(address account)",
  "event Unpaused(address account)",
  "event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)",
  "event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)",
];

export const USER_PROFILE_ABI = [
  "function registerUser(string _username, string _email)",
  "function updateUser(string _username, string _email)",
  "function getUserInfo(address _account) view returns (string, string, address)",
  "function isRegistered(address _account) view returns (bool)",
  "event UserRegistered(address indexed account, string username, string email)",
];
