export const dummyChats = [
  {
    id: 1,
    name: "Sara Mohamed",
    avatar: "S",
    online: true,
    unread: 2,
    messages: [
      {
        id: 1,
        text: "Hi! I saw your E-Commerce Platform project. It looks amazing!",
        sender: "other",
        time: "14:00",
      },
      {
        id: 2,
        text: "Thank you! I appreciate your feedback.",
        sender: "me",
        time: "14:15",
      },
    ],
  },

  {
    id: 2,
    name: "Youssef Ali",
    avatar: "Y",
    online: false,
    unread: 0,
    messages: [
      {
        id: 1,
        text: "Can we schedule a meeting?",
        sender: "other",
        time: "10:15",
      },
    ],
  },

  {
    id: 3,
    name: "Fatima Recruiter",
    avatar: "F",
    online: true,
    unread: 1,
    replyIndex: 0,   //which reply we are on
      scriptedReplies: [
    "Great! We are currently looking for frontend interns.",
    "The internship lasts 3 months and is fully remote.",
    "Do you have any React projects you can share?",
    "Your experience sounds impressive!",
    "We would love to schedule an interview with you."
  ],
    messages: [
      {
        id: 1,
        text: "I'd like to discuss an internship opportunity.",
        sender: "other",
        time: "16:45",
      },
    ],
  },
];