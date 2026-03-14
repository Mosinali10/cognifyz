import { useState, useCallback } from 'react'
import Button from '../components/Button'

// ── Game data ──────────────────────────────────────────────────────────────

const RESOURCES = ['🔫 Gun', '👮 Officer', '📻 Radio', '🗺️ Map']

const STAGES = [
  {
    id: 'riddle',
    title: '🔮 Stage 1 — Riddle',
    intro: 'Solve the riddle to move forward.',
    questions: [
      { q: 'What room can no one enter?',                          a: 'mushroom',  hint: 'It\'s a type of fungus.' },
      { q: 'I can be cracked, made, told, and played. What am I?', a: 'joke',      hint: 'It makes people laugh.' },
      { q: 'I have a spine but no bones. What am I?',              a: 'book',      hint: 'You find it in a library.' },
    ],
  },
  {
    id: 'puzzle',
    title: '🧩 Stage 2 — Puzzle',
    intro: 'Solve the puzzle to continue.',
    questions: [
      { q: 'Full of holes but still holds water?',                          a: 'sponge', hint: 'Think absorbent.' },
      { q: 'Light as a feather, yet no one can hold it for a minute?',      a: 'breath', hint: 'You do it every second.' },
      { q: 'Has a head, a tail, is brown, and has no legs?',                a: 'penny',  hint: 'It\'s a coin.' },
    ],
  },
  {
    id: 'quiz',
    title: '📚 Stage 3 — Quiz',
    intro: 'Answer the spooky quiz question.',
    questions: [
      { q: 'What do ghosts eat for dinner?',                  a: 'spooketti',   hint: 'A type of pasta.' },
      { q: 'What is a witch\'s favourite subject in school?', a: 'spelling',    hint: 'It involves words.' },
      { q: 'What is a monster\'s favourite dessert?',         a: 'ice scream',  hint: 'Sounds like a cold treat.' },
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
    phase: 'intro',       // intro | stage | imposter | final | monster | win | lose
    stageIdx: 0,
    question: null,
    resources: [...RESOURCES],
    hintsLeft: 3,
    score: 0,
    answer: '',
    feedback: null,       // null | 'correct' | 'wrong'
    hint: null,
    totalAnswered: 0,
  }
}

// ── Component ──────────────────────────────────────────────────────────────

export default function Game() {
  const [gs, setGs] = useState(initState)

  const update = (patch) => setGs(prev => ({ ...prev, ...patch }))

  const startGame = () => {
    const q = pickRandom(STAGES[0].questions)
    update({ phase: 'stage', stageIdx: 0, question: q, answer: '', feedback: null, hint: null })
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
        // Move to next stage
        const nextQ = pickRandom(STAGES[nextStageIdx].questions)
        update({ score: newScore, stageIdx: nextStageIdx, question: nextQ, answer: '', feedback: 'correct', hint: null, totalAnswered: totalAnswered + 1 })
        setTimeout(() => update({ feedback: null }), 800)
      } else {
        // Move to imposter stage
        update({ score: newScore, phase: 'imposter', answer: '', feedback: 'correct', hint: null, totalAnswered: totalAnswered + 1 })
        setTimeout(() => update({ feedback: null }), 800)
      }
    } else {
      // Wrong answer — lose a resource
      const next = loseResource(gs)
      if (next.phase === 'lose') {
        setGs({ ...gs, ...next, feedback: 'wrong', totalAnswered: totalAnswered + 1 })
      } else {
        setGs({ ...gs, ...next, feedback: 'wrong', answer: '', hint: question.hint, totalAnswered: totalAnswered + 1 })
        setTimeout(() => update({ feedback: null }), 800)
      }
    }
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
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌲</div>
            <h2>The Mysterious Village</h2>
            <p className="question">
              You are lost in a forest maze. Solve every challenge to escape.
              Each wrong answer costs you a resource. Lose them all — game over.
            </p>
            <div style={{ margin: '1.5rem 0' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Your resources:</div>
              <div className="game-resources">
                {RESOURCES.map(r => <span key={r} className="resource-chip">{r}</span>)}
              </div>
            </div>
            <Button onClick={startGame}>Start Adventure →</Button>
          </div>
        )}

        {/* ── Stage (riddle / puzzle / quiz) ── */}
        {gs.phase === 'stage' && stage && (
          <div className="game-stage">
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>

            <div className="score-bar">
              <div className="score-item"><div className="num">{gs.score}</div><div className="lbl">Score</div></div>
              <div className="score-item"><div className="num">{gs.resources.length}</div><div className="lbl">Resources</div></div>
              <div className="score-item"><div className="num">{gs.hintsLeft}</div><div className="lbl">Hints</div></div>
            </div>

            <span className="badge badge-accent">{stage.title}</span>
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{stage.intro}</p>
            <p className="question">❓ {gs.question.q}</p>

            {gs.hint && (
              <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, padding: '0.6rem 1rem', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--warning)' }}>
                💡 Hint: {gs.hint}
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
              <Button variant="secondary" onClick={() => {
                if (gs.hintsLeft > 0) update({ hint: gs.question.hint, hintsLeft: gs.hintsLeft - 1 })
              }} disabled={gs.hintsLeft === 0}>
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
          <div className="game-stage">
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            <span className="badge badge-warning">{IMPOSTER_STAGE.title}</span>
            <p className="question">
              You reach the camp. Two officers give conflicting advice — but one is an imposter.
              Choose wisely.
            </p>
            <div className="game-choices">
              {IMPOSTER_STAGE.choices.map((c, i) => (
                <button key={i} className="game-choice" onClick={() => handleImposterChoice(c.outcome)}>
                  {i + 1}. {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Final choice ── */}
        {gs.phase === 'final' && (
          <div className="game-stage">
            <p className="question">Something feels wrong deep in the forest. What will you do?</p>
            <div className="game-choices">
              <button className="game-choice" onClick={() => handleFinalChoice('fight')}>⚔️ Fight the imposters</button>
              <button className="game-choice" onClick={() => handleFinalChoice('escape')}>🏃 Try to escape</button>
            </div>
          </div>
        )}

        {/* ── Monster challenge ── */}
        {gs.phase === 'monster' && gs.question && (
          <div className="game-stage">
            <p style={{ color: 'var(--warning)', marginBottom: '1rem' }}>🐉 A monster lurks! Solve this to hide:</p>
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
          <div className="game-stage">
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ color: 'var(--success)' }}>You Escaped!</h2>
            <p className="question">You survived the Mysterious Village and made it out safely.</p>
            <div className="score-bar" style={{ marginTop: '1.5rem' }}>
              <div className="score-item"><div className="num">{gs.score}</div><div className="lbl">Final Score</div></div>
              <div className="score-item"><div className="num">{gs.resources.length}</div><div className="lbl">Resources Left</div></div>
            </div>
            <Button onClick={restart} style={{ marginTop: '1.5rem' }}>Play Again</Button>
          </div>
        )}

        {/* ── Lose ── */}
        {gs.phase === 'lose' && (
          <div className="game-stage">
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>💀</div>
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
