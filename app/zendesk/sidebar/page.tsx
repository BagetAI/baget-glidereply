import { SidebarContainer } from "@/components/zendesk/sidebar-container";
import Script from "next/script";

export default function ZendeskSidebarPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-4">
      {/* Zendesk App Framework SDK */}
      <Script 
        src="https://static.zdassets.com/zendesk_app_framework_sdk/2.0/zaf_sdk.min.js" 
        strategy="beforeInteractive"
      />
      
      <div className="max-w-md mx-auto">
        <header className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-xs">
            G
          </div>
          <h1 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            GlideReply Copilot
          </h1>
        </header>

        <SidebarContainer />
      </div>
    </main>
  );
}
