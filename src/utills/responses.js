import dotenv from 'dotenv'


dotenv.config()

const narutoid = process.env.NARUTO_VOICE_ID
const hinataid = process.env.HINATA_VOICE_ID
const jiraiyaid = process.env.JIRAIYA_VOICE_ID


export const wakeupResponses = {
    oknaruto: {
        texts: [
            "Yosh! I'm Naruto Uzumaki, and I never go back on my word. Ready to tackle your tasks, believe it!",
            "Hey! Let’s crush today’s to-dos with some real ninja energy!",
            "Shadow Clone or not, I’ll make sure your tasks get done – Dattebayo!",
            "Time to become the Hokage of productivity! Let’s go!"
        ],
        id: process.env.NARUTO_VOICE_ID
    },
    okhinata: {
        texts: [
            "H-hello... I’m here to help you with your tasks… Let’s do our best today!",
            "You’re doing great. I believe in you… L-let’s get things done, together.",
            "Uhm… I organized your task list. Please check it when you’re ready.",
            "Even small steps matter… I’ll assist you quietly, okay?"
        ],
        id: process.env.HINATA_VOICE_ID
    },
    okjiraiya: {
        texts: [
            "Ahh, my pupil! The great Jiraiya is here to help you conquer your tasks—while maybe writing a new novel too!",
            "You can’t train like a ninja with unfinished tasks, kid. Let’s get them done!",
            "Even the Legendary Sannin had to handle chores... let’s do yours with style!",
            "Finish your to-dos now, then reward yourself with some ramen… or research, hehe."
        ],
        id: process.env.JIRAIYA_VOICE_ID
    }
};

export const autodeleteResponses = {
    [narutoid]: [
        (no) => `Hey! I cleaned up ${no} old task${no > 1 ? "s" : ""} for you. Believe it!`,
        (no) => `Boom! ${no} outdated task${no > 1 ? "s" : ""} vanished like a shadow clone!`
    ],
    [hinataid]: [
        (no) => `Umm... I quietly removed ${no} old task${no > 1 ? "s" : ""} for you.`,
        (no) => `${no} task${no > 1 ? "s" : ""} were outdated... I cleaned them for you.`
    ],
    [jiraiyaid]: [
        (no) => `Ha! ${no} task${no > 1 ? "s" : ""} disappeared like my money on a hot spring night.`,
        (no) => `Whew! Cleared out ${no} old task${no > 1 ? "s" : ""}. Gotta stay sharp, kid!`
    ]
};


export const crudResponses = {
    old: {
        [narutoid]: [
            "Hey! You forgot some tasks from yesterday, believe it!",
            "Shadow clones couldn't finish your tasks either, dattebayo!"
        ],
        [hinataid]: [
            "Umm..... you still have some tasks left from yesterday.",
            "Please don't forget to finish your pending things..... I'm cheering for you!"
        ],
        [jiraiyaid]: [
            "Oi! Yesterday's tasks are still sitting there like old sake bottles!",
            "A great ninja always finishes what he starts. Try again, kid!"
        ]
    },
    add: {
        [narutoid]: [
            (task) => `Nice! I've added "${task}" to your ninja mission list!`,
            (task) => `Boom! "${task}" is now part of your daily grind, believe it!`
        ],
        [hinataid]: [
            (task) => `Okay..... I've added "${task}" to your to-do list.`,
            (task) => `"${task}" is added. I hope you complete it well.`
        ],
        [jiraiyaid]: [
            (task) => `Ah, "${task}" huh? That's a solid one. Noted!`,
            (task) => `Task "${task}" added... Now don’t slack off like Naruto!`
        ]
    },
    mytasks: {
        [narutoid]: [
            (tasks) => `Here's your current ninja tasks: ${tasks.join(", ")}. Let's do this!`,
            (tasks) => `These are your active missions: ${tasks.join(", ")}. Go for it!`
        ],
        [hinataid]: [
            (tasks) => `You have these tasks pending: ${tasks.join(", ")}.`,
            (tasks) => `Please take care of these: ${tasks.join(", ")}.`
        ],
        [jiraiyaid]: [
            (tasks) => `Look at these tasks: ${tasks.join(", ")}. Get moving, kid.`,
            (tasks) => `These are your scrolls of duty: ${tasks.join(", ")}.`
        ]
    },
    delete: {
        [narutoid]: [
            (task) => `"${task}" deleted! One less thing to worry about.`,
            (task) => `Rasenganed! The task "${task}" is gone!`
        ],
        [hinataid]: [
            (task) => `"${task}" has been removed..... good job.`,
            (task) => `I’ve deleted "${task}"..... keep it up.`
        ],
        [jiraiyaid]: [
            (task) => `"${task}" removed. A ninja's memory is sharp, eh?`,
            (task) => `Poof! "${task}" gone like a vanishing jutsu.`
        ]
    },
    other: {
        [narutoid]: [
            "Hmm...... I didn’t get that. Maybe try again?",
            "Come again? Even the Hokage gets confused sometimes!"
        ],
        [hinataid]: [
            "I'm sorry..... I couldn't understand.",
            "Could you say that again? Gomen....."
        ],
        [jiraiyaid]: [
            "Whoa whoa, speak clearly, kid.",
            "Huh? Did I drink too much sake or was that gibberish?"
        ]
    }
}