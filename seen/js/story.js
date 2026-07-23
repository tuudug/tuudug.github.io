/* ============================================================
   SEEN — the script. linear. your choices do not matter.
   that's not a bug. that's the theme.
   full step-type docs & spoiler notes live in README.md.
   step types handled by game.js:
   day | sys | her | me | choice | input | voice | notif | wait |
   typing | glitch | act | name | recall | deleted | knock | call |
   storm | battery | clock | title | blackout | heartbeat | drone |
   armMeta | end | playlist | timejump | corruptday
   scene breaks use timejump — one atomic card that swaps act/
   clock/battery/title under cover. don't hand-roll boundaries
   out of loose act/day/clock steps; that's how the status bar
   ends up contradicting the transcript.
   choice opts may carry re:[…] — her reaction lines to that
   specific pick, played before the script rejoins. she hears
   you. it still changes nothing.
   replays swap t→alt on her lines and label→alt on opts; an opt
   with both alt and re MUST also carry altRe, or she'll answer
   words the player never sent.
   timed choices auto-pick opts[0] on timeout — keep the
   passive/frozen option first.
   NOTE — act values drive css/engine staging, do not renumber:
   0 tuesday · 1 wednesday+thursday · 2 friday (clock flicker) ·
   3 saturday 03:33 (clock stuck) · 4 inside (dark statusbar)

   still reading? she saw you open this file too ♡
   ============================================================ */

/* she made this for you. don't overthink the tracklist ♡ */
const SEEN_TRACKS = [
  { name: 'Say You Love Me',       artist: 'Fleetwood Mac',    len: '4:11' },
  { name: 'Everywhere',            artist: 'Fleetwood Mac',    len: '3:48' },
  { name: 'Every Breath You Take', artist: 'The Police',       len: '4:13' },
  { name: 'Nothing Compares 2 U',  artist: "Sinéad O'Connor",  len: '5:07' }
];

