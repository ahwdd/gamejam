import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 via-pink-500 to-red-500 text-white overflow-hidden">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="max-w-5xl">

          <div className="mb-8 animate-bounce">
            <span className="text-8xl">🎮</span>
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight mb-6 drop-shadow-2xl">
            <span className="block mb-2">STUDENT HUB</span>
            <span className="block text-4xl sm:text-5xl md:text-6xl text-yellow-300">
              ⚡ Game Jam Platform ⚡
            </span>
          </h1>

          <p className="text-2xl sm:text-3xl font-bold text-white/90 mb-4 drop-shadow-lg">
            Create • Compete • Conquer
          </p>

          <p className="text-lg sm:text-xl text-white/80 font-medium mb-12 max-w-2xl mx-auto">
            Join the ULTIMATE game jam experience! Team up with friends, build amazing games, and show the world what you can do! 🚀
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-xl px-12 py-6 shadow-2xl">
                🎮 Start Your Journey →
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button
                variant="outline"
                size="lg"
                className="text-xl px-12 py-6 bg-white/20 backdrop-blur-sm border-4 border-white hover:bg-white/30 shadow-2xl"
              >
                Sign In →
              </Button>
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border-4 border-white/20 hover:scale-105 transition-all">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-2xl font-black mb-2">Epic Events</h3>
              <p className="text-white/80 font-medium">
                Join game jams with cool prizes and awesome challenges!
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border-4 border-white/20 hover:scale-105 transition-all">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-black mb-2">Team Up</h3>
              <p className="text-white/80 font-medium">
                Find teammates and create games together!
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border-4 border-white/20 hover:scale-105 transition-all">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-black mb-2">Compete</h3>
              <p className="text-white/80 font-medium">
                Show off your skills and win amazing prizes!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center opacity-90">
          <p className="text-lg font-bold">
            Powered by creativity, teamwork, and passion! 💜
          </p>
        </div>
      </div>
    </div>
  );
}