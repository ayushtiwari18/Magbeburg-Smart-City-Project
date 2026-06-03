"use client";
import Image from "next/image";
import { useState } from "react";
import { Shield, AlertTriangle, PhoneCall, MapPin, Users, X, Send } from "lucide-react";
import Container from "@/components/layout/Container";

const safetyInitiatives = [
  { icon: AlertTriangle, color: "text-blue-700",   bg: "bg-blue-50",   title: "Smart Surveillance",  description: "AI-powered camera networks monitor public spaces 24/7, detecting unusual activity and alerting emergency services in real time.",      image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&q=80",  delay: "delay-100" },
  { icon: PhoneCall,     color: "text-green-700",  bg: "bg-green-50",  title: "Emergency Response", description: "Integrated SOS stations placed across the city connect citizens directly to emergency services with one press.",                        image: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=600&q=80", delay: "delay-200" },
  { icon: MapPin,        color: "text-violet-700", bg: "bg-violet-50", title: "Incident Mapping",    description: "A live city-wide map tracks reported incidents, road hazards, and safety alerts to keep residents informed.",                        image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&q=80",  delay: "delay-300" },
  { icon: Users,         color: "text-amber-700",  bg: "bg-amber-50",  title: "Community Watch",     description: "Citizens can report safety concerns via the app, building a collaborative network of community awareness.",                           image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",  delay: "delay-400" },
];

const stats = [
  { value: "94%",    label: "Response Rate" },
  { value: "< 4 min", label: "Avg. Emergency Response" },
  { value: "320+",   label: "Smart Cameras" },
  { value: "12K+",   label: "Citizens Connected" },
];

const issueTypes = ["Broken Streetlight", "Suspicious Activity", "Road Hazard", "Vandalism", "Noise Complaint", "Other"];

export default function Safety() {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", type: issueTypes[0], description: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setModalOpen(false); setSubmitted(false); setForm({ name: "", location: "", type: issueTypes[0], description: "" }); }, 2200);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero */}
      <section className="relative h-[420px] sm:h-[480px]">
        <Image src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=85" alt="Safety" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061B46]/90 via-[#061B46]/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <Container>
            <div className="max-w-xl animate-fade-up">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm">
                <Shield className="h-4 w-4 text-blue-300" />
                <span className="text-sm font-medium text-blue-200 uppercase tracking-widest">Smart City Magdeburg</span>
              </div>
              <h1 className="text-5xl font-bold text-white tracking-tight sm:text-6xl">Safety</h1>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed">Building a safer Magdeburg for every resident — through smart technology, real-time monitoring, and community cooperation.</p>
              <button onClick={() => setModalOpen(true)}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#061B46] shadow-lg transition hover:bg-blue-50 hover:scale-105 active:scale-95">
                <Send size={16} /> Report an Issue
              </button>
            </div>
          </Container>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#061B46]">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {stats.map((s, i) => (
              <div key={s.label} className={`flex flex-col items-center justify-center py-8 px-4 text-center animate-fade-up delay-${(i + 1) * 100}`}>
                <span className="text-3xl font-bold text-white">{s.value}</span>
                <span className="mt-1 text-sm text-blue-300">{s.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Cards */}
      <section className="py-20">
        <Container>
          <h2 className="text-3xl font-bold text-[#061B46] mb-3 animate-fade-up">Safety Initiatives</h2>
          <p className="text-slate-500 mb-12 animate-fade-up delay-100">Comprehensive programmes keeping Magdeburg safe around the clock.</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {safetyInitiatives.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className={`group flex flex-col rounded-[28px] border border-slate-200 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-scale-in ${item.delay}`}>
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image src={item.image} alt={item.title} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${item.bg}`}>
                      <Icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-[#061B46]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-500 flex-1">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Floating FAB */}
      <button onClick={() => setModalOpen(true)}
        className="fixed bottom-8 right-8 z-40 flex items-center gap-2 rounded-full bg-[#061B46] px-5 py-3.5 text-sm font-bold text-white shadow-2xl transition hover:scale-105 hover:bg-blue-700 active:scale-95">
        <Send size={16} /> Report Issue
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-[28px] bg-white shadow-2xl animate-scale-in">
            {!submitted ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 p-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#061B46]">Report a Safety Issue</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Help us keep Magdeburg safe</p>
                  </div>
                  <button onClick={() => setModalOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Your Name</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      placeholder="Max Mustermann" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Location</label>
                    <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      placeholder="e.g. Breiter Weg, Altstadt" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Issue Type</label>
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                      {issueTypes.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Description</label>
                    <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                      placeholder="Describe what you observed..." />
                  </div>
                  <button type="submit"
                    className="w-full rounded-xl bg-[#061B46] py-3 text-sm font-bold text-white transition hover:bg-blue-700">
                    Submit Report
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                  <span className="text-3xl">✅</span>
                </div>
                <h3 className="text-xl font-bold text-[#061B46]">Report Submitted!</h3>
                <p className="text-sm text-slate-500 mt-2">Thank you, {form.name}. Our team will review your report shortly.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
