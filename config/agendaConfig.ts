export const AGENDA_CONFIG = {
  dayColors: [
    '#C9A05C',  // Day 1 - Gold
    '#4A90E2',  // Day 2 - Blue
    '#E94B3C'   // Day 3 - Red
  ],

  eventIcons: {
    'registration': 'clipboard',
    'opening': 'star',
    'theme': 'lightbulb',
    'team': 'users',
    'session': 'gamepad',
    'meal': 'utensils',
    'free': 'clock',
    
    'coffee': 'coffee',
    'development': 'code',
    'work': 'laptop',
    
    'announcement': 'bullhorn',
    'polish': 'magic',
    'submission': 'upload',
    'judging': 'gavel',
    'awards': 'trophy',
    'conclusion': 'flag-checkered'
  },

  autoIconMapping: [
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
    { keywords: ['awards', 'ceremony', 'جوائز', 'ختام'], icon: 'trophy' },
    { keywords: ['conclusion', 'ختام'], icon: 'flag-checkered' },
    { keywords: ['announcement', 'إعلان'], icon: 'bullhorn' }
  ]
};

export function getActivityIcon(activity: string): string {
  const activityLower = activity.toLowerCase();
  
  for (const mapping of AGENDA_CONFIG.autoIconMapping) {
    for (const keyword of mapping.keywords) {
      if (activityLower.includes(keyword.toLowerCase())) {
        return mapping.icon;
      }
    }
  }
  return 'clock';
}