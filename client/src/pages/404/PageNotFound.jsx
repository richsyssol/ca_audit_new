import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import React from "react";

function PageNotFound() {
  return (
    <ContentWrapper>
      <div className="h-screen flex flex-col justify-center bg-slate-100 items-center">
        <span className="text-9xl font-bold text-gray-700">404</span>
        <span className="text-4xl text-gray-700">Page not found!</span>
      </div>
    </ContentWrapper>
  );
}

export default PageNotFound;
