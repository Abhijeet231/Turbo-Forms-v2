import { Card } from '@/components/ui/card';
import { Zap, Share2, BarChart3, Lock, Palette, Workflow } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built with modern tech. Forms load instantly. Responses recorded in real-time.',
  },
  {
    icon: Palette,
    title: 'Fully Customizable',
    description: 'Match your brand. Customize colors, fonts, and themes. Make it yours.',
  },
  {
    icon: Share2,
    title: 'Instant Sharing',
    description: 'Share forms with unique links. Public or unlisted. Your choice.',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    description: 'Track responses in real-time. See completion rates, drop-offs, and insights.',
  },
  {
    icon: Lock,
    title: 'Secure by Default',
    description: 'Your data is encrypted. HTTPS everywhere. Privacy-first approach.',
  },
  {
    icon: Workflow,
    title: 'Flexible Fields',
    description: 'Multiple field types. Conditional logic. Webhooks and API access.',
  },
];

export function LandingFeatures() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-background">
      <div className="max-w-5xl mx-auto w-full space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Everything You Need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you build, share, and analyze forms with ease.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="p-6 border-border bg-card hover:bg-muted transition-colors">
                <Icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold tracking-tight text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
