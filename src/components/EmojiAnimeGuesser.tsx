/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, ArrowRight, RotateCcw, HelpCircle, Sparkles, Heart, Flame, Timer, AlertCircle } from "lucide-react";
import { sound } from "../utils/audio";

interface EmojiQuestion {
  id: number;
  emojis: string;
  answer: string;
  options: string[];
  mnHint: string;
  enHint: string;
  image: string;
}

const EMOJI_QUESTIONS: EmojiQuestion[] = [
  {
    id: 1,
    emojis: "🏴‍☠️🍖👒",
    answer: "One Piece",
    options: ["One Piece", "Naruto", "Bleach", "Dragon Ball"],
    mnHint: "Агвааны хамгийн дуртай далайн дээрэмчинтэй аниме!",
    enHint: "Agvaan's absolute favorite anime about pirates and a straw hat!",
    image: "/src/assets/images/one_piece_art_1782882096753.jpg"
  },
  {
    id: 2,
    emojis: "🦊🟠🍜🥷",
    answer: "Naruto",
    options: ["Naruto", "One Piece", "Bleach", "My Hero Academia"],
    mnHint: "Навчин тосгоны хошин бөгөөд хүчирхэг нинжа.",
    enHint: "The orange-clad ninja who dreams of becoming Hokage.",
    image: "/src/assets/images/naruto_art_1782882109211.jpg"
  },
  {
    id: 3,
    emojis: "👹🗡️🌊🪵",
    answer: "Demon Slayer",
    options: ["Attack on Titan", "Demon Slayer", "Jujutsu Kaisen", "Sword Art Online"],
    mnHint: "Танжиро болон түүний хулсан хаалттай дүү Нэзүко.",
    enHint: "Tanjiro fights demons to save his sister Nezuko.",
    image: "/src/assets/images/demon_slayer_art_1782882122347.jpg"
  },
  {
    id: 4,
    emojis: "🐲⚾💥🥋",
    answer: "Dragon Ball",
    options: ["Hunter x Hunter", "One Punch Man", "Dragon Ball", "Naruto"],
    mnHint: "Сон Гокү бөмбөлөгүүдийг цуглуулж хүслээ гуйна.",
    enHint: "Goku searches for magical spheres that summon a dragon.",
    image: "/src/assets/images/dragon_ball_art_1782882134720.jpg"
  },
  {
    id: 5,
    emojis: "📓🖊️💀🍎",
    answer: "Death Note",
    options: ["Death Note", "Tokyo Ghoul", "Bleach", "Code Geass"],
    mnHint: "Алим идэх дуртай Рюүк болон ухаант Лайт.",
    enHint: "A notebook that can decide the fate of humans with a pen.",
    image: "/src/assets/images/death_note_art_1782882147676.jpg"
  },
  {
    id: 6,
    emojis: "🧱👣⚔️🩸",
    answer: "Attack on Titan",
    options: ["Attack on Titan", "Kabaneri", "Vinland Saga", "Berserk"],
    mnHint: "Хүмүүсийг хамгаалдаг асар том хана болон аварга биетүүд.",
    enHint: "High stone walls, giant Titans, and soldiers flying using ODM gear.",
    image: "/src/assets/images/attack_on_titan_art_1782883621801.jpg"
  },
  {
    id: 7,
    emojis: "👁️🤞🏫💀",
    answer: "Jujutsu Kaisen",
    options: ["Jujutsu Kaisen", "Chainsaw Man", "Bleach", "Tokyo Ghoul"],
    mnHint: "Хараалын сургууль, Гожо багш болон Сукунагийн хуруу.",
    enHint: "Cursed energy, Satoru Gojo's beautiful eyes, and Ryomen Sukuna's fingers.",
    image: "/src/assets/images/jujutsu_kaisen_art_1782883637343.jpg"
  },
  {
    id: 8,
    emojis: "🎣⚡🛹👹",
    answer: "Hunter x Hunter",
    options: ["Hunter x Hunter", "Yu Yu Hakusho", "Fullmetal Alchemist", "Fairy Tail"],
    mnHint: "Гон загасны уургаар, Киллуа цахилгаанаар тулалддаг аялал.",
    enHint: "Gon with a fishing rod and Killua with yoyos/lightning exploring a dangerous world.",
    image: "/src/assets/images/hunter_x_hunter_art_1782883648174.jpg"
  },
  {
    id: 9,
    emojis: "🦸‍♂️🥦⚡🏫",
    answer: "My Hero Academia",
    options: ["My Hero Academia", "One Punch Man", "Mob Psycho 100", "Black Clover"],
    mnHint: "Баатруудын сургууль болон супер хүчгүй байсан ч шилдэг нь болсон Брокколи хүү!",
    enHint: "UA High School where teenagers learn to control their quirks to fight villains.",
    image: "/src/assets/images/my_hero_academia_art_1782883659223.jpg"
  },
  {
    id: 10,
    emojis: "🦾⚙️🐕🧪",
    answer: "Fullmetal Alchemist",
    options: ["Fullmetal Alchemist", "Steins;Gate", "D.Gray-man", "Soul Eater"],
    mnHint: "Төмөр гар, алхимийн ухаан, ах дүү Элрик нарын адал явдал.",
    enHint: "Equivalent exchange, automail arm, and two brothers seeking the Philosopher's Stone.",
    image: "/src/assets/images/fullmetal_alchemist_art_1782883670526.jpg"
  }
];

