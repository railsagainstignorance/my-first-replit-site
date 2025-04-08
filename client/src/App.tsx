import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import Collections from "@/pages/collections";
import Collection from "@/pages/collection";
import Articles from "@/pages/articles";
import Tags from "@/pages/tags";
import Tag from "@/pages/tag";
import Article from "@/pages/article";
import Groups from "@/pages/groups";
import Group from "@/pages/group";
import About from "@/pages/about";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/collections" component={Collections} />
          <Route path="/collections/:slug" component={Collection} />
          <Route path="/articles" component={Articles} />
          <Route path="/articles/:slug" component={Article} />
          <Route path="/tags" component={Tags} />
          <Route path="/tags/:tag" component={Tag} />
          <Route path="/groups" component={Groups} />
          <Route path="/groups/:slug" component={Group} />
          <Route path="/about" component={About} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
