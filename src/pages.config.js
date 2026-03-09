/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
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
import MacroSignals from './pages/MacroSignals';
import Me from './pages/Me';
import Reports from './pages/Reports';
import SentimentHeatmap from './pages/SentimentHeatmap';
import Settings from './pages/Settings';
import SettingsAccount from './pages/SettingsAccount';
import SettingsBilling from './pages/SettingsBilling';
import SettingsNotifications from './pages/SettingsNotifications';
import SettingsSecurity from './pages/SettingsSecurity';
import SmartTracker from './pages/SmartTracker';
import Watchlist from './pages/Watchlist';
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
    "MacroSignals": MacroSignals,
    "Me": Me,
    "Reports": Reports,
    "SentimentHeatmap": SentimentHeatmap,
    "Settings": Settings,
    "SettingsAccount": SettingsAccount,
    "SettingsBilling": SettingsBilling,
    "SettingsNotifications": SettingsNotifications,
    "SettingsSecurity": SettingsSecurity,
    "SmartTracker": SmartTracker,
    "Watchlist": Watchlist,
}

export const pagesConfig = {
    mainPage: "MacroSignals",
    Pages: PAGES,
    Layout: __Layout,
};