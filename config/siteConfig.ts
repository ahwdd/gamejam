
export const CONFIG = {
  prizes: {
    topPrizes: [
      {
        place: 1,
        icon: '/icons/medal1.png',
        color: 'from-yellow-400 to-yellow-600',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500'
      },
      {
        place: 2,
        icon: '/icons/medal2.png',
        color: 'from-gray-300 to-gray-500',
        bgColor: 'bg-gray-400/20',
        borderColor: 'border-gray-400'
      },
      {
        place: 3,
        icon: '/icons/medal3.png',
        color: 'from-orange-400 to-orange-600',
        bgColor: 'bg-orange-500/20',
        borderColor: 'border-orange-500'
      }
    ],
    beyondIcon: '/icons/rocket.png'
  },
  getStarted: {
    items: [
      {
        key: 'submit',
        icon: '/icons/game-store.png',
        href: 'https://example.com/itch'
      },
      {
        key: 'rules',
        icon: '/icons/ruler.png',
        href: 'https://example.com/rules'
      },
      {
        key: 'join',
        icon: '/icons/user-check.png',
        href: null  // No link for this item
      },
      {
        key: 'tools',
        icon: '/icons/cpu.png',
        href: 'https://example.com/tools'
      }
    ]
  },
  judges: {
    team: [
      { key: 'member1', img: '/assets/team/Agatha.jpg' },
      { key: 'member2', img: '/assets/team/Ahmed.jpg' },
      { key: 'member3', img: '/assets/team/Corrie.jpg' },
      { key: 'member4', img: '/assets/team/Hamdan.jpg' },
      { key: 'member5', img: '/assets/team/Kalle.jpg' },
      { key: 'member6', img: '/assets/team/Zain.jpg' }
    ]
  },
  partners: [
    { name: 'Unity Technologies', logo: '/assets/logos/sp1.png' },
    { name: 'Abu Dhabi Gaming', logo: '/assets/logos/sp2.png' },
    { name: 'Abu Dhabi Heritage Authority', logo: '/assets/logos/sp3.png' }
  ],
  logos: {
    main: {
      en: '/assets/logos/gameathon-en.png',
      ar: '/assets/logos/gameathon-ar.png'
    },
    footer: '/assets/logos/ahw-logo.png'
  },
  urls: {
    register: 'https://example.com/register',
    maps: 'https://maps.google.com'
  }
};