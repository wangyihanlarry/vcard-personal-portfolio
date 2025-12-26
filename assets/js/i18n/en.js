/**
 * English translations for vCard Personal Portfolio
 */
const translations_en = {
  // Personal Information
  personal: {
    name: "Richard hanrick",
    title: "Web developer",
    showContacts: "Show Contacts"
  },

  // Contact Information
  contact: {
    email: {
      label: "Email"
    },
    phone: {
      label: "Phone"
    },
    birthday: {
      label: "Birthday",
      value: "June 23, 1982"
    },
    location: {
      label: "Location",
      value: "Sacramento, California, USA"
    },
    title: "Contact",
    form: {
      title: "Contact Form",
      fullName: "Full name",
      email: "Email address",
      message: "Your Message",
      send: "Send Message"
    }
  },

  // Navigation
  nav: {
    about: "About",
    resume: "Resume",
    portfolio: "Portfolio",
    blog: "Blog",
    contact: "Contact"
  },

  // About Page
  about: {
    title: "About me",
    description1: "I'm Creative Director and UI/UX Designer from Sydney, Australia, working in web development and print media. I enjoy turning complex problems into simple, beautiful and intuitive designs.",
    description2: "My job is to build your website so that it is functional and user-friendly but at the same time attractive. Moreover, I add personal touch to your product and make sure that is eye-catching and easy to use. My aim is to bring across your message and identity in the most creative way. I created web design for many famous brand companies."
  },

  // Services Section
  services: {
    title: "What i'm doing",
    webDesign: {
      title: "Web design",
      description: "The most modern and high-quality design made at a professional level."
    },
    webDevelopment: {
      title: "Web development",
      description: "High-quality development of sites at the professional level."
    },
    mobileApps: {
      title: "Mobile apps",
      description: "Professional development of applications for iOS and Android."
    },
    photography: {
      title: "Photography",
      description: "I make high-quality photos of any category at a professional level."
    }
  },

  // Testimonials Section
  testimonials: {
    title: "Testimonials",
    daniel: {
      name: "Daniel lewis",
      text: "Richard was hired to create a corporate identity. We were very pleased with the work done. She has a lot of experience and is very concerned about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt consectetur adipiscing elit, seds do et eiusmod tempor incididunt ut laborels dolore magnarels alia."
    },
    jessica: {
      name: "Jessica miller",
      text: "Richard was hired to create a corporate identity. We were very pleased with the work done. She has a lot of experience and is very concerned about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt consectetur adipiscing elit, seds do et eiusmod tempor incididunt ut laborels dolore magnarels alia."
    },
    emily: {
      name: "Emily evans",
      text: "Richard was hired to create a corporate identity. We were very pleased with the work done. She has a lot of experience and is very concerned about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt consectetur adipiscing elit, seds do et eiusmod tempor incididunt ut laborels dolore magnarels alia."
    },
    henry: {
      name: "Henry william",
      text: "Richard was hired to create a corporate identity. We were very pleased with the work done. She has a lot of experience and is very concerned about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt consectetur adipiscing elit, seds do et eiusmod tempor incididunt ut laborels dolore magnarels alia."
    }
  },

  // Clients Section
  clients: {
    title: "Clients"
  },

  // Resume Page
  resume: {
    title: "Resume",
    education: {
      title: "Education",
      university: {
        title: "University school of the arts",
        period: "2007 — 2008",
        description: "Nemo enims ipsam voluptatem, blanditiis praesentium voluptum delenit atque corrupti, quos dolores et quas molestias exceptur."
      },
      academy: {
        title: "New york academy of art",
        period: "2006 — 2007",
        description: "Ratione voluptatem sequi nesciunt, facere quisquams facere menda ossimus, omnis voluptas assumenda est omnis.."
      },
      highschool: {
        title: "High school of art and design",
        period: "2002 — 2004",
        description: "Duis aute irure dolor in reprehenderit in voluptate, quila voluptas mag odit aut fugit, sed consequuntur magni dolores eos."
      }
    },
    experience: {
      title: "Experience",
      creative: {
        title: "Creative director",
        period: "2015 — Present",
        description: "Nemo enim ipsam voluptatem blanditiis praesentium voluptum delenit atque corrupti, quos dolores et qvuas molestias exceptur."
      },
      art: {
        title: "Art director",
        period: "2013 — 2015",
        description: "Nemo enims ipsam voluptatem, blanditiis praesentium voluptum delenit atque corrupti, quos dolores et quas molestias exceptur."
      },
      web: {
        title: "Web designer",
        period: "2010 — 2013",
        description: "Nemo enims ipsam voluptatem, blanditiis praesentium voluptum delenit atque corrupti, quos dolores et quas molestias exceptur."
      }
    },
    skills: {
      title: "My skills",
      webDesign: "Web design",
      graphicDesign: "Graphic design",
      branding: "Branding",
      wordpress: "WordPress"
    }
  },

  // Portfolio Page
  portfolio: {
    title: "Portfolio",
    filter: {
      all: "All",
      webDesign: "Web design",
      applications: "Applications",
      webDevelopment: "Web development",
      selectCategory: "Select category"
    }
  },

  // Blog Page
  blog: {
    title: "Blog"
  },

  // Common Terms
  common: {
    present: "Present",
    loading: "Loading...",
    error: "Error"
  }
};

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = translations_en;
} else {
  window.translations_en = translations_en;
}