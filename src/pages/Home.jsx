import {
  Gift,
  CheckCircle,
  Trophy,
  ShieldCheck,
  Users,
  ArrowRight,
  Laptop,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home() {
  const [recentWinners, setRecentWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentWinners = async () => {
      try {
        const response = await fetch('https://backend-giveaway.vercel.app/api/winners/recent');
        if (response.ok) {
          const data = await response.json();
          setRecentWinners(data);
        }
      } catch (err) {
        console.error('Error fetching recent winners:', err);
      }
    };

    fetchRecentWinners();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return "Today";
    if (diffDays <= 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* 1️⃣ Hero */}
      <section id="home" className="min-h-[90vh] flex items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
            <Star className="text-yellow-600" size={16} />
            <span>Limited Time Giveaway</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Win Premium <span className="text-black">Digital Products</span>
            <br />
            <span className="text-gray-700">Absolutely Free</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Access courses, software licenses, templates & premium subscriptions
            <br />
            <span className="font-medium">Delivered instantly to your inbox</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/participants"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-900 transition-all duration-300 font-semibold shadow-sm"
            >
              Enter Giveaway
              <ArrowRight size={20} />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* 2️⃣ How It Works */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Three easy steps to claim your free digital rewards
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="text-black" size={32} />,
                title: "Register",
                desc: "Sign up with your email and basic information"
              },
              {
                icon: <CheckCircle className="text-black" size={32} />,
                title: "Complete Tasks",
                desc: "Perform simple social engagement activities"
              },
              {
                icon: <Trophy className="text-black" size={32} />,
                title: "Claim Rewards",
                desc: "Receive premium digital products instantly"
              }
            ].map((item, i) => (
              <div
                key={i}
                className="group bg-white p-8 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-sm"
              >
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors duration-300">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">{item.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3️⃣ Rewards */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-6">
              <Laptop className="text-white" size={28} />
            </div>
            <h2 className="text-4xl font-bold mb-4">Premium Digital Rewards</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Valuable resources worth hundreds of dollars, completely free
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Online Courses",
                value: "$500+ value",
                desc: "Master new skills with premium educational content"
              },
              {
                title: "Software Licenses",
                value: "$200+ value",
                desc: "Access to professional tools and applications"
              },
              {
                title: "Design Templates",
                value: "$150+ value",
                desc: "Professional UI kits and code templates"
              },
              {
                title: "Premium Subscriptions",
                value: "$100+ value",
                desc: "Monthly access to exclusive platforms"
              }
            ].map((item, i) => (
              <div key={i} className="group bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300">
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <div className="text-sm font-medium text-gray-900 mb-3">{item.value}</div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4️⃣ Rules */}
      <section id="rules" className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Clear & Fair Rules</h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Transparency and fairness are our top priorities
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center mt-1">
                  <span className="text-gray-900 font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">One Entry Per Person</h3>
                  <p className="text-gray-300">Each individual can participate only once to ensure fair distribution</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center mt-1">
                  <span className="text-gray-900 font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Completely Free</h3>
                  <p className="text-gray-300">No payment, fees, or hidden costs required to participate</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center mt-1">
                  <span className="text-gray-900 font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Digital Delivery Only</h3>
                  <p className="text-gray-300">All rewards are delivered digitally via email or download links</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center mt-1">
                  <span className="text-gray-900 font-bold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Fair Selection Process</h3>
                  <p className="text-gray-300">Winners are chosen randomly using verified selection methods</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5️⃣ Winners */}
      <section id="winners" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-6">
              <ShieldCheck className="text-white" size={28} />
            </div>
            <h2 className="text-4xl font-bold mb-4">Recent Winners</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Real people winning real digital products every week
            </p>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              </div>
              <p className="text-gray-600">Loading recent winners...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-center">
              <p className="text-yellow-800 text-sm">{error}</p>
            </div>
          )}

          {!loading && (
            <div className="grid md:grid-cols-3 gap-8">
              {recentWinners.map((item, i) => (
                <div key={item.id || i} className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{item.date}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900">{item.prize}</h4>
                    <p className="text-sm text-gray-500 mt-1">{item.value}</p>
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">
                    <CheckCircle size={14} />
                    {item.claimed ? 'Claimed Successfully' : 'Winner Selected'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6️⃣ CTA */}
      <section id="join" className="py-24 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Claim Your
            <br />
            <span className="text-gray-300">Free Digital Rewards?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of participants who have already won valuable digital products
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/participants"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-300 font-semibold shadow-lg"
            >
              Enter Giveaway Now
              <ArrowRight size={20} />
            </Link>
            <a
              href="#rules"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 font-medium"
            >
              View Rules
            </a>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              Founded by Abhaya Bikram Shahi • Legitimate giveaways only
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
