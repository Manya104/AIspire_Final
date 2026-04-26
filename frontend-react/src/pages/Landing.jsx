import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative px-6 md:px-20 pt-16 pb-14 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[380px] bg-gradient-to-br from-accent-blue/5 via-accent-pink/5 to-primary/5 rounded-full blur-[120px] -z-10"></div>
        <div className="max-w-[960px] mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <span className="size-2 bg-primary rounded-full animate-pulse"></span>
            Discover Your Future
          </div>
          <h1 className="text-slate-900 text-5xl md:text-7xl font-black leading-tight tracking-tight mb-4">
            AISPIRE
          </h1>
          <p className="max-w-2xl text-slate-600 text-lg md:text-xl font-normal leading-relaxed mb-10">
            A blend of AI and aspire. Explore careers with intent-aware search and personalized paths.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/search"
              className="inline-flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-12 px-8 bg-primary text-white text-base font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95"
            >
              Start Now
            </Link>
            <Link
              to="/accessible"
              className="inline-flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-12 px-8 border-2 border-slate-300 text-slate-700 text-base font-semibold hover:border-primary hover:text-primary transition-colors"
            >
              Accessible Mode
            </Link>
          </div>
        </div>
      </section>

      {/* Capability Cards */}
      <section className="px-6 md:px-20 py-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: 'travel_explore', label: 'Semantic Search', color: 'text-accent-blue' },
              { icon: 'dataset', label: 'Vector Retrieval', color: 'text-accent-pink' },
              { icon: 'psychology', label: 'Intent Analysis', color: 'text-primary' },
              { icon: 'chat_bubble', label: 'Contextual Query', color: 'text-accent-blue' },
              { icon: 'hub', label: 'Knowledge Graph', color: 'text-accent-pink' },
              { icon: 'api', label: 'API Access', color: 'text-primary' },
            ].map((card) => (
              <div
                key={card.label}
                className="flex flex-col items-center gap-4 p-6 rounded-xl border border-slate-200 bg-white hover:border-primary/40 hover:bg-primary/5 transition-all group"
              >
                <span className={`material-symbols-outlined ${card.color} text-3xl group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </span>
                <span className="text-sm font-bold text-slate-800">{card.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intent-Aware Section */}
      <section className="px-6 md:px-20 py-16 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Unveiling the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-pink">
                Intent-Aware
              </span>{' '}
              Capability
            </h2>
            <p className="text-lg text-slate-600">
              Traditional search engines match keywords. AISPIRE understands the{' '}
              <span className="font-bold text-slate-800 italic">why</span> behind your query.
              Our system decodes the underlying motivation of the user to deliver results that
              don't just match, but solve.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
              <div className="flex gap-4">
                <div className="flex-none size-12 rounded-lg bg-accent-blue/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-accent-blue">filter_drama</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Cognitive Layer</h4>
                  <p className="text-sm text-slate-500">
                    Maps logical intent across multi-dimensional vector space.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-none size-12 rounded-lg bg-accent-pink/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-accent-pink">dynamic_form</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Adaptive Re-ranking</h4>
                  <p className="text-sm text-slate-500">
                    Continuously refines results based on interaction context.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 relative w-full min-h-[320px] lg:min-h-0">
            <div className="relative w-full aspect-square max-w-md mx-auto rounded-2xl bg-gradient-to-tr from-primary/10 to-accent-blue/10 border border-slate-200 p-8 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
              <div className="relative size-48 md:size-64 flex items-center justify-center">
                <div className="absolute inset-0 border-[3px] border-accent-blue/30 rounded-lg scale-110"></div>
                <div className="absolute inset-0 border-[3px] border-accent-pink/30 rounded-lg scale-75 border-dashed"></div>
                <div className="absolute inset-0 border-2 border-primary/20 rounded-lg animate-spin-slow"></div>
                <span className="material-symbols-outlined text-6xl md:text-7xl text-primary font-light relative z-10">
                  mindfulness
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur rounded-lg border border-slate-200 shadow-xl">
                <div className="flex items-center gap-3">
                  <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-xs font-mono text-slate-600">Processing latent intent vectors...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scrolling Features Strip */}
      <section className="w-full overflow-hidden border-y border-slate-200 bg-white/60 py-6">
        <div className="whitespace-nowrap scrolling-text text-base font-semibold text-slate-600">
          {[
            'AI-Powered Search', 'Personalized Career Suggestions', 'Accessibility Built-In',
            'Semantic AI Search', 'Fast & Accurate Matching', 'Secure & Private',
            'Training Center near You', 'Explore 1000+ Career Paths', 'Customized Job Cards',
          ].map((feat) => (
            <span key={feat} className="inline-block mx-10">{feat}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
