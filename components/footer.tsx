export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-white">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center font-bold text-white text-sm">G</div>
            <span className="text-lg font-bold">GlideReply</span>
          </div>
          <div className="flex gap-8 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="mailto:samuel@baget.ai" className="hover:text-white transition-colors">Contact Support</a>
          </div>
          <div className="text-sm">
            &copy; 2026 GlideReply Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}