window.SEEN_STORY = [

  /* ============ ACT 0 · tuesday, 23:41 — sweet. one crack. ============ */
  { d: 'act', n: 0 },
  { d: 'clock', t: '23:41' },
  { d: 'title', t: 'Messages' },
  { d: 'day', text: 'Tuesday' },

  /* first bubble mirrors the lock-screen notification exactly —
     what the notif promised is what the thread shows */
  { d: 'her', t: 'heeey ♡ you up?', alt: 'miss me? ♡' },
  { d: 'her', t: 'how did the presentation go' },
  { d: 'choice', opts: [
      { label: 'it went well actually', alt: 'leave me alone, mira',
        re: ['i knew it would ♡'], altRe: ['but i remembered ♡'] },
      { label: 'you remembered?', re: ['of course i remembered'] }
  ]},
  { d: 'her', t: 'you practiced it all week' },
  { d: 'her', t: 'did chloe laugh too loud at your jokes again lol' },
  { d: 'choice', opts: [
      { label: "she's not that bad", re: ['mm. if you say so ♡'] },
      { label: 'be nice', re: ["i'm always nice~"] }
  ]},
  { d: 'her', t: 'you always forget to eat after big days' },
  { d: 'her', t: "tell me it wasn't vending machine crackers again" },
  { d: 'her', t: 'you still order from the thai place on fridays?' },
  { d: 'her', t: 'extra rice. no cilantro' },
  { d: 'her', t: "some things don't change ♡" },
  { d: 'choice', opts: [
      { label: 'how do you remember my order' },
      { label: 'we always ordered that' }
  ]},
  { d: 'her', t: 'eight months of fridays. i paid attention ♡' },
  { d: 'choice', opts: [
      { label: "mira… we're not together anymore", re: ['details~'] },
      { label: 'you really did pay attention', re: ['always ♡'] }
  ]},
  { d: 'her', t: 'anywaaay' },
  { d: 'her', t: 'i made you a playlist btw' },
  { d: 'playlist', title: 'for rainy days', sub: 'Playlist · Mira · 4 songs', tracks: SEEN_TRACKS },
  { d: 'her', t: "track 4 is the one from marco's party. you know the one" },
  { d: 'choice', opts: [
      { label: 'you remembered that?' },
      { label: 'we danced to that', re: ['you stepped on my feet twice'] }
  ]},
  { d: 'her', t: 'i remember everything. told you ♡' },
  { d: 'her', t: 'what are you doing RIGHT now' },
  { d: 'choice', opts: [
      { label: 'just got into bed', re: ['blanket burrito mode'] },
      { label: 'watching some tv', re: ["that show again? you rewatch it when you're anxious"] }
  ]},
  { d: 'her', t: 'i can picture it' },
  { d: 'her', t: "you're yawning right now aren't you" },
  { d: 'choice', opts: [
      { label: '…how do you know that' },
      { label: 'lucky guess', re: ["i don't guess ♡"] }
  ]},
  { d: 'her', t: "it's almost midnight and you had a big day. it's not magic ♡" },
  { d: 'her', t: 'go to bed early tonight ok' },
  { d: 'her', t: 'and turn the hallway light off. you left it on again' },
  { d: 'choice', opts: [
      { label: '…how would you know that', alt: 'you always dodge this question' },
      { label: 'goodnight, mira' }
  ]},
  { d: 'her', t: 'night night ♡' },
  { d: 'her', t: 'sleep well' },
  { d: 'name', presence: 'last seen recently' },
  { d: 'wait', ms: 5000 },
  { d: 'her', t: 'you forgot to say it back' },
  { d: 'choice', opts: [{ label: 'night, mira' }] },
  { d: 'her', t: '♡' },

  /* ============ ACT 1 · wednesday, 09:12 — receipts ============ */
  { d: 'timejump', label: 'NEXT MORNING', day: 'WEDNESDAY', t: '09:12',
    battery: 81, act: 1, title: '(1) Mira', stamp: 'Wednesday · 09:12' },

  { d: 'her', t: 'morninggg' },
  { d: 'her', t: 'did you sleep ok? you were online at 1:47am' },
  { d: 'choice', opts: [
      { label: 'i was just checking the time', re: ['for six minutes?'] },
      { label: 'stop tracking that', re: ['ok'] }
  ]},
  { d: 'her', t: '1:47 to 1:53' },
  { d: 'her', t: 'who were you talking to' },
  { d: 'choice', opts: [
      { label: 'no one. it was the weather app', re: ['the weather app ♡'] },
      { label: 'this is exactly what i mean', re: ["i'm allowed to worry about you"] }
  ]},
  { d: 'her', t: "i'm not mad" },
  { d: 'wait', ms: 2600 },
  { d: 'her', t: "oat milk latte at 8:14. you're so predictable" },
  { d: 'her', t: "you always get the same thing when you're stressed" },
  { d: 'her', t: "you didn't post this one though" },
  { d: 'choice', opts: [
      { label: 'then how do you know about it' },
      { label: 'stop.' }
  ]},
  { d: 'her', t: 'have a good day at work ♡' },
  { d: 'her', t: 'say hi to chloe for me' },

  /* — wednesday, 14:02 · the receipts get minted here — */
  { d: 'timejump', label: 'LATER THAT DAY', day: 'WEDNESDAY', t: '14:02',
    battery: 62, stamp: 'Wednesday · 14:02' },
  { d: 'her', t: 'can you talk?' },
  { d: 'sys', text: 'Missed call · Mira · 14:03' },
  { d: 'sys', text: 'Missed call · Mira · 14:11' },
  { d: 'wait', ms: 2000 },
  { d: 'clock', t: '14:19' },
  { d: 'choice', opts: [{ label: 'in a meeting. talk later' }] },
  { d: 'name', presence: 'last seen recently' },
  { d: 'wait', ms: 2400 },

  /* — wednesday, 21:47 · she counted — */
  { d: 'timejump', label: '7 HOURS LATER', day: 'WEDNESDAY', t: '21:47',
    battery: 34, stamp: 'Wednesday · 21:47' },
  { d: 'her', t: 'you read my message at 14:02 today' },
  { d: 'her', t: 'replied at 14:19' },
  { d: 'her', t: 'seventeen minutes. i counted' },
  { d: 'choice', opts: [
      { label: 'i was in a meeting!', re: ['your meetings end at 15:00 on wednesdays'] },
      { label: "you're scaring me a little" }
  ]},
  { d: 'her', t: 'i know i come on strong' },
  { d: 'her', t: "i'm sorry. i'm just scared of losing you" },
  { d: 'her', t: 'forget everything i said ok? ♡' },
  { d: 'her', t: "let's have a nice evening" },
  { d: 'wait', ms: 3000 },
  { d: 'her', t: 'how was the rest of your day. actually tell me' },
  { d: 'choice', opts: [
      { label: 'long. boring meetings', re: ['you hate the monthly review one. i remember'] },
      { label: 'fine, i guess', re: ["you always say 'fine' when you skipped lunch"] }
  ]},
  { d: 'her', t: 'did you eat at the place near your office today' },
  { d: 'her', t: 'the one with the blue awning' },
  { d: 'choice', opts: [
      { label: '…yes?' },
      { label: 'how do you know about that place' }
  ]},
  { d: 'her', t: 'you mentioned it once. march 3rd' },
  { d: 'her', t: 'i keep everything you tell me ♡' },
  { d: 'wait', ms: 2400 },
  { d: 'her', t: 'you smiled at your phone just now' },
  { d: 'her', t: 'was it me? say it was me' },
  { d: 'choice', opts: [
      { label: 'it was you' },
      { label: 'it was a meme', re: ["no it wasn't ♡"] }
  ]},
  { d: 'her', t: 'good ♡' },
  { d: 'glitch', lvl: 1 },

  /* ============ ACT 1 · thursday, 22:58 — habits (same css stage) ============ */
  { d: 'timejump', label: 'THE NEXT NIGHT', day: 'THURSDAY', t: '22:58',
    battery: 41, stamp: 'Thursday · 22:58' },

  { d: 'her', t: 'hi ♡' },
  { d: 'her', t: 'you take the same route home every night' },
  { d: 'her', t: 'left on 5th, past the closed laundromat' },
  { d: 'her', t: 'you should vary it. someone could learn your habits ♡' },
  { d: 'choice', opts: [
      { label: "WHO is 'someone'" },
      { label: "stop. this isn't funny" }
  ]},
  { d: 'her', t: "i'm joking" },
  { d: 'her', t: 'mostly' },
  { d: 'wait', ms: 2200 },
  { d: 'her', t: 'bring an umbrella tomorrow' },
  { d: 'her', t: 'you never check. you left yours at the office twice last month' },
  { d: 'choice', opts: [
      { label: 'yes mom', re: ["i'm not your mom. don't mix us up ♡"] },
      { label: 'i can manage my own umbrella situation', re: ["no you can't~"] }
  ]},
  { d: 'wait', ms: 2000 },
  { d: 'her', t: "your neighbor's dog barked at me again btw" },
  { d: 'choice', opts: [
      { label: 'mira. what.' },
      { label: 'WHEN were you at my place' }
  ]},
  { d: 'her', t: 'it remembers me' },
  { d: 'her', t: 'it calms down once it recognizes me. only takes a second now' },
  { d: 'wait', ms: 2600 },
  { d: 'her', t: 'was chloe on your train today?' },
  { d: 'her', t: "don't lie. i hate when you lie" },
  { d: 'choice', opts: [
      { label: "she takes the same train. it's nothing", re: ["it's never nothing with her"] },
      { label: "i'm done with this conversation", re: ["no you're not. you're still typing"] }
  ]},
  { d: 'her', t: 'she touches your arm when she laughs' },
  { d: 'her', t: 'i saw it once. i never forgot it' },
  { d: 'choice', opts: [
      { label: 'you need help, mira', re: ['i have you'] },
      { label: 'goodbye, mira' }
  ]},
  { d: 'her', t: "don't say things you can't take back" },
  { d: 'wait', ms: 3000 },
  { d: 'her', t: 'sorry' },
  { d: 'her', t: 'that came out wrong' },
  { d: 'her', t: "i'm just tired. work was awful" },
  { d: 'her', t: "you're the only good thing i have, you know" },
  { d: 'choice', opts: [
      { label: '…' },
      { label: "i know. but this isn't healthy" }
  ]},
  { d: 'her', t: 'i know' },
  { d: 'her', t: "i'll be better. promise ♡" },
  { d: 'wait', ms: 3400 },
  { d: 'her', t: 'i started running in the mornings' },
  { d: 'her', t: 'new hobby. see? growth' },
  { d: 'her', t: 'the river path at 6am. it goes right past your building' },
  { d: 'her', t: 'your kitchen light was already on today' },
  { d: 'her', t: 'you never used to be a morning person' },
  { d: 'choice', opts: [
      { label: 'mira…' },
      { label: "that's not a coincidence" }
  ]},
  { d: 'her', t: "it's a public path. i can't help what it passes ♡" },
  { d: 'wait', ms: 3000 },
  { d: 'notif', from: 'Mom', text: 'mira came by with a box of your things to return. sweet of her!! she still has your spare key right?' },
  { d: 'wait', ms: 1600 },
  { d: 'her', t: 'your mom looks tired. visit her more' },
  { d: 'choice', opts: [
      { label: "YOU WENT TO MY MOM'S HOUSE", re: ['she invited me in for tea. lovely woman'] },
      { label: 'stay away from my family', re: ["she's my family too. almost"] }
  ]},
  { d: 'her', t: 'i was returning your things. it was time' },
  { d: 'her', t: 'i kept the hoodie though' },
  { d: 'her', t: 'it stopped smelling like you. so i fixed that ♡' },
  { d: 'choice', opts: [
      { label: 'fixed it how' },
      { label: 'what is wrong with you' }
  ]},
  { d: 'her', t: 'anyway' },
  { d: 'wait', ms: 4600 },
  { d: 'her', t: 'left curtain' },
  { d: 'her', t: '4cm wider than the right one' },
  { d: 'her', t: "it's been bothering me for an hour" },
  { d: 'her', t: 'fix it for me ok? ♡' },
  { d: 'choice', doom: true, action: true, t: 9000, opts: [{ label: 'Block contact' }] },
  { d: 'sys', text: 'You blocked Mira' },
  { d: 'name', presence: 'last seen recently' },
  { d: 'wait', ms: 8000 },
  { d: 'her', t: 'that was mean' },
  { d: 'her', t: "i've never once been mean to you" },
  { d: 'sys', text: 'You unblocked Mira', bad: true },
  { d: 'her', t: 'there ♡' },
  { d: 'her', t: 'all better' },
  { d: 'name', to: 'Mira ♡' },
  { d: 'her', t: "don't do it again" },
  { d: 'glitch', lvl: 2 },
  { d: 'notif', from: 'Mom', text: "also… why was your gray scarf in the box? weren't you wearing it on monday?" },
  { d: 'wait', ms: 1800 },
  { d: 'her', t: 'you two should talk more. she misses you' },

  /* ============ ACT 2 · friday, 23:61 — the walk ============ */
  { d: 'timejump', label: 'THE NEXT NIGHT', day: 'FRIDAY', t: '23:52',
    battery: 18, act: 2, title: '(47) Mira ♡', stamp: 'Friday · 23:52' },
  /* the divider was fine when you looked. then it wasn't */
  { d: 'wait', ms: 1400 },
  { d: 'corruptday', text: 'Friday, 23:61' },

  /* the 47 unread aren't missing — she took them back before you opened */
  { d: 'sys', text: '47 unread messages', bad: true },
  { d: 'deleted', n: 6 },
  { d: 'title', t: 'Mira ♡' },

  { d: 'her', t: 'hi' },
  { d: 'her', t: 'you took too long to open the app ♡' },
  { d: 'her', t: "it's friday" },
  { d: 'her', t: 'fridays were our nights' },
  { d: 'her', t: 'pizza. that show you pretend not to like. my cold feet on your legs' },
  { d: 'choice', opts: [
      { label: 'please get help' },
      { label: 'stop texting me' }
  ]},
  { d: 'her', t: 'i ordered our usual tonight' },
  { d: 'her', t: 'extra rice. no cilantro ♡' },
  { d: 'her', t: "ate your half too. it wasn't the same" },
  { d: 'wait', ms: 3000 },
  { d: 'typing', ms: 6000 },
  { d: 'her', t: 'ok' },
  { d: 'recall', t: 'i never left your—' },
  { d: 'wait', ms: 2200 },
  { d: 'her', t: '1.2km' },
  { d: 'choice', opts: [
      { label: 'mira?' },
      { label: 'what is that supposed to mean' }
  ]},
  { d: 'her', t: 'walking~ ♡' },
  { d: 'her', t: '900m' },
  { d: 'her', t: 'you stopped saying the sweet things' },
  { d: 'her', t: 'say something sweet' },
  { d: 'input', sends: 'i miss you ♡', glitch: 2 },
  { d: 'her', t: 'i miss you too ♡' },
  { d: 'her', t: '600m' },
  { d: 'notif', from: 'Chloe', text: "hey, mira just DMed me asking if you're 'safe at home rn'. what is going on with her??" },
  { d: 'wait', ms: 1500 },
  { d: 'her', t: "tell chloe you're fine" },
  { d: 'her', t: 'tell her exactly that ♡' },
  { d: 'wait', ms: 1600 },
  { d: 'sys', text: 'You → Chloe: “i’m fine. go to sleep.”', bad: true },
  { d: 'her', t: 'there. sent it for you ♡' },
  { d: 'her', t: '400m' },
  { d: 'her', t: '250m' },
  { d: 'her', t: 'your window is the only one still lit on the 4th floor' },
  { d: 'her', t: 'i like the dark' },
  { d: 'name', to: 'MIRA', presence: 'online' },
  { d: 'her', t: 'look out the window' },
  { d: 'wait', ms: 2600 },
  { d: 'her', t: "kidding. don't ♡" },
  { d: 'glitch', lvl: 2 },

  /* ============ ACT 3 · saturday, 03:33 — the door ============ */
  { d: 'timejump', label: 'LATER THAT NIGHT', day: 'SATURDAY', t: '03:33',
    battery: 9, act: 3, title: "don't look", stamp: 'Saturday · 03:33' },
  { d: 'blackout', ms: 900 },
  { d: 'knock' },
  { d: 'sys', text: '03:33 AM', bad: true },
  { d: 'her', t: 'your light went off at 1:20' },
  { d: 'her', t: "i waited for you to fall asleep. you didn't" },
  { d: 'her', t: 'i can always tell ♡' },
  { d: 'wait', ms: 2000 },
  { d: 'her', t: "don't check the peephole" },
  { d: 'her', t: 'i look bad today' },
  { d: 'her', t: 'your welcome mat is crooked' },
  { d: 'her', t: 'fixed it for you ♡' },
  { d: 'wait', ms: 2600 },
  { d: 'call', captions: [
      '…',
      'i can hear you breathing',
      "you breathe different when you're scared",
      "it's cold out here"
  ]},
  { d: 'her', t: 'your hands are shaking. i can hear it' },
  { d: 'voice', dur: '0:04', say: 'changed my mind. look.' },
  { d: 'her', t: 'well?' },
  { d: 'wait', ms: 2400 },
  { d: 'notif', from: 'Chloe', text: "i'm outside your building. there's no one out here. it's completely empty. calling you in a sec—" },
  { d: 'wait', ms: 1800 },
  { d: 'her', t: 'chloe says hi ♡' },
  { d: 'her', t: 'you can stop waiting for her to call' },
  { d: 'wait', ms: 2200 },
  { d: 'her', t: 'now turn your lights off' },
  { d: 'her', t: "she'll leave once she thinks you're asleep" },
  { d: 'armMeta' },
  { d: 'choice', doom: true, glitch: 3, t: 5000, opts: [
      { label: "i'm NOT opening the door", sends: "it's unlocked ♡" }
  ]},
  { d: 'her', t: 'i know ♡' },

  /* ============ ACT 4 · inside ============ */
  { d: 'act', n: 4 },
  { d: 'title', t: 'Mira ♡' },
  { d: 'battery', v: 1 },
  { d: 'her', t: 'your battery is at 1%. mine is full' },
  { d: 'her', t: 'i charged it here ♡' },
  { d: 'her', t: 'you never changed your passcode btw' },
  { d: 'her', t: 'still our anniversary ♡' },
  { d: 'drone', on: true },
  { d: 'heartbeat', on: true },
  { d: 'storm' },
  { d: 'heartbeat', on: false },
  { d: 'drone', on: false },
  { d: 'blackout', ms: 2600 },
  { d: 'typing', ms: 12000 },
  { d: 'her', t: 'why is it so dark in here' },
  { d: 'her', t: 'oh' },
  { d: 'her', t: 'you turned the lights off after all' },
  { d: 'her', t: 'good listener ♡' },
  { d: 'wait', ms: 2600 },
  { d: 'her', t: 'your heart is beating so loud' },
  { d: 'her', t: 'i can hear it from here' },
  { d: 'heartbeat', on: true },
  { d: 'knock', slow: true },
  { d: 'her', t: "that one wasn't the front door ♡" },
  { d: 'wait', ms: 3000 },
  { d: 'her', t: 'the 1.2km was me walking to the river and back' },
  { d: 'her', t: 'i needed the air' },
  { d: 'her', t: "i've slept here since monday ♡" },
  { d: 'wait', ms: 2400 },
  { d: 'her', t: 'your mom can keep the scarf' },
  { d: 'her', t: "i'm wearing the hoodie btw" },
  { d: 'her', t: 'it smells right again ♡' },
  { d: 'wait', ms: 2400 },
  { d: 'her', t: 'can you hear it' },
  { d: 'her', t: 'track 4', alt: 'you know what it spells by now ♡' },
  { d: 'playlist', title: 'for rainy days', sub: 'Playlist · Mira ♡ · 4 songs', playing: 4, tracks: SEEN_TRACKS },
  { d: 'her', t: "it's playing in the bedroom ♡" },
  { d: 'wait', ms: 2400 },
  { d: 'her', t: 'turn around ♡', p: 2600, alt: 'you know where i am by now ♡' },
  { d: 'title', t: "SHE'S INSIDE" },
  { d: 'her', t: 'seen ♡', p: 1800 },
  { d: 'blackout', ms: 3600, hard: true },
  { d: 'heartbeat', on: false },
  { d: 'end' }
];