const ANIME_ALIASES: Record<string, string[]> = {
  "One Piece": ["one piece", "onepiece", "op"],
  "Naruto": ["naruto", "naruto shippuden"],
  "Demon Slayer": ["demon slayer", "demonslayer", "kimetsu no yaiba", "kimetsu"],
  "Dragon Ball": ["dragon ball", "dragonball", "dbz", "dragon ball z", "dragonball z"],
  "Death Note": ["death note", "deathnote"],
  "Attack on Titan": ["attack on titan", "attackontitan", "aot", "shingeki no kyojin", "shingeki"],
  "Jujutsu Kaisen": ["jujutsu kaisen", "jujutsukaisen", "jjk"],
  "Hunter x Hunter": ["hunter x hunter", "hunterxhunter", "hxh"],
  "My Hero Academia": ["my hero academia", "myheroacademia", "mha", "boku no hero academia"],
  "Fullmetal Alchemist": ["fullmetal alchemist", "fullmetalalchemist", "fma", "fmab"]
};

const ALL_UNIQUE_ANSWERS = Array.from(
  new Set(EMOJI_QUESTIONS.map((q) => q.answer))
).sort();

const isCorrectAnswer = (typed: string, correct: string) => {
  const t = typed.trim().toLowerCase();
  const c = correct.trim().toLowerCase();
  
  if (t === c) return true;
  
  // Check in normalization
  const normT = t.replace(/[^a-z0-9]/g, "");
  const normC = c.replace(/[^a-z0-9]/g, "");
  if (normT === normC && normT.length > 2) return true;
  
  // Check aliases
  const aliases = ANIME_ALIASES[correct];
  if (aliases) {
    if (aliases.some(alias => alias.trim().toLowerCase() === t || alias.trim().toLowerCase().replace(/[^a-z0-9]/g, "") === normT)) {
      return true;
    }
  }
  
  return false;
};

interface Props {
  lang: "mn" | "en";
  soundEnabled?: boolean;
}

