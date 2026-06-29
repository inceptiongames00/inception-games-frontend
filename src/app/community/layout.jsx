import Header from "../components/Header";
import CommunityBanner from "./communityBanner";
import UpcomingComEvents from "./upcomingComEvents";
import EShop from "../components/EShop";
import LatestNews from "./latestNews";
import NewsPoster from "./NewsPoster";

export default function CommunityLayout({ children }) {
  return (
    <div>
      <Header />
      <CommunityBanner />
      <UpcomingComEvents />
      <EShop />
      <LatestNews/>
      <NewsPoster/>
      {children}
    </div>
  );
}


