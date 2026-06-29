import CommunityBanner from "./communityBanner";
import LatestNews from "./latestNews";
import NewsPoster from "./NewsPoster";
import UpcomingComEvents from "./upcomingComEvents";

export default function CommunityLayout({ children }) {
  return (
    <div>
      <CommunityBanner />
      <UpcomingComEvents />
      <LatestNews/>
      <NewsPoster/>
      {children}
    </div>
  );
}


