import React from 'react';
import { BookOpen, CheckCircle, Award, Users, Clock, Star } from 'lucide-react';

function Rules() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-6">
            <BookOpen className="text-white" size={28} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Giveaway Rules</h1>
          <p className="text-xl text-gray-600">Complete transparency of our fair and secure giveaway process</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Rules */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Participation Rules */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Award className="text-yellow-500" size={28} />
                Participation Rules
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Free Entry</h3>
                    <p className="text-gray-600">All giveaways are completely free to enter. No purchase necessary.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900">One Entry Per Person</h3>
                    <p className="text-gray-600">Each user may enter each giveaway only once to ensure fairness.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Valid Information</h3>
                    <p className="text-gray-600">Provide accurate contact information to receive your prize if you win.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Age Requirement</h3>
                    <p className="text-gray-600">Participants must be 18 years or older to enter giveaways.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Eligibility Rules */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Users className="text-blue-500" size={28} />
                Eligibility
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Geographic Restrictions</h3>
                    <p className="text-gray-600">Currently available to residents of the United States and Canada.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Account Requirements</h3>
                    <p className="text-gray-600">Must have a valid account with verified contact information.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Prohibited Activities</h3>
                    <p className="text-gray-600">Multiple accounts, bots, or automated entry methods are prohibited.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Selection Process */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="text-purple-500" size={20} />
                Selection Process
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="font-semibold">Random Draw</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transparency:</span>
                  <span className="font-semibold">Public</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Verification:</span>
                  <span className="font-semibold">Manual Review</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Notification:</span>
                  <span className="font-semibold">Within 24h</span>
                </div>
              </div>
            </div>
            
            {/* Timeline */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="text-orange-500" size={20} />
                Timeline
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Entry Period:</span>
                  <span className="font-semibold">Varies</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Winner Selection:</span>
                  <span className="font-semibold">Immediate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prize Delivery:</span>
                  <span className="font-semibold">24-48h</span>
                </div>
              </div>
            </div>
            
            {/* Contact */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
              <p className="text-gray-300 text-sm mb-4">
                Have questions about our rules? Contact our support team for assistance.
              </p>
              <button className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-300 text-sm font-semibold">
                Contact Support
              </button>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How are winners selected?</h3>
              <p className="text-gray-600">Winners are selected through a completely random drawing process that ensures fairness. We use a cryptographically secure random number generator, and the selection process is recorded for transparency.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I receive my prize?</h3>
              <p className="text-gray-600">If you win, you'll receive an email notification within 24 hours. You'll need to confirm your information and provide shipping details if required. Digital prizes are delivered via email.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I enter multiple giveaways?</h3>
              <p className="text-gray-600">Yes, you can enter as many different giveaways as you'd like. However, you can only enter each specific giveaway once.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens if I win?</h3>
              <p className="text-gray-600">Winners are notified via email and must claim their prize within 7 days. Unclaimed prizes will be re-awarded to another participant.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rules;