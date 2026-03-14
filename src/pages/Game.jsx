import { useState, useCallback } from 'react'
import Button from '../components/Button'

// ── Game data ──────────────────────────────────────────────────────────────

const RESOURCES = ['🔫 Gun', '👮 Officer', '📻 Radio', '🗺️ Map']

const STAGES = [
  {
    id: 'riddle',
    title: '🔮 Stage 1 — Riddle',
    intro: 'Solve the riddle to move forward.',
    emoji: '🔮',
    bg: 'rgba(139,92,246,0.08)',
    questions: [
      { q: 'What room can no one enter?',                          a: 'mushroom',  hints: ['It grows in the ground.', 'It\'s a type of fungus.', 'Think: mush + room.'] },
      { q: 'I can be cracked, made, told, and played. What am I?', a: 'joke',      hints: ['People do this to make others laugh.', 'Comedians tell these.', 'It\'s a one-liner.'] },
      { q: 'I have a spine but no bones. What am I?',              a: 'book',      hints: ['You read it.', 'You find it in a library.', 'It has pages and a cover.'] },
    ],
  },
  {
    id: 'puzzle',
    title: '🧩 Stage 2 — Puzzle',
    intro: 'Solve the puzzle to continue.',
    emoji: '🧩',
    bg: 'rgba(20,184,166,0.08)',
    questions: [
      { q: 'Full of holes but still holds water?',                          a: 'sponge', hints: ['You use it to wash dishes.', 'It absorbs liquid.', 'Think: kitchen cleaning tool.'] },
      { q: 'Light as a feather, yet no one can hold it for a minute?',      a: 'breath', hints: ['You do it every second.', 'It keeps you alive.', 'Inhale... exhale...'] },
      { q: 'Has a head, a tail, is brown, and has no legs?',                a: 'penny',  hints: ['It\'s worth very little.', 'It\'s a coin.', 'One cent.'] },
    ],
  },
  {
    id: 'quiz',
    title: '📚 Stage 3 — Quiz',
    intro: 'Answer the spooky quiz question.',
    emoji: '👻',
    bg: 'rgba(236,72,153,0.08)',
    questions: [
      { q: 'What do ghosts eat for dinner?',                  a: 'spooketti',   hints: ['It\'s a food.', 'Sounds like a pasta dish.', 'Spaghetti... but spooky.'] },
      { q: 'What is a witch\'s favourite subject in school?', a: 'spelling',    hints: ['It\'s a school subject.', 'Witches cast these.', 'S-P-E-L-L-I-N-G.'] },
      { q: 'What is a monster\'s favourite dessert?',         a: 'ice scream',  hints: ['It\'s cold.', 'Sounds like a frightened reaction.', 'Ice... scream.'] },
    ],
  },
]

const IMPOSTER_STAGE = {
  id: 'imposter',
  title: '👥 Stage 4 — The Imposter',
  intro: 'Two officers give conflicting advice. One is an imposter.',
  choices: [
    { label: 'Follow Officer A — head deeper into the forest.', outcome: 'bad' },
    { label: 'Follow Officer B — stay near the village and wait for rescue.', outcome: 'good' },
  ],
}

const MONSTER_CHALLENGES = [
  { q: 'What do you call a ghost that tells good jokes?', a: 'boogie man', hint: 'It boogies.' },
  { q: 'What kind of music do mummies listen to?',        a: 'rap',        hint: 'They like to wrap things.' },
  { q: 'Why did the vampire need mouthwash?',             a: 'because he had bad breath', hint: 'Think about what vampires drink.' },
]

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ── Initial state factory ──────────────────────────────────────────────────

function initState() {
  return {
    phase: 'intro',
    stageIdx: 0,
    question: null,
    resources: [...RESOURCES],
    hintsLeft: 3,
    hintIdx: 0,        // tracks which hint in the hints[] array to show next
    score: 0,
    answer: '',
    feedback: null,
    shownHints: [],    // list of hints revealed so far for current question
    totalAnswered: 0,
  }
}

// ── Component ──────────────────────────────────────────────────────────────

