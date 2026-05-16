import React from 'react';

export default function Contact() {
  return (
    <div className="min-h-screen text-slate-100 bg-transparent pt-8 px-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <p className="text-slate-300 text-lg mb-8">
        Have questions or need assistance with your event? Reach out to our support team.
      </p>
      
      <div className="bg-card/50 p-6 rounded-2xl border border-white/10 max-w-md">
        <h3 className="text-xl font-semibold mb-2">Campus Events Support Team</h3>
        <p className="text-slate-400 mb-1">Email: support@campusevents.com</p>
        <p className="text-slate-400 mb-4">Phone: +1 (800) 123-4567</p>
        <p className="text-slate-400 text-sm">Hours: Mon-Fri, 9:00 AM - 6:00 PM</p>
      </div>
    </div>
  );
}