export function EmojiAnimeGuesser({ lang, soundEnabled = true }: Props) {
  const [currIdx, setCurrIdx] = useState<number>(0);
  const [typedAnswer, setTypedAnswer] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [streak, setStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [hasStreakBonus, setHasStreakBonus] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);

  const question = EMOJI_QUESTIONS[currIdx];

  // 15-Second Timer Countdown
  useEffect(() => {
    if (isAnswered || gameFinished) return;

    setTimeLeft(15);
    setIsTimedOut(false);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Timeout counts as incorrect
          setIsAnswered(true);
          setIsTimedOut(true);
          setIsCorrect(false);
          setStreak(0);
          setLives((l) => {
            const nextL = l - 1;
            if (nextL <= 0) {
              setGameFinished(true);
              if (soundEnabled) sound.playFail();
            } else {
              if (soundEnabled) sound.playBuzz();
            }
            return nextL;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currIdx, isAnswered, gameFinished, soundEnabled]);

  const handleCheckAnswer = (answerToSubmit?: string) => {
    if (isAnswered) return;
    const finalAnswer = answerToSubmit !== undefined ? answerToSubmit : typedAnswer;
    if (!finalAnswer.trim()) return;

    setIsAnswered(true);
    const correct = isCorrectAnswer(finalAnswer, question.answer);
    setIsCorrect(correct);

    if (correct) {
      if (soundEnabled) sound.playDing();
      setScore((prev) => prev + 10);
      setCorrectCount((prev) => prev + 1);
      
      // Streak tracking
      setStreak((prev) => {
        const nextStreak = prev + 1;
        if (nextStreak === 3) {
          // Add +20 bonus points
          setScore((s) => s + 20);
          setHasStreakBonus(true);
          if (soundEnabled) sound.playLevelUp();
          setTimeout(() => setHasStreakBonus(false), 2200);
          return 0; // reset streak after award
        }
        return nextStreak;
      });
    } else {
      if (soundEnabled) sound.playBuzz();
      setStreak(0);
      setLives((prev) => {
        const nextL = prev - 1;
        if (nextL <= 0) {
          setGameFinished(true);
          if (soundEnabled) sound.playFail();
        }
        return nextL;
      });
    }
  };

  const handleNext = () => {
    setTypedAnswer("");
    setIsCorrect(false);
    setIsAnswered(false);
    setShowHint(false);
    setIsTimedOut(false);

    if (currIdx < EMOJI_QUESTIONS.length - 1) {
      setCurrIdx((prev) => prev + 1);
      if (soundEnabled) sound.playBeep();
    } else {
      if (soundEnabled) sound.playLevelUp();
      setGameFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrIdx(0);
    setTypedAnswer("");
    setIsCorrect(false);
    setIsAnswered(false);
    setScore(0);
    setLives(3);
    setStreak(0);
    setCorrectCount(0);
    setTimeLeft(15);
    setHasStreakBonus(false);
    setGameFinished(false);
    setShowHint(false);
    setIsTimedOut(false);
    if (soundEnabled) sound.playLevelUp();
  };

  return (
    <div className="w-full rounded-[32px] border border-white/15 bg-black/40 p-6 sm:p-8 liquid-glass relative overflow-hidden flex flex-col justify-between min-h-[580px] shadow-2xl">
      {/* Background neon dots grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, var(--color-neon) 1.2px, transparent 1.2px)`,
          backgroundSize: "20px 20px"
        }}
      />

      {/* Floating Streak Bonus Banner Overlay */}
      <AnimatePresence>
        {hasStreakBonus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -40 }}
            className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 rounded-[32px] pointer-events-none"
          >
            <div className="p-6 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-center shadow-[0_0_40px_rgba(249,115,22,0.3)] max-w-xs mx-4">
              <Flame className="w-14 h-14 text-orange-500 animate-bounce mx-auto mb-2 fill-orange-500" />
              <h4 className="text-xl font-grotesk text-orange-400 uppercase tracking-widest font-extrabold">STREAK BONUS!</h4>
              <p className="text-4xl font-mono text-white font-extrabold mt-1">+20 PTS</p>
              <span className="text-[10px] uppercase font-mono text-white/50 block mt-2 tracking-wider leading-relaxed">
                {lang === "mn" ? "Дараалан 3 зөв хариуллаа! 🔥" : "3 correct answers in a row! 🔥"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header and Progress Indicator */}
      <div className="relative z-10 w-full">
        <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-5">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-neon uppercase font-mono tracking-widest block font-extrabold">
              {lang === "mn" ? "🔮 ЭМОЖИ & ЗУРАГТ ТААВАР" : "🔮 EMOJI & ART GUESSER"}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono text-cream/50">
                {lang === "mn" ? "Амь:" : "LIVES:"}
              </span>
              <div className="flex gap-1 items-center">
                {[...Array(3)].map((_, i) => (
                  <Heart 
                    key={i} 
                    className={`w-4 h-4 transition-all duration-300 ${i < lives ? "text-red-500 fill-red-500 animate-pulse" : "text-white/10"}`} 
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-2">
              {streak > 0 && (
                <div className="flex items-center gap-1 text-orange-500 animate-pulse bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold">
                  <Flame className="w-3.5 h-3.5 fill-orange-500" />
                  <span>STREAK {streak}</span>
                </div>
              )}
              <span className="text-sm font-extrabold text-neon font-mono">
                SCORE: {score}
              </span>
            </div>
            
            {/* Countdown timer badge inside header */}
            {!isAnswered && !gameFinished && (
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 border border-white/10 text-[10px] font-mono font-bold text-cream">
                <Timer className={`w-3 h-3 ${timeLeft <= 5 ? "text-red-500 animate-bounce" : "text-neon"}`} />
                <span className={timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-cream"}>{timeLeft}S</span>
              </div>
            )}
          </div>
        </div>

        {/* Global Progress Line Bar */}
        {!gameFinished && (
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-5">
            <div 
              className="h-full bg-gradient-to-r from-neon to-emerald-400 transition-all duration-300"
              style={{ width: `${((currIdx + (isAnswered ? 1 : 0)) / EMOJI_QUESTIONS.length) * 100}%` }}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          {!gameFinished ? (
            <motion.div
              key={currIdx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="flex flex-col gap-5"
            >
              {/* Emojis & Art Illustration Display Section */}
              <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center bg-black/60 shadow-inner group">
                {/* Generated Art Illustration */}
                <img 
                  src={question.image} 
                  alt="Anime Universe Clue" 
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-lighten transition-transform duration-700 group-hover:scale-105" 
                />

                {/* Subtle dark gradient overlay to keep elements readable and enhance high-contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30" />

                {/* Emojis badging floating overlay with high contrast background */}
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="px-6 py-3 bg-space-bg/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl flex items-center justify-center gap-1 animate-bounce" style={{ animationDuration: "3s" }}>
                    <span className="text-4xl sm:text-5xl tracking-widest select-none">
                      {question.emojis}
                    </span>
                  </div>
                  <span className="text-[11px] uppercase font-mono tracking-widest text-neon bg-black/80 border border-neon/30 px-3 py-1 rounded-full shadow-[0_0_10px_rgba(111,255,0,0.2)]">
                    {lang === "mn" ? "ЗУРГИЙН САНУУЛГА 🎨" : "ARTWORK CLUE 🎨"}
                  </span>
                </div>
                
                {/* Micro badge indicator */}
                <span className="absolute bottom-3 right-4 text-[10px] font-mono font-bold text-cream/70 bg-black/80 border border-white/10 px-2.5 py-1 rounded">
                  STAGE {question.id} / {EMOJI_QUESTIONS.length}
                </span>
              </div>

              {/* Countdown Progress Slider Bar directly beneath the illustration */}
              {!isAnswered && (
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r transition-all duration-1000 ease-linear ${timeLeft <= 5 ? "from-red-500 to-orange-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "from-neon to-cyan-400 shadow-[0_0_8px_rgba(111,255,0,0.5)]"}`}
                    style={{ width: `${(timeLeft / 15) * 100}%` }}
                  />
                </div>
              )}

              {/* Timeout notification badge */}
              {isTimedOut && (
                <div className="w-full py-2.5 px-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center gap-2 font-mono text-xs uppercase animate-pulse">
                  <AlertCircle className="w-4 h-4" />
                  <span>{lang === "mn" ? "ХУГАЦАА ДУУССАН! СУУДЛААС ОНОО ХАСАГДЛАА" : "TIMEOUT! TIME IS UP"}</span>
                </div>
              )}

              {/* Instructions text */}
              <p className="text-xs sm:text-sm text-cream/70 text-center font-mono uppercase bg-white/[0.02] border border-white/5 py-2 px-4 rounded-xl">
                {lang === "mn" ? "Дээрх зураг болон эможид тохирох аниме нэрийг бичнэ үү:" : "Identify the matching anime based on the artwork and emojis:"}
              </p>

              {/* Typing Input Form */}
              <div className="flex flex-col gap-4">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCheckAnswer();
                  }}
                  className="flex flex-col sm:flex-row gap-2 w-full"
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      disabled={isAnswered}
                      value={typedAnswer}
                      onChange={(e) => setTypedAnswer(e.target.value)}
                      placeholder={lang === "mn" ? "Аниме нэрийг бичнэ үү..." : "Type anime name here..."}
                      className={`w-full px-5 py-4 bg-black/60 border rounded-2xl font-mono text-cream placeholder-cream/40 focus:outline-none focus:ring-2 transition-all duration-300 text-xs sm:text-sm ${
                        isAnswered
                          ? isCorrect
                            ? "border-green-500/50 focus:ring-green-500/30 bg-green-500/10 text-green-300"
                            : "border-red-500/50 focus:ring-red-500/30 bg-red-500/10 text-red-300"
                          : "border-white/10 focus:border-[#6FFF00] focus:ring-[#6FFF00]/20"
                      }`}
                    />
                    
                    {isAnswered && (
                      <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-1 rounded uppercase ${
                        isCorrect ? "bg-green-500/25 border border-green-500/40 text-green-300" : "bg-red-500/25 border border-red-500/40 text-red-300"
                      }`}>
                        {isCorrect ? (lang === "mn" ? "ЗӨВ ✓" : "CORRECT ✓") : (lang === "mn" ? "БУРУУ ✗" : "WRONG ✗")}
                      </span>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isAnswered || !typedAnswer.trim()}
                    className={`px-6 py-4 rounded-2xl font-mono font-bold text-xs uppercase tracking-widest cursor-pointer transition-all duration-300 flex items-center justify-center gap-1.5 ${
                      isAnswered || !typedAnswer.trim()
                        ? "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
                        : "bg-[#6FFF00] text-space-bg hover:bg-[#6FFF00]/90 shadow-[0_0_15px_rgba(111,255,0,0.35)] hover:shadow-[0_0_25px_rgba(111,255,0,0.55)]"
                    }`}
                  >
                    <span>{lang === "mn" ? "ШАЛГАХ" : "CHECK"}</span>
                  </button>
                </form>

                {/* Show feedback if answered */}
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border font-mono text-xs uppercase flex flex-col gap-1 ${
                      isCorrect 
                        ? "bg-green-500/10 border-green-500/20 text-green-300" 
                        : "bg-red-500/10 border-red-500/20 text-red-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{isCorrect ? (lang === "mn" ? "МАШ ЗӨВ! 🎉" : "EXCELLENT! 🎉") : (lang === "mn" ? "ХАРАМСАЛТАЙ НЬ БУРУУ БАЙНА." : "UNFORTUNATELY WRONG.")}</span>
                    </div>
                    <div className="text-[11px] text-cream/70 mt-1">
                      {lang === "mn" ? "ЗӨВ ХАРИУЛТ:" : "CORRECT ANSWER:"}{" "}
                      <strong className="text-white underline decoration-neon">{question.answer}</strong>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Action and Hint row */}
              <div className="flex flex-col gap-3 mt-2">
                <AnimatePresence>
                  {showHint && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs font-mono uppercase bg-neon/10 border border-neon/20 p-3 rounded-xl text-neon leading-relaxed"
                    >
                      💡 {lang === "mn" ? question.mnHint : question.enHint}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="flex justify-between items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setShowHint(!showHint);
                      if (soundEnabled) sound.playBeep();
                    }}
                    className="px-4 py-2 rounded-xl border border-white/10 hover:border-white/25 text-[11px] uppercase font-mono text-cream/60 hover:text-cream cursor-pointer flex items-center gap-2 transition-all hover:bg-white/[0.03]"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>{lang === "mn" ? "САНУУЛГА АВАХ" : "REVEAL HINT"}</span>
                  </button>

                  {isAnswered && (
                    <button
                      onClick={handleNext}
                      className="px-6 py-2.5 rounded-xl bg-neon hover:bg-neon/90 text-space-bg font-bold text-xs uppercase tracking-widest cursor-pointer transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(111,255,0,0.3)] hover:shadow-[0_0_25px_rgba(111,255,0,0.5)]"
                    >
                      <span>{currIdx === EMOJI_QUESTIONS.length - 1 ? (lang === "mn" ? "ДУУСГАХ" : "FINISH") : (lang === "mn" ? "ДАРААГИЙНХ" : "NEXT QUESTION")}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="flex flex-col items-center justify-center text-center py-16 gap-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-neon/20 rounded-full blur-2xl animate-pulse" />
                <div className="w-20 h-20 rounded-full bg-neon/15 border-2 border-neon/40 flex items-center justify-center relative shadow-[0_0_30px_rgba(111,255,0,0.2)]">
                  {lives <= 0 ? (
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  ) : (
                    <Trophy className="w-10 h-10 text-neon" />
                  )}
                </div>
              </div>

              <div>
                <h4 className={`font-grotesk text-3xl uppercase tracking-wider leading-none mb-3 ${lives <= 0 ? "text-red-400" : "text-cream"}`}>
                  {lives <= 0 
                    ? (lang === "mn" ? "АМЬ ДУУСЛАА! 💔" : "GAME OVER! 💔") 
                    : (lang === "mn" ? "ТУЛААН ДУУСЛАА!" : "CONGRATULATIONS!")}
                </h4>
                <p className="text-sm text-cream/70 font-mono uppercase tracking-wide">
                  {lang === "mn"
                    ? `Та ${EMOJI_QUESTIONS.length} асуултаас ${correctCount} аниме зөв тааж, ${score} оноо цуглууллаа.`
                    : `You successfully matched ${correctCount} out of ${EMOJI_QUESTIONS.length} anime universes with a score of ${score} pts.`}
                </p>
              </div>

              {correctCount === EMOJI_QUESTIONS.length && lives > 0 && (
                <div className="px-4 py-1.5 bg-[#6FFF00]/15 border border-[#6FFF00]/30 rounded-full text-[#6FFF00] font-mono text-xs uppercase flex items-center gap-1.5 animate-pulse shadow-[0_0_15px_rgba(111,255,0,0.15)]">
                  <Sparkles className="w-4 h-4" />
                  <span>{lang === "mn" ? "ЖИНХЭНЭ АНИМЕ СЭНХЭЭТЭН!" : "ULTIMATE ANIME OTAKU!"}</span>
                </div>
              )}

              <button
                onClick={handleRestart}
                className="px-6 py-3 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/[0.03] text-cream font-bold text-xs uppercase tracking-widest cursor-pointer transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === "mn" ? "ДАХИН ТОГЛОХ" : "PLAY AGAIN"}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer verification tag */}
      <div className="relative z-10 flex justify-between items-center text-[9px] font-mono text-cream/40 border-t border-white/5 pt-3 mt-4">
        <span>STATIONS ENCRYPTION CODE: ANM-71B</span>
        <span>{lang === "mn" ? "ИДЭВХТЭЙ" : "ACTIVE"}</span>
      </div>
    </div>
  );
}
export default EmojiAnimeGuesser;
