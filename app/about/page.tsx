import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Brain, Target, Users, Heart, ArrowRight, CheckCircle, Award, TrendingUp } from "lucide-react"

export default function AboutPage() {
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
              <Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="/about" className="text-primary font-medium">
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
            Empowering Job Seekers with{" "}
            <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">AI-Powered</span>{" "}
            Interview Preparation
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            We believe everyone deserves the confidence and skills to succeed in their dream job interview. Our mission
            is to democratize interview preparation through cutting-edge AI technology.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                At CLARIO, we're on a mission to level the playing field in job interviews. We understand that
                interview anxiety and lack of practice opportunities can prevent talented individuals from showcasing
                their true potential.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Our AI-powered platform provides personalized, accessible, and effective interview preparation that
                adapts to each user's unique needs and goals.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-muted-foreground">Accessible interview preparation for everyone</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-muted-foreground">Personalized AI-driven feedback and coaching</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-muted-foreground">Continuous innovation in interview technology</span>
                </div>
              </div>
            </div>
            <div className="glass-card p-8 rounded-2xl">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                  <div className="text-sm text-muted-foreground">Success Stories</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary mb-2">95%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                  <div className="text-sm text-muted-foreground">Practice Sessions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary mb-2">4.9/5</div>
                  <div className="text-sm text-muted-foreground">User Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at AI Interview Pro
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="glass-card border-border/50 text-center">
              <CardHeader>
                <div className="p-3 bg-primary/20 rounded-lg w-fit mx-auto">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Excellence</CardTitle>
                <CardDescription>
                  We strive for excellence in every aspect of our platform, from AI accuracy to user experience
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-card border-border/50 text-center">
              <CardHeader>
                <div className="p-3 bg-secondary/20 rounded-lg w-fit mx-auto">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-xl">Accessibility</CardTitle>
                <CardDescription>
                  Making high-quality interview preparation accessible to job seekers from all backgrounds
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-card border-border/50 text-center">
              <CardHeader>
                <div className="p-3 bg-primary/20 rounded-lg w-fit mx-auto">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Innovation</CardTitle>
                <CardDescription>
                  Continuously pushing the boundaries of AI technology to improve interview preparation
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-card border-border/50 text-center">
              <CardHeader>
                <div className="p-3 bg-secondary/20 rounded-lg w-fit mx-auto">
                  <Heart className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-xl">Empathy</CardTitle>
                <CardDescription>
                  Understanding the challenges job seekers face and creating solutions that truly help
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Story</h2>
            <p className="text-xl text-muted-foreground">How AI Interview Pro came to be</p>
          </div>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="text-lg leading-relaxed mb-6">
              AI Interview Pro was born from a simple observation: talented individuals were missing out on great
              opportunities not because they lacked skills, but because they struggled with interview anxiety and lacked
              access to quality preparation resources.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Our founders, having experienced the challenges of job interviews firsthand, recognized the potential of
              AI to provide personalized, judgment-free practice environments. They envisioned a platform where anyone,
              regardless of their background or resources, could access world-class interview preparation.
            </p>
            <p className="text-lg leading-relaxed mb-8">
              Today, AI Interview Pro serves thousands of job seekers worldwide, helping them build confidence, improve
              their interview skills, and land their dream jobs. We're proud to be part of their success stories and
              continue to innovate in the interview preparation space.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Impact</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real results from real people who used AI Interview Pro
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card border-border/50 p-8 text-center">
              <div className="p-3 bg-primary/20 rounded-full w-fit mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-lg font-semibold text-foreground mb-2">Success Rate</div>
              <p className="text-muted-foreground">
                Of our users report feeling more confident and prepared for their interviews
              </p>
            </Card>
            <Card className="glass-card border-border/50 p-8 text-center">
              <div className="p-3 bg-secondary/20 rounded-full w-fit mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-secondary" />
              </div>
              <div className="text-3xl font-bold text-secondary mb-2">40%</div>
              <div className="text-lg font-semibold text-foreground mb-2">Improvement</div>
              <p className="text-muted-foreground">
                Average improvement in interview performance scores after using our platform
              </p>
            </Card>
            <Card className="glass-card border-border/50 p-8 text-center">
              <div className="p-3 bg-primary/20 rounded-full w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-lg font-semibold text-foreground mb-2">Success Stories</div>
              <p className="text-muted-foreground">
                Job seekers have successfully landed their dream jobs with our help
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Join Our Success Story</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Become part of the thousands who have transformed their interview skills with AI Interview Pro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
              <Link href="/auth/sign-up">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/features">Explore Features</Link>
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
                <span className="text-lg font-bold text-foreground">AI Interview Pro</span>
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
            <p>&copy; 2024 AI Interview Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
