import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import {
  Brain,
  Mic,
  Target,
  BarChart3,
  MessageSquare,
  Shield,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Zap,
  Globe,
  Award,
} from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">CLARIO</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/features" className="text-primary font-medium">
                Features
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/auth/login" className="text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Powerful Features for{" "}
            <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
              Interview Success
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Discover all the tools and capabilities that make CLARIO the ultimate platform for interview
            preparation
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <div className="p-3 bg-primary/20 rounded-lg w-fit mb-4">
                <Mic className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">AI Voice Assistant</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Practice with our advanced AI that conducts natural, conversational interviews. Our voice assistant
                understands context, asks follow-up questions, and provides a realistic interview experience.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-muted-foreground">Natural conversation flow</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-muted-foreground">Context-aware responses</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-muted-foreground">Multiple voice options</span>
                </li>
              </ul>
            </div>
            <div className="glass-card p-8 rounded-2xl">
              <div className="bg-primary/10 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">AI Assistant is speaking...</span>
                </div>
                <p className="text-foreground">
                  "Tell me about a challenging project you worked on and how you overcame the obstacles."
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 lg:order-1">
              <div className="glass-card p-8 rounded-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Communication Skills</span>
                    <span className="text-sm font-medium text-secondary">92%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full" style={{ width: "92%" }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Technical Knowledge</span>
                    <span className="text-sm font-medium text-primary">88%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "88%" }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Problem Solving</span>
                    <span className="text-sm font-medium text-secondary">95%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full" style={{ width: "95%" }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="p-3 bg-secondary/20 rounded-lg w-fit mb-4">
                <BarChart3 className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Real-time Feedback & Scoring</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Get instant analysis of your performance with detailed scoring across multiple dimensions. Our AI
                evaluates your responses and provides actionable improvement suggestions.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">Instant performance scoring</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">Detailed improvement suggestions</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">Progress tracking over time</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Complete Interview Preparation</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to succeed in your next interview
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-card border-border/50">
              <CardHeader>
                <Brain className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Smart Question Generation</CardTitle>
                <CardDescription>
                  AI generates personalized questions based on your target role, experience level, and industry
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-card border-border/50">
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-secondary mb-2" />
                <CardTitle>Interview Transcripts</CardTitle>
                <CardDescription>
                  Complete transcripts of your practice sessions for detailed review and analysis
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-card border-border/50">
              <CardHeader>
                <Target className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>
                  Monitor your improvement over time with detailed analytics and performance metrics
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-card border-border/50">
              <CardHeader>
                <Clock className="h-8 w-8 text-secondary mb-2" />
                <CardTitle>Flexible Scheduling</CardTitle>
                <CardDescription>
                  Practice anytime, anywhere with our 24/7 available AI interview assistant
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-card border-border/50">
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Your practice sessions and personal data are completely secure and private
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-card border-border/50">
              <CardHeader>
                <Globe className="h-8 w-8 text-secondary mb-2" />
                <CardTitle>Multi-Industry Support</CardTitle>
                <CardDescription>
                  Specialized questions and scenarios for various industries and job roles
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Advanced Capabilities</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge features that set us apart from other interview preparation tools
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glass-card border-border/50 p-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Adaptive Difficulty</h3>
                  <p className="text-muted-foreground">
                    Our AI adjusts question difficulty based on your performance, ensuring optimal challenge level for
                    continuous improvement.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="glass-card border-border/50 p-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-secondary/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Performance Analytics</h3>
                  <p className="text-muted-foreground">
                    Detailed analytics dashboard showing your strengths, weaknesses, and improvement trends over time.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="glass-card border-border/50 p-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Mock Panel Interviews</h3>
                  <p className="text-muted-foreground">
                    Practice with multiple AI interviewers simulating real panel interview scenarios with different
                    personalities.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="glass-card border-border/50 p-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-secondary/20 rounded-lg">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Certification Ready</h3>
                  <p className="text-muted-foreground">
                    Prepare for technical certifications with specialized question banks and assessment criteria.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Experience These Features?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start your free trial today and discover how CLARIO can transform your interview preparation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
              <Link href="/auth/sign-up">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary rounded-lg">
                  <Brain className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">CLARIO</span>
              </Link>
              <p className="text-muted-foreground text-sm">
                Master your next interview with AI-powered practice and real-time feedback.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Account</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/auth/login" className="hover:text-foreground transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/auth/sign-up" className="hover:text-foreground transition-colors">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="mailto:support@aiinterviewpro.com" className="hover:text-foreground transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 CLARIO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
