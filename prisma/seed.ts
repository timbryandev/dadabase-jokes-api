import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function seed() {
  await Promise.all(
    getJokes().map(joke => {
      return db.joke.create({ data: joke })
    }),
  )
}

seed()

function getJokes() {
  // shout-out to https://icanhazdadjoke.com/

  return [
    {
      name: 'Squirrel 🐿',
      nsfw: false,
      content: 'How do you get a squirrel to like you? Act like a nut.',
    },
    {
      name: 'A Idiot',
      nsfw: false,
      content: `If you don't know the difference between "their" and "they're" - your a idiot.`,
    },
    {
      name: 'Banana',
      nsfw: false,
      content:
        'Why did Billy get fired from the banana factory? He kept throwing away the bent ones.',
    },
    {
      name: 'Book Shelf',
      nsfw: false,
      content: 'When I think about books - I touch my shelf.',
    },
    {
      name: 'Braille',
      nsfw: false,
      content:
        "I've been trading a horror story in Braille - something bad is going to happen, I can feel it.",
    },
    {
      name: 'Bruce',
      nsfw: false,
      content: 'Bruce Lee was fast, but his brother Sudden was much faster.',
    },
    {
      name: 'Burn 🔥',
      nsfw: false,
      content:
        'Do you know what the difference is between a toaster and your phone? No? You must get burnt a lot when you answer the phone.',
    },
    {
      name: 'Butter 🧈',
      nsfw: false,
      content:
        "Did you hear the rumour about butter? Well, I'm not going to spread it!",
    },
    {
      name: 'Chicken 🐓 and Egg 🥚 = 🐣',
      nsfw: false,
      content: "I ordered a chicken and an egg from Amazon. I'll let you know",
    },
    {
      name: 'Chocolate 🍫 Factory',
      nsfw: true,
      content:
        "Charlie couldn't believe he was finally allowed into the chocolate factory. His girlfriend had been against it from the start",
    },
    {
      name: 'Clean 🧼',
      nsfw: false,
      content: "I used to be addicted to soap, but I'm clean now.",
    },
    {
      name: 'Diclops 👀',
      nsfw: false,
      content:
        "I'm looking for someone with one eye, but if I use two I'll find them faster.",
    },
    {
      name: 'Dinner 🍽',
      nsfw: false,
      content: 'What did one plate say to the other plate? Dinner is on me!',
    },
    {
      name: 'Doctor 🧐 Examination',
      nsfw: true,
      content: `I went to the Doctors and told him "I can't stop masturbating". He said "I must insist you stop - I'm trying to examine you".`,
    },
    {
      name: 'Doctor 😷 Waiting Room',
      nsfw: true,
      content: `I went to the Doctors and told him "I can't stop masturbating". He said "I must insist you stop - This is the waiting room and your making the other patients uncomfortable".`,
    },
    {
      name: 'Dublin 🇮🇪',
      nsfw: false,
      content:
        "What country's capital is growing the fastest? Ireland. Every day it's Dublin!",
    },
    {
      name: 'Eclipse 🌓',
      nsfw: false,
      content: 'Dad, can you tell me what a solar eclipse is? No son.',
    },
    {
      name: 'Elephants 🐘',
      nsfw: false,
      content: `How many elephants can you get in a Mini? Two in the front and two in the back.
        How do you know when there's 8 elephants in the church? Two Minis are parked outside.
        Why don't you see elephants hiding in trees? Because they're very good at it.
        Why do elephants paint their balls red? To hide in cherry trees.
        What's the loudest noise in the jungle? Giraffes eating cherries`,
    },
    {
      name: 'Elevator 🛗',
      nsfw: false,
      content:
        'My first time using an elevator was an uplifting experience. The second time let me down.',
    },
    {
      name: 'Frisbee 🥏',
      nsfw: false,
      content:
        'I was wondering why the frisbee was getting bigger, then it hit me.',
    },
    {
      name: 'Gallop gallop 🏇',
      nsfw: false,
      content:
        'If you cut a horse in half and bang the two halves together, it sounds like someone riding a coconut.',
    },
    {
      name: "Good ol' Dad 👍",
      nsfw: false,
      content: 'I like to tell Dad jokes. Sometimes, he laughs too.',
    },
    {
      name: 'Hello, dog 🐶!',
      nsfw: false,
      content: 'How do Japanese Chihuahuas say hello? Konichihuahua.',
    },
    {
      name: 'Hippos 🦛',
      nsfw: false,
      content:
        "Why don't you find hippopotamuses hiding in trees? They're really good at it.",
    },
    {
      name: 'IT Teacher 🖥',
      nsfw: true,
      content: 'What do you call a creepy IT Teacher? A PDF-file',
    },
    {
      name: 'Large Fries 🍟',
      nsfw: false,
      content:
        "I went to McDonald's and ordered two large fries - but gave me hundreds of small ones instead.",
    },
    {
      name: 'Mr Electricity 🌩',
      nsfw: false,
      content:
        "If it wasn't for the nice man who discovered electricity we would all be watching TV by candlelight!",
    },
    {
      name: 'Napoleon 🗡',
      nsfw: false,
      content: 'Where does Napoleon keep his armies? In his sleeve-ees.',
    },
    {
      name: 'Nuts 🥜',
      nsfw: false,
      content:
        "Did you hear about the sex addict who worked at the glitter factory? He's been described as pretty nuts.",
    },
    {
      name: 'Piano 👂',
      nsfw: false,
      content: 'I used to play piano by ear. Now I use my hands.',
    },
    {
      name: 'Poor Puss 😹',
      nsfw: false,
      content: `"Dad, can you put the cat out?" "I didn't know it was on fire."`,
    },
    {
      name: 'Psychiatrist 🚽',
      nsfw: false,
      content:
        "Why can't you hear a psychiatrist using the bathroom? Because the 'P' is silent.",
    },
    {
      name: 'Right! ✅',
      nsfw: false,
      content:
        'My wife is really mad at the fact that I have no sense of direction. So I packed up my stuff and right!"',
    },
    {
      name: 'Road worker 🪧',
      nsfw: false,
      content:
        'I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.',
    },
    {
      name: 'Sick boats 🛳',
      nsfw: false,
      content: "Where do boats go when they're sick? To the boat docks.",
    },
    {
      name: 'Skeletons 🩻',
      nsfw: false,
      content:
        "Why don't skeletons ride roller coasters? They don't have the stomach for it.",
    },
    {
      name: 'Trainer 💪',
      nsfw: false,
      content:
        'I used to be a personal trainer. Then I gave my too weak notice.',
    },
    {
      name: 'Trees 🌳',
      nsfw: false,
      content:
        "Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.",
    },
    {
      name: 'Down hill from here 🛞',
      nsfw: false,
      content:
        'I have fond memories of our childhood summer. My brothers and I would roll down the hill in tyres. It was a Goodyear.',
    },
    {
      name: 'Wash them Apples 🍎',
      nsfw: true,
      content: 'Do you know what comes in pairs? The dirty Greengrocer.',
    },
    {
      name: 'You matter! ⚡️',
      nsfw: false,
      content:
        'You matter! Unless you multiply yourself by the speed of light... then you energy!',
    },
  ]
}
