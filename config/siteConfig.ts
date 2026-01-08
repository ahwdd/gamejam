const  registerationLink= "https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAMAAaGjiwdUM0QwVzE1RUU5UVZKOTdCVUNLN1NEUVFIUC4u"
const itchLink = "https://turath-gameathon.itch.io"
const rolesLink = "https://docs.google.com/document/d/1hJFNvg9dkARJiKouY6w-Wt0N17JjhWEocOrXJrpUhVU/edit?tab=t.0"

export const CONFIG = {
  registerationLink,
  itchLink,
  rolesLink,

  prizes: {
    topPrizes: [
      {
        place: 2,
        key: 'second', en: '2nd Place', ar: 'المركز الثاني',
        icon: '/icons/medal2.png',
        shadow: '0 0 76.7866px rgba(200,164,127,0.3)',
        bgColor: 'linear-gradient(135deg, rgba(200,164,127,0.17), rgba(200,164,127,0.17))',
        borderColor: '5.11911px solid #C8A47F',
        iconBg: 'linear-gradient(180deg, #C8A47F, #E8BD92)',
        iconShadow: '0 0 76.7866px rgba(200,164,127,0.3)'
      },
      {
        place: 1,
        key: 'first', en: '1st Place', ar: 'المركز الأول',
        icon: '/icons/medal1.png',
        shadow: '0 0 81.1581px rgba(188,62,43,0.3)',
        bgColor: 'linear-gradient(135deg, rgba(188,62,43,0.05), rgba(233,97,76,0.05))',
        borderColor: '5.41054px solid #BC3E2B',
        iconBg: 'linear-gradient(180deg, #BC3E2B , #E9614C )',
        iconShadow: '0 0 81.1581px rgba(188, 62, 43, 0.3)'
      },
      {
        place: 3,
        key: 'third', en: '3rd Place', ar: 'المركز الثالث',
        icon: '/icons/medal3.png',
        shadow: '0 0 76.7866px rgba(54,71,70,0.3)',
        bgColor: 'linear-gradient(135deg, rgba(54,71,70,0.3), rgba(54,71,70,0.06))',
        borderColor: '5.11911px solid #364746',
        iconBg: 'linear-gradient(180deg, #364746, #6B8482)',
        iconShadow: '0 0 76.7866px rgba(54, 71, 70, 0.3)'
      }
    ],
    otherPrizes: [
      { key: 'fourth', en: '4th Place', ar: 'المركز الرابع' },
      { key: 'fifth', en: '5th Place', ar: 'المركز الخامس' }
    ],
    beyondIcon: '/icons/rocket.png'
  },

  getStarted: {
    items: [
      {
        key: 'submit',
        icon: '/icons/game-store.png',
        href: itchLink,
        external: true
      },
      {
        key: 'rules',
        icon: '/icons/ruler.png',
        href: '/rules',
      },
      {
        key: 'join',
        icon: '/icons/user-check.png',
        href: null
      },
      {
        key: 'tools',
        icon: '/icons/cpu.png',
        href: null
      }
    ]
  },

  judges: {
    // team: [
    //   { key: 'member1', img: '/assets/team/Agatha.jpg', role: 'judge' },
    //   { key: 'member2', img: '/assets/team/Kalle.jpg', role: 'judge' },
    //   { key: 'member3', img: '/assets/team/Hamdan.jpg', role: 'judge' },
    //   { key: 'member4', img: '/assets/team/Marcos.jpg', role: 'judge' },
    //   { key: 'member5', img: '/assets/team/Saeed.jpg', role: 'judge' },
    //   { key: 'member6', img: '/assets/team/Corrie.jpg', role: 'mentor' },
    //   { key: 'member7', img: '/assets/team/Ahmed.jpg', role: 'mentor' },
    //   { key: 'member8', img: '/assets/team/Zain.jpg', role: 'mentor' },
    //   // { key: 'member9', img: '/assets/team/Mohamed.jpg', role: 'mentor' },
    // ],
    judges: [
      {
        img: '/assets/team/Agatha.jpg',
        enName: 'Agatha Hood', arName: 'أجاثا هود',
        enRole: 'Judge', arRole: 'حَكَم'
      },
      {
        img: '/assets/team/Kalle.jpg',
        enName: 'Kalle Hiitola', arName: 'كالي هيتولا',
        enRole: 'Judge', arRole: 'حَكَم'
      },
      {
        img: '/assets/team/Hamdan.jpg',
        enName: 'Hamdan Al-Ali', arName: 'حمدان العلي',
        enRole: 'Judge', arRole: 'حَكَم'
      },
      {
        img: '/assets/team/Marcos.jpg',
        enName: 'Marcos Muller Habig', arName: 'ماركوس مولر-هابِغ',
        enRole: 'Judge', arRole: 'حَكَم'
      },
      {
        img: '/assets/team/Saeed.jpg',
        enName: 'Saeed Mohamed Al Mehairi', arName: 'سعيد محمد المهيري',
        enRole: 'Judge', arRole: 'حَكَم'
      }
    ],
    mentors: [
      {
        img: '/assets/team/Corrie.jpg',
        enName: 'Corrie Green', arName: 'كوري جرين',
        enRole: 'Mentor', arRole: 'مُوجِّه'
      },
      {
        img: '/assets/team/Ahmed.jpg',
        enName: 'Ahmed Shweiki', arName: 'أحمد شويكي',
        enRole: 'Mentor', arRole: 'مُوجِّه'
      },
      {
        img: '/assets/team/Zain.jpg',
        enName: 'Zain Al Qudah', arName: 'زين القضاة',
        enRole: 'Mentor', arRole: 'مُوجِّه'
      }
    ]
  },

  agenda: {
    dayColors: ['#C9A05C', '#4A90E2', '#E94B3C'],
    
    iconMappings: [
      { keywords: ['registration', 'تسجيل'], icon: 'clipboard' },
      { keywords: ['opening', 'ceremony', 'افتتاح'], icon: 'star' },
      { keywords: ['theme', 'reveal', 'كشف'], icon: 'lightbulb' },
      { keywords: ['team', 'formation', 'فرق'], icon: 'users' },
      { keywords: ['design', 'prototyping', 'تصميم', 'نماذج'], icon: 'gamepad' },
      { keywords: ['dinner', 'lunch', 'breakfast', 'عشاء', 'غداء', 'إفطار'], icon: 'utensils' },
      { keywords: ['free', 'work', 'حر'], icon: 'clock' },
      { keywords: ['coffee', 'قهوة'], icon: 'coffee' },
      { keywords: ['development', 'session', 'تطوير', 'جلسة'], icon: 'code' },
      { keywords: ['polish', 'صقل'], icon: 'magic' },
      { keywords: ['submission', 'deadline', 'تسليم'], icon: 'upload' },
      { keywords: ['judging', 'evaluation', 'تحكيم', 'تقييم'], icon: 'gavel' },
      { keywords: ['awards', 'جوائز'], icon: 'trophy' },
      { keywords: ['conclusion', 'ختام'], icon: 'flag-checkered' },
      { keywords: ['announcement', 'إعلان'], icon: 'bullhorn' }
    ]
  },

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