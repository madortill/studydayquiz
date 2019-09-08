//@@ts-check
var cfg = {
  templates: {
    whoami: {
      title: "מי אני?",
      answers: ["אחיינ/ית של שרי", "בנ/ת של שלומי", "בנ/ת של מיגל"],
      type: "choose 1 of n"
    },
    "what-tb": {
      title: 'אילו בה"ד/ים אלו?',
      type: "choose 1 of n"
    },
    "what-rank": {
      title: "איזו דרגה זו?",
      type: "choose 1 of n"
    }
  },
  questions: [
    {
      contentType: "img",
      template: "whoami",
      correctSequence: [1, 0, 1, 2, 2]
    },
    {
      contentType: "img",
      template: "what-tb",
      answers: [
        'בה"די אטל',
        'בה"די אכ"א',
        'בה"די חינוך',
        'בה"די תקשוב',
        'בה"די תחזוקה'
      ],
      correctAnswer: 0
    },
    {
      contentType: "img",
      template: "what-tb",
      answers: ['בה"די אכ"א', 'בה"די חינוך', 'בה"די תקשוב', 'בה"די שלישות'],
      correctAnswer: 0
    },
    {
      title: "",
      contentType: "img",
      type: "choose 1 of n",
      answers: ['בה"ד תקשוב', 'בסמ"ח', "מצפן", "כנף 25"],
      correctAnswer: 0
    },
    {
      contentType: "img",
      template: "what-rank",
      answers: ['אל"ם', 'רב"ט', "תת אלוף", 'סא"ל'],
      correctAnswer: 0
    },
    {
      contentType: "img",
      template: "what-rank",
      answers: ['רנ"ג', 'רס"ב', 'רס"ר', 'סמ"ר'],
      correctAnswer: 0
    },
    {
      title: "למי צריך להצדיע ביחידה?",
      type: "choose 1 of n",
      answers: [
        'אל"ם חיים רבן',
        'רס"ן מיגל לויתן',
        'רב"ט צליל עמר',
        'סא"ל הילה בן מנדה'
      ],
      correctAnswer: 0
    },
    {
      title: "מי שונא את הגופן דוד במצגות",
      type: "choose 1 of n",
      answers: ["שרי חזי", "שלומי אוגרן", "מיגל לויתן", "דניאל פלג"],
      correctAnswer: 0
    },
    {
      title: "למי חשוב דיגום ביחידה?",
      type: "choose 1 of n",
      answers: [
        "נעמה נבון",
        "בן מצא",
        "אריאל עמר",
        "נועה עובדיה"
        // {
        //   text:
        //     "לישנוף, הוא רואה אותך ואת כל מעשך, היזהר פן תמצא את עצמך תחת מבטו האימתני והיוקד",
        //   extra: "till-shady"
        // }
      ],
      correctAnswer: 0
    },
    {
      title: 'מה המשמעות סמל מדור טי"ל',
      type: "choose 1 of n",
      answers: [
        "ינשוף - הדרכה, חץ - חתירה למטרה, עיניים חדות, WIFI - טכנולוגיה",
        "ינשוף - הדרכה, חץ - גישה חיובית, עיניים - בוהקות, WIFI - קליטה",
        "ינשוף - חינוך, חץ - שמאלניים, עיניים - מתלהבות, WIFI - הפצה רחבה",
        "ינשוף - הדרכה, חץ - חתירה למגע, עיניים חדות, WIFI - פתרון גנרי"
      ],
      correctAnswer: 0
    }
    // {
    //   transition: "tillTornado",
    //   flashing: "בונוס",
    //   title: 'מצא ואסוף את כל הטי"ל בטיל!',
    //   type: "find 10 random till, timeout 100"
    // }
  ]
};

var state = {
  questionIndex: 0,
  question: 0,
  correct: 0,
  currentQuestion: undefined
};