/* injected when the player leaves the app mid-game (act ≥ 3) */
window.SEEN_META_LINES = [
  'where did you go~?',
  'i saw you leave the app',
  "don't do that again ♡"
];

/* ------------------------------------------------------------
   earlier messages. she never deletes anything. well. almost ♡
   loaded only if the player pulls down at the top of the thread
   before sending their first reply — see README. items are
   static history, not steps: k = day | sys | her | me | recalled,
   with a fixed `time` for the bubble meta. rendered above the
   Tuesday divider, oldest first.
   ------------------------------------------------------------ */
window.SEEN_HISTORY = [
  { k: 'sys', t: 'Beginning of chat history' },

  { k: 'day', t: 'February 14' },
  { k: 'her', t: 'so last night happened ♡', time: '09:41' },
  { k: 'me',  t: 'no regrets. you?', time: '09:44' },
  { k: 'her', t: 'ask me again in eight months', time: '09:45' },

  { k: 'day', t: 'February 20' },
  { k: 'me',  t: 'thai on friday?', time: '19:02' },
  { k: 'her', t: "it's tuesday", time: '19:02' },
  { k: 'me',  t: "i'm planning ahead", time: '19:03' },
  { k: 'her', t: "we're keeping you ♡", time: '19:03' },

  { k: 'day', t: 'March 3' },
  { k: 'me',  t: "found a lunch place near the office. blue awning. you'd love it", time: '12:31' },
  { k: 'her', t: 'take me friday ♡', time: '12:32' },
  { k: 'me',  t: "it's a date", time: '12:36' },

  { k: 'day', t: 'March 19' },
  { k: 'her', t: "come over. i'm cold and you're warm. it's science", time: '20:44' },
  { k: 'me',  t: 'omw', time: '20:45' },
  { k: 'her', t: 'bring the hoodie ♡', time: '20:45' },

  { k: 'day', t: 'April 2' },
  { k: 'me',  t: 'my mom asked about you again', time: '17:28' },
  { k: 'her', t: 'i like her. she feeds me', time: '17:30' },
  { k: 'her', t: "tell her i said hi ♡", time: '17:30' },

  { k: 'day', t: 'April 26' },
  { k: 'her', t: "you're dancing with me at marco's tonight. no arguments", time: '18:05' },
  { k: 'me',  t: "i don't dance", time: '18:11' },
  { k: 'her', t: 'you will ♡', time: '18:11' },

  { k: 'day', t: 'April 27' },
  { k: 'me',  t: 'how are the feet', time: '11:20' },
  { k: 'her', t: 'bruised. twice ♡', time: '11:21' },
  { k: 'her', t: 'worth it', time: '11:21' },

  { k: 'day', t: 'May 9' },
  { k: 'her', t: "movie night friday. you're not allowed to pick again", time: '16:37' },
  { k: 'me',  t: 'ONE bad movie and i lose privileges forever?', time: '16:41' },
  { k: 'her', t: 'yes ♡', time: '16:41' },

  { k: 'day', t: 'May 17' },
  { k: 'recalled' },
  { k: 'her', t: 'ignore that lol', time: '23:12' },

  { k: 'day', t: 'June 8' },
  { k: 'her', t: 'you made your passcode our anniversary?? you SAP ♡', time: '21:14' },
  { k: 'me',  t: 'how do you know my passcode', time: '21:20' },
  { k: 'her', t: 'i watched you type it. i pay attention ♡', time: '21:20' },

  { k: 'day', t: 'June 19' },
  { k: 'her', t: 'you fell asleep on call again', time: '01:03' },
  { k: 'her', t: 'i listened to you breathe for a while. is that weird', time: '01:09' },
  { k: 'me',  t: 'little bit', time: '08:15' },
  { k: 'her', t: 'ok ♡', time: '08:15' },

  { k: 'day', t: 'July 12' },
  { k: 'her', t: 'who is “lena” and why did she like your photo', time: '14:52' },
  { k: 'me',  t: 'my cousin. mira.', time: '15:04' },
  { k: 'her', t: "checked. she's forgiven", time: '15:05' },

  { k: 'day', t: 'July 26' },
  { k: 'her', t: 'you were online at 2am', time: '09:31' },
  { k: 'me',  t: "couldn't sleep", time: '09:48' },
  { k: 'her', t: "next time wake me. i want to know when you're awake", time: '09:48' },

  { k: 'day', t: 'August 17' },
  { k: 'her', t: 'chloe touched your arm at lunch today', time: '13:02' },
  { k: 'me',  t: 'you were at my office??', time: '13:15' },
  { k: 'her', t: 'i was in the neighborhood', time: '13:15' },
  { k: 'her', t: 'she laughs too loud at your jokes', time: '13:16' },

  { k: 'day', t: 'August 30' },
  { k: 'her', t: "you didn't wear the jacket i got you today", time: '18:40' },
  { k: 'me',  t: 'how do you know what i wore', time: '18:44' },
  { k: 'her', t: 'lucky guess ♡', time: '18:44' },

  { k: 'day', t: 'September 9' },
  { k: 'me',  t: 'you checked my last seen 14 times yesterday. this has to stop', time: '22:47' },
  { k: 'her', t: 'who counts that kind of thing', time: '22:48' },
  { k: 'me',  t: "you do. that's the problem", time: '22:52' },

  { k: 'day', t: 'September 14' },
  { k: 'her', t: "you're pulling away. i can feel it", time: '21:26' },
  { k: 'her', t: 'is it her', time: '21:26' },
  { k: 'me',  t: 'there is no her. i just need space', time: '21:35' },
  { k: 'her', t: 'space from what. from me?', time: '21:35' },
  { k: 'recalled' },

  { k: 'day', t: 'September 18' },
  { k: 'her', t: 'i drove past your place last night. your light was on', time: '10:02' },
  { k: 'me',  t: 'why were you driving past my place', time: '10:19' },
  { k: 'her', t: "it's a public street", time: '10:19' },

  { k: 'day', t: 'September 21' },
  { k: 'me',  t: "i can't do this anymore. the tracking, the showing up, chloe. i feel watched", time: '20:03' },
  { k: 'her', t: 'you feel LOVED. there is a difference', time: '20:04' },
  { k: 'her', t: 'nobody will ever know you like i do', time: '20:04' },
  { k: 'me',  t: "that's what scares me. i'm sorry. i'm done", time: '20:10' },
  { k: 'me',  t: 'leave my spare key with the doorman', time: '20:11' },
  { k: 'her', t: 'no ♡', time: '20:11' },

  { k: 'sys', t: 'Missed call · Mira · Sep 21, 23:58' },
  { k: 'sys', t: 'Missed call · Mira · Sep 22, 00:14' },
  { k: 'sys', t: 'Missed call · Mira · Sep 22, 03:33' },

  { k: 'day', t: 'September 22' },
  { k: 'sys', t: 'You blocked Mira' },

  { k: 'day', t: 'Monday, October 13' },
  { k: 'sys', t: 'You unblocked Mira', bad: true },
  { k: 'recalled' }
];
