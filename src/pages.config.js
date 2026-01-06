import Alerts from './pages/Alerts';
import AlphaGeneration from './pages/AlphaGeneration';
import AscensionDemo from './pages/AscensionDemo';
import CapitalVault from './pages/CapitalVault';
import EmergingThemes from './pages/EmergingThemes';
import EventTracker from './pages/EventTracker';
import Explore from './pages/Explore';
import FinanceDictionary from './pages/FinanceDictionary';
import Home from './pages/Home';
import Insights from './pages/Insights';
import LiveFeed from './pages/LiveFeed';
import Me from './pages/Me';
import Reports from './pages/Reports';
import SentimentHeatmap from './pages/SentimentHeatmap';
import SmartTracker from './pages/SmartTracker';
import Watchlist from './pages/Watchlist';
import MacroSignals from './pages/MacroSignals';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Alerts": Alerts,
    "AlphaGeneration": AlphaGeneration,
    "AscensionDemo": AscensionDemo,
    "CapitalVault": CapitalVault,
    "EmergingThemes": EmergingThemes,
    "EventTracker": EventTracker,
    "Explore": Explore,
    "FinanceDictionary": FinanceDictionary,
    "Home": Home,
    "Insights": Insights,
    "LiveFeed": LiveFeed,
    "Me": Me,
    "Reports": Reports,
    "SentimentHeatmap": SentimentHeatmap,
    "SmartTracker": SmartTracker,
    "Watchlist": Watchlist,
    "MacroSignals": MacroSignals,
}

export const pagesConfig = {
    mainPage: "MacroSignals",
    Pages: PAGES,
    Layout: __Layout,
};