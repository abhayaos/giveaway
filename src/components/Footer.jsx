import { Gift, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
              <Gift className="text-white" />
              Abhaya Giveaway
            </div>
            <p className="text-gray-300 leading-relaxed max-w-md">
              Legitimate digital product giveaways with instant delivery.
              Founded by Abhaya Bikram Shahi.
              <br /><br />
              No scams. No hidden fees. Just real rewards for real people.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors duration-200">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#rules" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Rules
                </a>
              </li>
              <li>
                <a href="#winners" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Winners
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex items-center gap-3 mb-4">
              <a
                href="#"
                className="p-2 rounded-full border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 transition-all duration-200"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="p-2 rounded-full border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 transition-all duration-200"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="p-2 rounded-full border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 transition-all duration-200"
              >
                <Twitter size={18} />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Founded by <span className="text-white font-medium">Abhaya Bikram Shahi</span>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Abhaya Giveaway. All rights reserved.</p>
          <p className="mt-2 md:mt-0 text-gray-500">
            Founded by Abhaya Bikram Shahi
          </p>
        </div>

      </div>
    </footer>
  );
}