var providers = {
  property: {
    title: function(title, el) {
      if (!el.titleEl) {
        el.titleEl = el.querySelector(".title");
        if (!el.titleEl) {
          el.titleEl = document.createElement("div");
          el.titleEl.className = "title";
          el.appendChild(el.titleEl);
        }
      } else el.titleEl.classList.remove("inactive");
      document.title = "יום למידה" + (title ? ", " + title : "");
      el.titleEl.textContent = title;
    },

    flashing: function() {},
    extra: function() {},
    contentType: function(contentType, el) {
      if (contentType !== "img") return;
      if (!el.img) {
        el.img = new Image();
        el.appendChild(el.img);
        el.img.classList.add("display");
      } else el.img.classList.remove("inactive");
      el.img.classList.add("inactive");
      el.img.src = "img/display-" + state.question + ".png";
      el.img.onload = e => el.img.classList.remove("inactive");
    }
  },
  type: {
    choose: function(params, question, el) {
      question.right = 0;
      let i = 0;
      if (question.correctSequence && !question.repeat)
        question.repeat = question.correctSequence.length / params[0];
      if (!question.corrects) question.corrects = parseChoice(params, question);
      let correct =
        question.corrects[question.corrects.length - (question.repeat || 1)];
      let left = new Array(...question.answers);
      while (left.length) {
        let cls = String.fromCharCode("a".charCodeAt(0) + i);
        let index = Math.round(Math.random() * (left.length - 1));
        let answerText = left[index];
        left = left.removeIndex(index);
        let answer = el.querySelector("." + cls);
        if (!answer) {
          answer = document.createElement("div");
          answer.classList.add("answer");
          answer.classList.add(cls);
          answer.style.backgroundColor =
            "#" + rgbFromByte((i * 15 + 1 + 8 + 64) % 255).toString(16);
          el.appendChild(answer);
        } else answer.classList.remove("inactive");
        answer.index = question.answers.indexOf(answerText);
        answer.textContent = answerText;
        i++;
        answer.onclick = e => onChoice(el, question, e.target);
      }
      // for (let ans of question.answers) {
      //   var cls = String.fromCharCode("a".charCodeAt(0) + i);
      //   var answer = el.querySelector("." + cls);
      //   if (!answer) {
      //     answer = document.createElement("div");
      //     answer.classList.add("answer");
      //     answer.classList.add(cls);
      //     answer.style.backgroundColor =
      //       "#" + rgbFromByte((i * 15 + 1 + 8 + 64) % 255).toString(16);
      //   } else answer.classList.remove("inactive");
      //   answer.isCorrect = correct.indexOf(i) > 0;
      //   answer.textContent = ans;
      //   i++;
      //   answer.onclick = el.appendChild(answer);
      // }
    },
    find: function(params, question, el) {
      var count = Number(params[0]);
      if (params[1] in providers.type)
        placeRandom(...providers.type[params[1]](params[2], count));
      else for (var i = 0; i < count; i++) placeRandom(params[1]);
    },
    random: function(type, n) {
      var provider = providers.random[type];
      var rand = new Array(Number(type[1]));
      for (var i = 0; i < n.length; i++)
        rand[i] = provider[Math.floor(Math.random() * provider.length)];
      return rand;
    },
    timeout: function(params) {
      let t = setTimeout(next, params[0] * 1000);
      next.onCall = e => clearTimeout(t);
    }
  },
  random: {
    till: [
      "till",
      "till-white",
      "till-blinking",
      "till-blinking-one-eye",
      "till-shady"
    ]
  },
  transition: {
    tillTornado: function(params, el) {
      //todo..
    }
  }
};

var mainContent;

window.onload = function() {
  mainContent = document.getElementsByClassName("main-content")[0];
  parse();
};

function parse() {
  let question = cfg.questions[state.questionIndex];
  if (question.template) {
    Object.assign(question, cfg.templates[question.template]);
    question.template = undefined;
  }
  if (!state.currentQuestion)
    state.currentQuestion = Object.assign({}, question);
  for (let prop in state.currentQuestion) {
    if (!question.hasOwnProperty(prop)) continue;
    if (prop in providers.property) {
      providers.property[prop](question[prop], mainContent);
    } else if (prop in providers) {
      let propProviders = providers[prop];
      for (let str of question[prop].split(",")) {
        let words = str.split(" ");
        propProviders[words[0]](
          words.slice(1),
          state.currentQuestion,
          mainContent
        );
      }
    }
  }
}

async function onChoice(main, question, el) {
  let correct =
    question.corrects[question.corrects.length - (question.repeat || 1)];
  if (question.right === correct.length) return;
  if (correct.indexOf(el.index) >= 0) {
    question.right++;
    if (question.right !== correct.length) {
      el.classList.add("right");
      return;
    } else {
      state.correct++;
    }
  }
  for (let ans of main.getElementsByClassName("answer")) {
    if (correct.indexOf(ans.index) >= 0) ans.classList.add("right");
    else ans.classList.add("wrong");
  }

  await sleep(2000);
  for (let ans of main.getElementsByClassName("answer")) {
    ans.classList.remove("right");
    ans.classList.remove("wrong");
  }
  next();
}

function endScreen() {
  mainContent.style.display = "none";
  let logo = document.getElementsByClassName("logo")[0];
  logo.style.display = "none";
  var screen = document.createElement("div");
  screen.classList.add("end-screen");
  {
    let img;
    if (state.correct >= state.question * 0.9) img = "till-happy";
    else if (state.correct >= state.question * 0.5) img = "till-statisfied";
    else if (state.correct >= state.question * 0.35) img = "till";
    else img = "till-angry";
    let display = new Image();
    display.src = "img/" + img + ".png";
    display.className = "display";
    screen.appendChild(display);
  }
  var text = document.createElement("div");
  text.textContent =
    "סיימת את חידון יום הלמידה עם " +
    (state.correct / state.question) * 100 +
    " נקודות.";

  screen.append(text);
  document.body.append(screen);
  //todo... back button.
  //todo...
}

function next() {
  mainContent.querySelectorAll("*").forEach(el => el.classList.add("inactive"));
  state.question++;
  if (state.currentQuestion.repeat) state.currentQuestion.repeat--;
  if (!state.currentQuestion.repeat) {
    state.questionIndex++;
    state.currentQuestion = undefined;
  }
  if (state.questionIndex > cfg.questions.length - 1) endScreen();
  else parse();
  if (next.onCall) {
    next.onCall();
    next.onCall = null;
  }
}

function placeRandom(...args) {
  //todo... locations
}

function parseChoice(params, question) {
  if (question.correctSequence) {
    var corrects = [];
    for (var i = 0; i < question.correctSequence.length; i += Number(params[0]))
      corrects.push(question.correctSequence.slice(i, i + Number(params[0])));
    return corrects;
  } else {
    if (question.correctAnswers) return [question.correctAnswers];
    return [[question.correctAnswer]];
  }
}

function rgbFromByte(b) {
  return (
    (((b & 0x7) / 0x7) * 0xff) |
    (((b & 0x38) / 0x38) * 0xff00) |
    (((b & 0xc0) / 0xc0) * 0xff0000)
  );
}
