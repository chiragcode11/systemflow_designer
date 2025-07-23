import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import Homepage from "pages/homepage";
import ComponentLibraryMarketplace from "pages/component-library-marketplace";
import CommunityGallery from "pages/community-gallery";
import AiDesignGenerator from "pages/ai-design-generator";
import InteractiveCanvasStudio from "pages/interactive-canvas-studio";
import CollaborationWorkspace from "pages/collaboration-workspace";
import InterviewPreparationHub from "pages/interview-preparation-hub";
import LearningCenter from "pages/learning-center";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Homepage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/component-library-marketplace" element={<ComponentLibraryMarketplace />} />
        <Route path="/community-gallery" element={<CommunityGallery />} />
        <Route path="/ai-design-generator" element={<AiDesignGenerator />} />
        <Route path="/interactive-canvas-studio" element={<InteractiveCanvasStudio />} />
        <Route path="/canvas-studio" element={<InteractiveCanvasStudio />} />
        <Route path="/collaboration-workspace" element={<CollaborationWorkspace />} />
        <Route path="/interview-preparation-hub" element={<InterviewPreparationHub />} />
        <Route path="/learning-center" element={<LearningCenter />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;