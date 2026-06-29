import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-background">
      <DottedGlowBackground
        className="z-7"
        gap={24}
        radius={1.5}
        color="rgba(0,0,0,0.4)"
        darkColor="rgba(255,255,255,0.3)"
        glowColor="rgba(139, 92, 246, 0.9)"
        darkGlowColor="rgba(139, 92, 246, 0.9)"
        opacity={0.6}
        speedScale={0.8}
        speedMin={0.3}
        speedMax={1.3}
      />

      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Create Beautiful Forms,
            <span className="block text-muted-foreground">
              Without the Complexity
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            TurboForms is a modern form builder designed for creators. Build
            dynamic forms, collect responses, and share them instantly. No
            coding required.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button size="lg" className="gap-2">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline">
            View Demo
          </Button>
        </div>

        <div className="pt-12 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Trusted by creators worldwide
          </p>
          <div className="flex justify-center gap-8 text-muted-foreground text-sm">
            <span>1000+ Forms Created</span>
            <span>•</span>
            <span>10k+ Responses</span>
            <span>•</span>
            <span>99.9% Uptime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
