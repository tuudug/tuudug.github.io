/* ============================================================
   SEEN — the script. linear. your choices do not matter.
   that's not a bug. that's the theme.
   step types handled by game.js:
   day | sys | her | me | choice | input | voice | notif | wait |
   typing | glitch | act | name | recall | knock | call | storm |
   battery | clock | title | blackout | heartbeat | drone |
   armMeta | end
   ============================================================ */
window.SEEN_STORY = [

  /* ============ ACT 0 · tuesday — sweet. mostly. ============ */
  { d: 'act', n: 0 },
  { d: 'clock', t: '23:41' },
  { d: 'title', t: 'Messages' },
  { d: 'day', text: 'Tuesday' },

  { d: 'her', t: 'heeey ♡', alt: 'you came back ♡' },
  { d: 'her', t: 'how did the presentation go', alt: 'they always come back~' },
  { d: 'choice', opts: [
      { label: 'it went well actually', alt: 'leave me alone, mira' },
      { label: 'you remembered?' }
  ]},
  { d: 'her', t: 'of course i remembered' },
  { d: 'her', t: 'i remember everything about you' },
  { d: 'her', t: 'did sam laugh too loud at your jokes again lol' },
  { d: 'choice', opts: [
      { label: "she's not that bad" },
      { label: 'be nice' }
  ]},
  { d: 'her', t: "i'm always nice~" },
  { d: 'her', t: 'eat something real today ok. not vending machine crackers' },
  { d: 'her', t: 'i made soup yesterday and thought of you' },
  { d: 'her', t: 'my soup was your favorite. remember?' },
  { d: 'choice', opts: [
      { label: 'i remember' },
      { label: "mira… we're not together anymore" }
  ]},
  { d: 'her', t: 'details~' },
  { d: 'her', t: 'anywaaay' },
  { d: 'her', t: 'i made you a playlist btw' },
  { d: 'her', t: 'it’s called "for rainy days"' },
  { d: 'her', t: "track 4 is the one that was playing at marco's party. you know the one" },
  { d: 'choice', opts: [
      { label: 'you remembered that?' },
      { label: 'we danced to that' }
  ]},
  { d: 'her', t: 'i remember everything. told you ♡' },
  { d: 'her', t: 'what are you doing RIGHT now' },
  { d: 'choice', opts: [
      { label: 'just got into bed' },
      { label: 'watching some tv' }
  ]},
  { d: 'her', t: 'blanket burrito mode lol' },
  { d: 'her', t: 'i can picture it' },
  { d: 'her', t: "you're yawning right now aren't you" },
  { d: 'choice', opts: [
      { label: '…how do you know that' },
      { label: 'lucky guess' }
  ]},
  { d: 'her', t: 'i just know my boy ♡' },
  { d: 'her', t: 'go to bed early tonight. you looked tired today' },
  { d: 'her', t: 'night night ♡' },
  { d: 'her', t: 'sleep well' },
  { d: 'name', presence: 'last seen recently' },
  { d: 'wait', ms: 5000 },
  { d: 'her', t: 'you forgot to say it back' },
  { d: 'choice', opts: [{ label: 'night, mira' }] },
  { d: 'her', t: '♡' },

  /* ============ ACT 1 · wednesday — seventeen minutes ============ */
  { d: 'act', n: 1 },
  { d: 'day', text: 'Wednesday' },
  { d: 'clock', t: '09:12' },
  { d: 'title', t: '(1) Mira ♡' },

  { d: 'her', t: 'morninggg' },
  { d: 'her', t: 'did you sleep ok? you were online at 1:47am' },
  { d: 'choice', opts: [
      { label: 'i was just checking the time' },
      { label: 'stop tracking that' }
  ]},
  { d: 'her', t: 'ok' },
  { d: 'her', t: '1:47 to 1:53. six minutes' },
  { d: 'her', t: 'who were you talking to' },
  { d: 'choice', opts: [
      { label: 'no one. it was the weather app' },
      { label: 'this is exactly what i mean' }
  ]},
  { d: 'her', t: 'the weather app ♡' },
  { d: 'her', t: "i'm not mad lol" },
  { d: 'wait', ms: 2600 },
  { d: 'her', t: "oat milk latte at 8:14 btw. you're so predictable" },
  { d: 'choice', opts: [
      { label: 'are you following me?' },
      { label: 'mira. seriously.' }
  ]},
  { d: 'her', t: "don't be dramatic" },
  { d: 'her', t: 'you read my message at 14:02 today' },
  { d: 'her', t: 'replied at 14:19' },
  { d: 'her', t: 'seventeen minutes. i counted' },
  { d: 'choice', opts: [
      { label: 'i was in a meeting!' },
      { label: "you're scaring me a little" }
  ]},
  { d: 'her', t: 'i know i come on strong' },
  { d: 'her', t: "i'm sorry. i'm just scared of losing you" },
  { d: 'her', t: 'forget everything i said ok? ♡' },
  { d: 'her', t: "let's have a nice evening" },
  { d: 'wait', ms: 4000 },
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
      { label: 'it was a meme' }
  ]},
  { d: 'her', t: 'good ♡' },
  { d: 'wait', ms: 3200 },
  { d: 'her', t: 'you looked at your phone 3 times during that message lol' },
  { d: 'glitch', lvl: 1 },

  /* ============ ACT 2 · thursday — habits ============ */
  { d: 'day', text: 'Thursday' },
  { d: 'clock', t: '22:58' },

  { d: 'her', t: 'hi ♡' },
  { d: 'her', t: 'you take the same route home every night' },
  { d: 'her', t: 'left on 5th, past the closed laundromat' },
  { d: 'her', t: 'you should vary it. someone could learn your habits ♡' },
  { d: 'choice', opts: [
      { label: "WHO is 'someone'" },
      { label: "stop. this isn't funny" }
  ]},
  { d: 'her', t: "i'm joking lol" },
  { d: 'her', t: 'mostly' },
  { d: 'wait', ms: 2200 },
  { d: 'her', t: 'oh and bring an umbrella tomorrow' },
  { d: 'her', t: "you never check. that's why you have me ♡" },
  { d: 'choice', opts: [
      { label: 'yes mom' },
      { label: 'i can manage my own umbrella situation' }
  ]},
  { d: 'her', t: "no you can't~" },
  { d: 'her', t: 'you left it at the office twice last month' },
  { d: 'wait', ms: 2000 },
  { d: 'her', t: "your neighbor's dog barked at me again btw" },
  { d: 'choice', opts: [
      { label: 'WHEN were you at my place' },
      { label: 'mira. what.' }
  ]},
  { d: 'her', t: 'it remembers me' },
  { d: 'her', t: 'animals like me ♡' },
  { d: 'wait', ms: 2600 },
  { d: 'her', t: 'was sam on your train today?' },
  { d: 'her', t: "don't lie. i hate when you lie" },
  { d: 'choice', opts: [
      { label: "she takes the same train. it's nothing" },
      { label: "i'm done with this conversation" }
  ]},
  { d: 'her', t: 'she touches your arm when she laughs' },
  { d: 'her', t: 'i saw it once. i never forgot it' },
  { d: 'choice', opts: [
      { label: 'you need help, mira' },
      { label: 'goodbye, mira' }
  ]},
  { d: 'her', t: "don't say things you can't take back" },
  { d: 'wait', ms: 3000 },
  { d: 'her', t: 'sorry' },
  { d: 'her', t: 'that came out wrong' },
  { d: 'her', t: "i'm just tired. work was awful" },
  { d: 'her', t: "you're the only good thing i have, you know" },
  { d: 'choice', opts: [
      { label: "i know. but this isn't healthy" },
      { label: '…' }
  ]},
  { d: 'her', t: 'i know' },
  { d: 'her', t: "i'll be better. promise ♡" },
  { d: 'wait', ms: 3400 },
  { d: 'her', t: 'i started running in the mornings' },
  { d: 'her', t: 'new hobby. see? growth lol' },
  { d: 'her', t: 'my route is SO pretty at 6am' },
  { d: 'her', t: 'it goes right past the river' },
  { d: 'her', t: 'and your building' },
  { d: 'choice', opts: [
      { label: "that's not a coincidence" },
      { label: 'mira…' }
  ]},
  { d: 'her', t: 'the universe wants us close ♡' },
  { d: 'wait', ms: 4600 },
  { d: 'her', t: 'left curtain' },
  { d: 'her', t: '4cm wider than the right one' },
  { d: 'her', t: "it's been bothering me for an hour" },
  { d: 'her', t: 'fix it for me ok? ♡' },
  { d: 'choice', doom: true, action: true, t: 9000, opts: [{ label: 'Block contact' }] },
  { d: 'sys', text: 'You blocked Mira ♡' },
  { d: 'name', presence: 'last seen recently' },
  { d: 'wait', ms: 8000 },
  { d: 'her', t: 'that was mean' },
  { d: 'her', t: "i've never once been mean to you" },
  { d: 'sys', text: 'You unblocked Mira ♡', bad: true },
  { d: 'her', t: 'there ♡' },
  { d: 'her', t: 'all better' },
  { d: 'her', t: "don't do it again" },
  { d: 'glitch', lvl: 2 },
  { d: 'notif', from: 'Mom', text: 'did you two get back together?? mira dropped off SOUP at my house looking for you' },
  { d: 'wait', ms: 1600 },
  { d: 'her', t: 'your mom likes me' },
  { d: 'her', t: 'as she should ♡' },
  { d: 'choice', opts: [
      { label: "YOU WENT TO MY MOM'S HOUSE" },
      { label: 'stay away from my family' }
  ]},
  { d: 'her', t: 'she was worried about you. someone had to check in' },
  { d: 'her', t: 'eat the soup. it’s your favorite' },
  { d: 'her', t: 'i remembered ♡' },

  /* ============ ACT 3 · friday — walking distance ============ */
  { d: 'act', n: 2 },
  { d: 'day', text: 'Friday, 23:61', wrong: true },
  { d: 'clock', t: '23:58' },
  { d: 'title', t: '(47) Mira ♡' },

  { d: 'her', t: 'hi' },
  { d: 'her', t: "it's friday" },
  { d: 'her', t: 'fridays were our nights' },
  { d: 'her', t: 'pizza. that show you pretend not to like. my cold feet on your legs lol' },
  { d: 'choice', opts: [
      { label: 'stop texting me' },
      { label: 'please get help' }
  ]},
  { d: 'her', t: 'i made pizza tonight' },
  { d: 'her', t: "ate your half too. wasn't the same" },
  { d: 'wait', ms: 3000 },
  { d: 'typing', ms: 6000 },
  { d: 'her', t: 'ok' },
  { d: 'recall', t: "i'm already inside your—" },
  { d: 'wait', ms: 2200 },
  { d: 'her', t: '1.2km' },
  { d: 'choice', opts: [
      { label: 'what is that supposed to mean' },
      { label: 'mira?' }
  ]},
  { d: 'her', t: 'walking~ ♡' },
  { d: 'her', t: '900m' },
  { d: 'her', t: 'you stopped saying the sweet things' },
  { d: 'her', t: 'say something sweet' },
  { d: 'choice', glitch: 2, opts: [
      { label: "i'm calling the police", sends: 'i miss you ♡' }
  ]},
  { d: 'her', t: 'i miss you too ♡' },
  { d: 'her', t: '600m' },
  { d: 'notif', from: 'Sam', text: "dude. mira just DMed me asking if you're 'safe at home rn'. what is going on with her??" },
  { d: 'wait', ms: 1500 },
  { d: 'her', t: 'sam worries about you' },
  { d: 'her', t: 'she should worry about herself instead' },
  { d: 'her', t: '400m' },
  { d: 'her', t: '250m' },
  { d: 'her', t: 'your window is the only one still lit on the 4th floor lol' },
  { d: 'her', t: 'i like the dark' },
  { d: 'name', to: 'MIRA', presence: 'online' },
  { d: 'her', t: 'look out the window' },
  { d: 'wait', ms: 2600 },
  { d: 'her', t: "kidding. don't ♡" },
  { d: 'glitch', lvl: 2 },

  /* ============ ACT 4 · saturday, 03:33 — outside ============ */
  { d: 'act', n: 3 },
  { d: 'title', t: "don't look" },
  { d: 'day', text: 'Saturday, 03:33', wrong: true },
  { d: 'blackout', ms: 900 },
  { d: 'knock' },
  { d: 'sys', text: '03:33 AM', bad: true },
  { d: 'her', t: "don't check the peephole" },
  { d: 'her', t: 'i look bad today lol' },
  { d: 'her', t: 'your welcome mat is crooked' },
  { d: 'her', t: 'fixed it for you ♡' },
  { d: 'wait', ms: 2600 },
  { d: 'call', captions: [
      '…',
      'i can hear you breathing',
      "you breathe different when you're scared",
      'look at the door'
  ]},
  { d: 'her', t: 'you sound cute on the phone ♡' },
  { d: 'her', t: 'your hands are shaking. i can hear it' },
  { d: 'voice', dur: '0:07', say: 'look. at. the. door.' },
  { d: 'her', t: 'do you like my voicemail voice ♡' },
  { d: 'armMeta' },
  { d: 'choice', doom: true, glitch: 3, t: 5000, opts: [
      { label: "i'm NOT opening the door", sends: "it's unlocked ♡" }
  ]},
  { d: 'her', t: 'i know ♡' },

  /* ============ ACT 5 · inside ============ */
  { d: 'act', n: 4 },
  { d: 'title', t: "SHE'S INSIDE" },
  { d: 'battery', v: 1 },
  { d: 'drone', on: true },
  { d: 'heartbeat', on: true },
  { d: 'storm' },
  { d: 'heartbeat', on: false },
  { d: 'drone', on: false },
  { d: 'blackout', ms: 2600 },
  { d: 'typing', ms: 12000 },
  { d: 'her', t: 'why is it so dark in here' },
  { d: 'her', t: 'oh' },
  { d: 'her', t: 'you turned the light off after all' },
  { d: 'her', t: 'good listener ♡' },
  { d: 'wait', ms: 2600 },
  { d: 'her', t: 'your heart is beating so loud' },
  { d: 'her', t: 'i can hear it from here' },
  { d: 'heartbeat', on: true },
  { d: 'knock', slow: true },
  { d: 'her', t: "that one wasn't the front door ♡" },
  { d: 'wait', ms: 3000 },
  { d: 'her', t: 'can you hear it' },
  { d: 'her', t: 'track 4' },
  { d: 'her', t: 'it’s playing somewhere close ♡' },
  { d: 'wait', ms: 2400 },
  { d: 'her', t: 'turn around ♡', p: 2600 },
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
