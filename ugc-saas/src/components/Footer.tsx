import React from 'react'
import { Zap, Twitter, Github, Linkedin } from 'lucide-react'
import { Page } from '../types'

interface FooterProps {
  navigate: (p: Page) => void
}

const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="border-t border-gray-800 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-white" fill="white" />
              </div>
              <span className="font-bold text-xl">
                UG<span className="text-violet-400">Craft</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Create authentic, scroll-stopping UGC product videos with AI. Powered by Higgsfield's cutting-edge video generation.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="text-gray-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800">
                <Github size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Product</h3>
            <ul className="space-y-3">
              {[
                { label: 'Create Video', page: 'create' as Page },
                { label: 'My Library', page: 'library' as Page },
                { label: 'Dashboard', page: 'dashboard' as Page },
                { label: 'Pricing', page: 'pricing' as Page },
              ].map(({ label, page }) => (
                <li key={label}>
                  <button
                    onClick={() => navigate(page)}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Resources</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 UGCraft. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Powered by <span className="text-violet-500">Higgsfield AI</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
