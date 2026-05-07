import { useWallet } from "./hooks/useWallet";
import ConnectScreen from "./components/ConnectScreen";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatusMessage from "./components/StatusMessage";
import Dashboard from "./components/Dashboard";
import BuyTab from "./components/BuyTab";
import SellTab from "./components/SellTab";
import TransferTab from "./components/TransferTab";
import TransactionsTab from "./components/TransactionsTab";
import ProfileTab from "./components/ProfileTab";
import OwnerTab from "./components/OwnerTab";
import TreasuryTab from "./components/TreasuryTab";
import MembershipTab from "./components/MembershipTab";
import LeaderboardTab from "./components/LeaderboardTab";
import MarketTab from "./components/MarketTab";
import ErrorPage from "./components/ErrorPage";
import TransactionModal from "./components/TransactionModal";

const KNOWN_TABS = [
  "dashboard", "buy", "sell", "transfer", "transactions",
  "profile", "treasury", "owner", "membership", "leaderboard", "market",
];

export default function App() {
  const wallet = useWallet();

  if (!wallet.account || !wallet.isRegistered) {
    return (
      <ConnectScreen
        onConnect={wallet.connectWallet}
        onRegister={wallet.registerUser}
        account={wallet.account}
        connecting={wallet.connecting}
        loadingAction={wallet.loadingAction}
        message={wallet.message?.type === "error" ? wallet.message : null}
      />
    );
  }

  const isUnknownTab = !KNOWN_TABS.includes(wallet.activeTab);

  const renderTab = () => {
    if (isUnknownTab) return <ErrorPage onBack={() => wallet.setActiveTab("dashboard")} />;

    switch (wallet.activeTab) {
      case "dashboard":
        return (
          <Dashboard
            account={wallet.account}
            balance={wallet.balance}
            ethBalance={wallet.ethBalance}
            username={wallet.username}
            isRegistered={wallet.isRegistered}
            txHistory={wallet.txHistory}
            txCount={wallet.txCount}
            rates={wallet.rates}
            isMember={wallet.isMember}
            membershipExpiry={wallet.membershipExpiry}
            isPaused={wallet.isPaused}
            setActiveTab={wallet.setActiveTab}
          />
        );
      case "buy":
        return (
          <BuyTab
            rates={wallet.rates}
            balance={wallet.balance}
            ethBalance={wallet.ethBalance}
            limits={wallet.limits}
            onBuy={wallet.buyTokens}
            loading={wallet.loadingAction === "buy"}
          />
        );
      case "sell":
        return (
          <SellTab
            rates={wallet.rates}
            balance={wallet.balance}
            ethBalance={wallet.ethBalance}
            limits={wallet.limits}
            onSell={wallet.sellTokens}
            loading={wallet.loadingAction === "sell"}
          />
        );
      case "transfer":
        return (
          <TransferTab
            balance={wallet.balance}
            account={wallet.account}
            onTransfer={wallet.transferTokens}
            loading={wallet.loadingAction === "transfer"}
          />
        );
      case "transactions":
        return <TransactionsTab txHistory={wallet.txHistory} />;
      case "profile":
        return (
          <ProfileTab
            account={wallet.account}
            balance={wallet.balance}
            username={wallet.username}
            email={wallet.email}
            isRegistered={wallet.isRegistered}
            txCount={wallet.txCount}
            isMember={wallet.isMember}
            membershipExpiry={wallet.membershipExpiry}
            loadingAction={wallet.loadingAction}
            onRegister={wallet.registerUser}
            onUpdate={wallet.updateUser}
          />
        );
      case "treasury":
        return (
          <TreasuryTab
            balance={wallet.balance}
            ethBalance={wallet.contractEthBalance}
            txHistory={wallet.txHistory}
            rates={wallet.rates}
          />
        );
      case "membership":
        return (
          <MembershipTab
            balance={wallet.balance}
            isMember={wallet.isMember}
            membershipExpiry={wallet.membershipExpiry}
            membershipConfig={wallet.membershipConfig}
            onBuyMembership={wallet.buyMembership}
            loading={wallet.loadingAction === "membership"}
          />
        );
      case "leaderboard":
        return (
          <LeaderboardTab
            account={wallet.account}
            loadLeaderboard={wallet.loadLeaderboard}
          />
        );
      case "market":
        return <MarketTab rates={wallet.rates} loadRatesHistory={wallet.loadRatesHistory} />;
      case "owner":
        return (
          <OwnerTab
            rates={wallet.rates}
            limits={wallet.limits}
            membershipConfig={wallet.membershipConfig}
            isPaused={wallet.isPaused}
            isOwner={wallet.isOwner}
            onUpdateRates={wallet.updateRates}
            onUpdateLimits={wallet.updateLimits}
            onPause={wallet.pauseContract}
            onUnpause={wallet.unpauseContract}
            onBlacklist={wallet.blacklistAddr}
            onUnblacklist={wallet.unblacklistAddr}
            onUpdateMembership={wallet.updateMembershipConfig}
            loading={wallet.loadingAction}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAF8]">
      <Sidebar
        activeTab={wallet.activeTab}
        setActiveTab={wallet.setActiveTab}
        isOwner={wallet.isOwner}
        onDisconnect={wallet.disconnectWallet}
        txCount={wallet.txCount}
        username={wallet.username}
        isRegistered={wallet.isRegistered}
        isMember={wallet.isMember}
        isPaused={wallet.isPaused}
      />

      <main className="flex-1 flex flex-col ml-[220px] min-h-screen">
        <Header
          account={wallet.account}
          ethBalance={wallet.ethBalance}
          activeTab={wallet.activeTab}
          isPaused={wallet.isPaused}
        />
        <div className="flex-1 p-8">
          <StatusMessage message={wallet.message} />
          {renderTab()}
        </div>
      </main>

      <TransactionModal
        modal={wallet.modal}
        onClose={wallet.closeModal}
        onDashboard={() => wallet.setActiveTab("dashboard")}
      />
    </div>
  );
}
