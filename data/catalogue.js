/**
 * Mock IT Service Catalogue data.
 *
 * In production, replace this module with a call to your ITSM system
 * (e.g. ServiceNow, Freshservice, Jira Service Management) using the
 * user/org context decoded from the Happeo JWT.
 *
 * Each service object shape:
 *   id          {string}  Stable unique identifier
 *   name        {string}  Display name shown as the tile heading
 *   description {string}  Short description shown below the name
 *   category    {string}  Used for filtering and the category badge
 *   url         {string}  Deep-link to the service portal / request form
 */
const CATALOGUE = [
  {
    id: "email-collab",
    name: "Email & Collaboration",
    description:
      "Corporate email, calendar, and collaboration suite including messaging and video calls.",
    category: "Communication",
    url: "#",
  },
  {
    id: "file-storage",
    name: "File Storage & Sharing",
    description:
      "Secure cloud storage with version history, file sharing, and team drives.",
    category: "Storage",
    url: "#",
  },
  {
    id: "identity-access",
    name: "Identity & Access Management",
    description:
      "Single Sign-On, multi-factor authentication, and access provisioning for all systems.",
    category: "Security",
    url: "#",
  },
  {
    id: "remote-desktop",
    name: "Remote Desktop & VPN",
    description:
      "Secure remote access to your desktop and internal network resources from anywhere.",
    category: "Infrastructure",
    url: "#",
  },
  {
    id: "device-mgmt",
    name: "Device Management & Support",
    description:
      "Laptop/desktop setup, mobile device management, and IT hardware requests.",
    category: "Hardware",
    url: "#",
  },
  {
    id: "software-licensing",
    name: "Software & Licensing",
    description:
      "Request software installation, manage licenses, and access the approved software catalogue.",
    category: "Software",
    url: "#",
  },
  {
    id: "telephony",
    name: "Telephony & Video Conferencing",
    description:
      "Business phone system, conference room technology, and virtual meeting infrastructure.",
    category: "Communication",
    url: "#",
  },
  {
    id: "intranet",
    name: "Intranet & Internal Portals",
    description:
      "Company intranet, knowledge base, and internal self-service portals.",
    category: "Communication",
    url: "#",
  },
  {
    id: "web-cms",
    name: "Website & Content Management",
    description:
      "Public website CMS access, content publishing workflows, and web hosting.",
    category: "Web",
    url: "#",
  },
  {
    id: "networking",
    name: "Networking & Wi-Fi",
    description:
      "Office Wi-Fi onboarding, network access requests, and connectivity troubleshooting.",
    category: "Infrastructure",
    url: "#",
  },
  {
    id: "security-incident",
    name: "Security & Incident Reporting",
    description:
      "Report a security incident, phishing email, or data breach. 24/7 response available.",
    category: "Security",
    url: "#",
  },
  {
    id: "it-training",
    name: "IT Training & Onboarding",
    description:
      "Digital skills training, new employee IT orientation, and self-service how-to guides.",
    category: "Training",
    url: "#",
  },
];

module.exports = { CATALOGUE };
