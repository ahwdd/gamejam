import React from 'react';
import { redirect } from 'next/navigation';

export default function LandingPage() {

  redirect("/en");
  return (
      <div className="min-h-screen bg-black text-white">
      </div>
  );
}