export default function Game() {
  const [gs, setGs] = useState(initState)

  const update = (patch) => setGs(prev => ({ ...prev, ...patch }))

  const startGame = () => {
    const q = pickRandom(STAGES[0].questions)
    update({ phase: 'stage', stageIdx: 0, question: q, answer: '', feedback: null, shownHints: [], hintIdx: 0 })
  }

  const loseResource = (state) => {
    const next = state.resources.slice(1)
    if (next.length === 0) return { ...state, resources: next, phase: 'lose' }
    return { ...state, resources: next }
  }

  const handleAnswer = () => {
    const { answer, question, stageIdx, score, totalAnswered } = gs
    const correct = answer.trim().toLowerCase() === question.a

    if (correct) {
      const newScore = score + 10
      const nextStageIdx = stageIdx + 1
      if (nextStageIdx < STAGES.length) {
        const nextQ = pickRandom(STAGES[nextStageIdx].questions)
        update({ score: newScore, stageIdx: nextStageIdx, question: nextQ, answer: '', feedback: 'correct', shownHints: [], hintIdx: 0, totalAnswered: totalAnswered + 1 })
        setTimeout(() => update({ feedback: null }), 800)
      } else {
        update({ score: newScore, phase: 'imposter', answer: '', feedback: 'correct', shownHints: [], hintIdx: 0, totalAnswered: totalAnswered + 1 })
        setTimeout(() => update({ feedback: null }), 800)
      }
    } else {
      const next = loseResource(gs)
      if (next.phase === 'lose') {
        setGs({ ...gs, ...next, feedback: 'wrong', totalAnswered: totalAnswered + 1 })
      } else {
        setGs({ ...gs, ...next, feedback: 'wrong', answer: '', totalAnswered: totalAnswered + 1 })
        setTimeout(() => update({ feedback: null }), 800)
      }
    }
  }

  // Show the next unused hint for the current question
  const handleUseHint = () => {
    const { hintsLeft, hintIdx, question, shownHints } = gs
    if (hintsLeft === 0) return
    const nextHint = question.hints[hintIdx % question.hints.length]
    update({
      hintsLeft: hintsLeft - 1,
      hintIdx: hintIdx + 1,
      shownHints: [...shownHints, nextHint],
    })
  }

  const handleImposterChoice = (outcome) => {
    if (outcome === 'good') {
      update({ phase: 'win', score: gs.score + 20 })
    } else {
      update({ phase: 'final' })
    }
  }

  const handleFinalChoice = (action) => {
    if (action === 'fight') {
      const win = Math.random() > 0.4
      update({ phase: win ? 'win' : 'lose', score: win ? gs.score + 15 : gs.score })
    } else {
      const challenge = pickRandom(MONSTER_CHALLENGES)
      update({ phase: 'monster', question: challenge, answer: '', hint: null })
    }
  }

  const handleMonsterAnswer = () => {
    const correct = gs.answer.trim().toLowerCase() === gs.question.a
    if (correct) {
      update({ phase: 'win', score: gs.score + 25 })
    } else {
      const next = loseResource(gs)
      setGs({ ...gs, ...next, phase: next.phase === 'lose' ? 'lose' : 'lose' })
    }
  }

  const restart = () => setGs(initState())

  const stage = STAGES[gs.stageIdx]
  const progress = gs.phase === 'stage'
    ? ((gs.stageIdx) / (STAGES.length + 1)) * 100
    : gs.phase === 'imposter' ? (STAGES.length / (STAGES.length + 1)) * 100
    : gs.phase === 'win' || gs.phase === 'lose' ? 100 : 0

  return (
    <div className="page">
      <div className="page-header">
        <h1>🏚️ Mystery Village Game</h1>
        <p>Solve riddles and puzzles to escape the forest. Every wrong answer costs a resource.</p>
      </div>

      <div className="game-container">

        {/* ── Intro ── */}
        {gs.phase === 'intro' && (
          <div className="game-stage">
            {/* Scene illustration */}
            <div style={{ fontSize: '4rem', lineHeight: 1, marginBottom: '0.5rem' }}>🌲🏚️🌲</div>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🌙 ⭐ 🌙</div>
            <h2>The Mysterious Village</h2>
            <p className="question">
              You are lost in a forest maze. Solve every challenge to escape.
              Each wrong answer costs you a resource. Lose them all — game over.
            </p>
            <div style={{ margin: '1.5rem 0' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Your starting resources:</div>
              <div className="game-resources">
                {RESOURCES.map(r => <span key={r} className="resource-chip">{r}</span>)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <span>🔮 Stage 1: Riddle</span>
              <span>→</span>
              <span>🧩 Stage 2: Puzzle</span>
              <span>→</span>
              <span>📚 Stage 3: Quiz</span>
              <span>→</span>
              <span>👥 Stage 4: Imposter</span>
            </div>
            <Button onClick={startGame}>Start Adventure →</Button>
          </div>
        )}

        {/* ── Stage (riddle / puzzle / quiz) ── */}
        {gs.phase === 'stage' && stage && (
          <div className="game-stage" style={{ background: stage.bg }}>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>

            <div className="score-bar">
              <div className="score-item"><div className="num">{gs.score}</div><div className="lbl">Score</div></div>
              <div className="score-item"><div className="num">{gs.resources.length}</div><div className="lbl">Resources</div></div>
              <div className="score-item"><div className="num">{gs.hintsLeft}</div><div className="lbl">Hints</div></div>
            </div>

            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{stage.emoji}</div>
            <span className="badge badge-accent">{stage.title}</span>
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{stage.intro}</p>
            <p className="question">❓ {gs.question.q}</p>

            {/* Show all revealed hints stacked */}
            {gs.shownHints.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                {gs.shownHints.map((h, i) => (
                  <div key={i} style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, padding: '0.5rem 1rem', fontSize: '0.875rem', color: 'var(--warning)' }}>
                    💡 Hint {i + 1}: {h}
                  </div>
                ))}
              </div>
            )}

            <input
              className="input"
              placeholder="Type your answer..."
              value={gs.answer}
              onChange={e => update({ answer: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleAnswer()}
              style={{
                borderColor: gs.feedback === 'correct' ? 'var(--success)' : gs.feedback === 'wrong' ? 'var(--danger)' : undefined,
                marginBottom: '1rem',
              }}
            />

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button onClick={handleAnswer}>Submit Answer</Button>
              <Button variant="secondary" onClick={handleUseHint} disabled={gs.hintsLeft === 0}>
                💡 Use Hint ({gs.hintsLeft})
              </Button>
            </div>

            <div className="game-resources" style={{ marginTop: '1.5rem' }}>
              {RESOURCES.map(r => (
                <span key={r} className={`resource-chip${gs.resources.includes(r) ? '' : ' lost'}`}>{r}</span>
              ))}
            </div>
          </div>
        )}

        {/* ── Imposter ── */}
        {gs.phase === 'imposter' && (
          <div className="game-stage" style={{ background: 'rgba(245,158,11,0.06)' }}>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>👮 🤔 👮</div>
            <span className="badge badge-warning">{IMPOSTER_STAGE.title}</span>
            <p className="question">
              You reach the camp. Two officers give conflicting advice — but one is an imposter.
              Choose wisely.
            </p>
            <div className="game-choices">
              {IMPOSTER_STAGE.choices.map((c, i) => (
                <button key={i} className="game-choice" onClick={() => handleImposterChoice(c.outcome)}>
                  {i === 0 ? '🌲' : '🏕️'} {i + 1}. {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Final choice ── */}
        {gs.phase === 'final' && (
          <div className="game-stage" style={{ background: 'rgba(239,68,68,0.06)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌑 😰 🌑</div>
            <p className="question">Something feels wrong deep in the forest. What will you do?</p>
            <div className="game-choices">
              <button className="game-choice" onClick={() => handleFinalChoice('fight')}>⚔️ Fight the imposters</button>
              <button className="game-choice" onClick={() => handleFinalChoice('escape')}>🏃 Try to escape into the dark</button>
            </div>
          </div>
        )}

        {/* ── Monster challenge ── */}
        {gs.phase === 'monster' && gs.question && (
          <div className="game-stage" style={{ background: 'rgba(239,68,68,0.06)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🐉</div>
            <p style={{ color: 'var(--warning)', marginBottom: '1rem', fontWeight: 600 }}>A monster lurks in the shadows! Solve this riddle to hide:</p>
            <p className="question">❓ {gs.question.q}</p>
            <input
              className="input"
              placeholder="Your answer..."
              value={gs.answer}
              onChange={e => update({ answer: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleMonsterAnswer()}
              style={{ marginBottom: '1rem' }}
            />
            <Button onClick={handleMonsterAnswer}>Submit</Button>
          </div>
        )}

        {/* ── Win ── */}
        {gs.phase === 'win' && (
          <div className="game-stage" style={{ background: 'rgba(34,197,94,0.06)' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🎉</div>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏆 🌟 🏆</div>
            <h2 style={{ color: 'var(--success)' }}>You Escaped!</h2>
            <p className="question">You survived the Mysterious Village and made it out safely. Well done!</p>
            <div className="score-bar" style={{ marginTop: '1.5rem' }}>
              <div className="score-item"><div className="num">{gs.score}</div><div className="lbl">Final Score</div></div>
              <div className="score-item"><div className="num">{gs.resources.length}</div><div className="lbl">Resources Left</div></div>
            </div>
            <Button onClick={restart} style={{ marginTop: '1.5rem' }}>Play Again</Button>
          </div>
        )}

        {/* ── Lose ── */}
        {gs.phase === 'lose' && (
          <div className="game-stage" style={{ background: 'rgba(239,68,68,0.06)' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>💀</div>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌲 ☠️ 🌲</div>
            <h2 style={{ color: 'var(--danger)' }}>Game Over</h2>
            <p className="question">You lost all your resources. The forest claimed you.</p>
            <div className="score-bar" style={{ marginTop: '1.5rem' }}>
              <div className="score-item"><div className="num">{gs.score}</div><div className="lbl">Final Score</div></div>
            </div>
            <Button onClick={restart} style={{ marginTop: '1.5rem' }}>Try Again</Button>
          </div>
        )}

      </div>
    </div>
  )
}
