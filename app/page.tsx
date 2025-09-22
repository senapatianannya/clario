import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Brain, Mic, Target, Star, ArrowRight, Play, MessageSquare, BarChart3, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">CLARIO</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors">
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
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Star className="h-4 w-4" />
              Trusted by 10,000+ job seekers
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Master Your Next Interview with{" "}
              <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
                AI-Powered
              </span>{" "}
              Practice
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
              Get personalized interview questions, real-time feedback, and  with our advanced AI
              assistant. Practice like it's the real thing. Developed By (Ananya, Jyoti, Romiya, Biswajit)
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                <Link href="/auth/sign-up">
                  Start Practicing Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                <Link href="#demo">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Ace Your Interview
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our  platform provides comprehensive interview preparation tools
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-card border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="p-2 bg-primary/20 rounded-lg w-fit">
                  <Mic className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">CLARIO</CardTitle>
                <CardDescription>
                  Practice with our advanced voice AI that conducts realistic interview conversations
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-card border-border/50 hover:border-secondary/50 transition-colors">
              <CardHeader>
                <div className="p-2 bg-secondary/20 rounded-lg w-fit">
                  <Brain className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-xl">Smart Question Generation</CardTitle>
                <CardDescription>
                  Get personalized questions based on your target role and experience level
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-card border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="p-2 bg-primary/20 rounded-lg w-fit">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Real-time Feedback</CardTitle>
                <CardDescription>
                  Receive instant analysis of your responses with detailed improvement suggestions
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-card border-border/50 hover:border-secondary/50 transition-colors">
              <CardHeader>
                <div className="p-2 bg-secondary/20 rounded-lg w-fit">
                  <Target className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-xl">Progress Tracking</CardTitle>
                <CardDescription>
                  Monitor your improvement over time with detailed analytics and scoring
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-card border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="p-2 bg-primary/20 rounded-lg w-fit">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Interview Transcripts</CardTitle>
                <CardDescription>
                  Review complete transcripts of your practice sessions for detailed analysis
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-card border-border/50 hover:border-secondary/50 transition-colors">
              <CardHeader>
                <div className="p-2 bg-secondary/20 rounded-lg w-fit">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-xl">Secure & Private</CardTitle>
                <CardDescription>Your practice sessions and data are completely secure and private</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes and begin improving your interview skills
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-4 bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Choose Your Role</h3>
              <p className="text-muted-foreground">
                Select your target job position and experience level to get personalized questions
              </p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-secondary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-secondary">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Practice with AI</h3>
              <p className="text-muted-foreground">
                Engage in realistic interview conversations with our advanced voice AI assistant
              </p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Get Feedback</h3>
              <p className="text-muted-foreground">
                Receive detailed analysis and improvement suggestions to ace your real interview
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">50K+</div>
              <div className="text-muted-foreground">Practice Sessions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">4.9/5</div>
              <div className="text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Land Your Dream Job?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of successful candidates who used CLARIO to ace their interviews
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
              <Link href="/auth/sign-up">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary rounded-lg">
                  <Brain className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">CLARIO</span>
              </div>
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
            <p>&copy; CLARIO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
