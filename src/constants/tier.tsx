export type Tier = {
  name: string;
  id: string;
  href: string;
  priceMonthly: string;
  priceYearly: string;
  description: string;
  features: string[];
  featured: boolean;
  cta: string;
  onClick: () => void;
};

export const tiers: Tier[] = [
  {
    name: "Hobby",
    id: "tier-hobby",
    href: "#",
    priceMonthly: "Free",
    priceYearly: "Free",
    description:
      "Perfect for developers and small teams that want to get started with Context0.",
    features: [
      "10,000 memories",
      "Unlimited end users",
      "1,000 retrieval API calls/month",
      "Community Support",
    ],
    featured: false,
    cta: "Get Started",
    onClick: () => {},
  },
  {
    name: "Starter",
    id: "tier-starter",
    href: "#",
    priceMonthly: "$9/mo",
    priceYearly: "$99/yr",
    description:
      "Perfect for growing teams that need more power and flexibility.",
    features: [
      "50,000 memories",
      "Unlimited end users",
      "5,000 retrieval API calls/month",
      "Community Support",
    ],
    featured: false,
    cta: "Get Started",
    onClick: () => {},
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "#",
    priceMonthly: "$99/mo",
    priceYearly: "$999/yr",
    description:
      "Ideal for growing businesses that need a reliable, managed solution with generous free usage.",
    features: [
      "Unlimited memories",
      "Unlimited end users",
      "50,000 retrieval API calls/month",
      "Private Slack Channel",
      "Graph Memory",
      "Advanced Analytics",
      "Multiple projects support",
    ],
    featured: true,
    cta: "Get Started",
    onClick: () => {},
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "#",
    priceMonthly: "Flexible Pricing",
    priceYearly: "Flexible Pricing",
    description:
      "Designed for large organizations with advanced security, compliance, and scalability needs.",
    features: [
      "Unlimited memories",
      "Unlimited end users",
      "Unlimited API calls",
      "Private Slack Channel",
      "Graph Memory",
      "Advanced Analytics",
      "On-prem deployment",
      "SSO",
      "Audit Logs",
      "Custom Integrations",
      "SLA",
    ],
    featured: false,
    cta: "Contact Sales",
    onClick: () => {},
  },
];
