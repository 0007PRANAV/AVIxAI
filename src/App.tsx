import { Route, Switch, Router as WouterRouter } from "wouter";
import { AppProvider } from "@/context/AppContext";
import { Layout } from "@/components/Layout";
import { StarBackground } from "@/components/StarBackground";
import { Confetti } from "@/components/Confetti";
import { XPToastContainer } from "@/components/XPToast";
import { useApp } from "@/context/AppContext";
import Dashboard from "@/pages/Dashboard";
import Courses from "@/pages/Courses";
import Quizzes from "@/pages/Quizzes";
import Streak from "@/pages/Streak";
import Leaderboard from "@/pages/Leaderboard";
import Store from "@/pages/Store";
import Jobs from "@/pages/Jobs";
import Hire from "@/pages/Hire";
import Agent from "@/pages/Agent";
import Referral from "@/pages/Referral";
import Community from "@/pages/Community";
import Portfolio from "@/pages/Portfolio";
import Settings from "@/pages/Settings";
import Friends from "@/pages/Friends";

function AppInner() {
  const { confettiActive } = useApp();
  return (
    <>
      <StarBackground />
      <Confetti active={confettiActive} />
      <Layout>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/courses" component={Courses} />
          <Route path="/quizzes" component={Quizzes} />
          <Route path="/streak" component={Streak} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/store" component={Store} />
          <Route path="/jobs" component={Jobs} />
          <Route path="/hire" component={Hire} />
          <Route path="/agent" component={Agent} />
          <Route path="/referral" component={Referral} />
          <Route path="/community" component={Community} />
          <Route path="/friends" component={Friends} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/settings" component={Settings} />
          <Route>
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-black mb-2">Page not found</h2>
              <p className="text-sm mb-4" style={{ color: "rgba(136,144,168,1)" }}>The page you're looking for doesn't exist.</p>
              <a href="/" className="px-4 py-2 rounded-xl font-bold text-sm gradient-bg text-white">Go Home</a>
            </div>
          </Route>
        </Switch>
      </Layout>
      <XPToastContainer />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <AppInner />
      </WouterRouter>
    </AppProvider>
  );
}
