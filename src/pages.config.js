import Watchlist from './pages/Watchlist';
import Reports from './pages/Reports';
import SentimentHeatmap from './pages/SentimentHeatmap';
import SmartTracker from './pages/SmartTracker';
import AlphaGeneration from './pages/AlphaGeneration';
import EmergingThemes from './pages/EmergingThemes';
import EventTracker from './pages/EventTracker';
import Explore from './pages/Explore';
import Home from './pages/Home';
import Alerts from './pages/Alerts';
import Insights from './pages/Insights';
import LiveFeed from './pages/LiveFeed';
import FinanceDictionary from './pages/FinanceDictionary';
import CapitalVault from './pages/CapitalVault';
import MacroSignals from './pages/MacroSignals';
import Me from './pages/Me';
import AscensionDemo from './pages/AscensionDemo';
import Layout from './Layout.jsx';


export const PAGES = {
    "Watchlist": Watchlist,
    "Reports": Reports,
    "SentimentHeatmap": SentimentHeatmap,
    "SmartTracker": SmartTracker,
    "AlphaGeneration": AlphaGeneration,
    "EmergingThemes": EmergingThemes,
    "EventTracker": EventTracker,
    "Explore": Explore,
    "Home": Home,
    "Alerts": Alerts,
    "Insights": Insights,
    "LiveFeed": LiveFeed,
    "FinanceDictionary": FinanceDictionary,
    "CapitalVault": CapitalVault,
    "MacroSignals": MacroSignals,
    "Me": Me,
    "AscensionDemo": AscensionDemo,
}

export const pagesConfig = {
    mainPage: "MacroSignals",
    Pages: PAGES,
    Layout: Layout,
};