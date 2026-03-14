import { useState } from 'react'
import Button from '../components/Button'

const RESOURCES = ['🔫 Gun', '👮 Officer', '📻 Radio', '🗺️ Map']

const STAGES = [
  {
    id: 'riddle', title: 'Stage 1 — Riddle', emoji: '🔮',
    color: '#6366f1', bg: '#eef2ff', intro: 'Solve the riddle to move forward.',
    questions: [
      { q: 'What room can no one enter?',                           a: 'mushroom', hints: ['It grows in the ground.', "It's a type of fungus.", 'Think: mush + room.'] },
      { q: 'I can be cracked, made, told, and played. What am I?',  a: 'joke',     hints: ['People do this to make others laugh.', 'Comedians tell these.', "It's a one-liner."] },
      { q: 'I have a spine but no bones. What am I?',               a: 'book',     hints: ['You read it.', 'You find it in a library.', 'It has pages and a cover.'] },
    ],
  },
  {
    id: 'puzzle', title: 'Stage 2 — Puzzle', emoji: '🧩',
    color: '#14b8a6', bg: '#f0fdfa', intro: 'Solve the puzzle to continue.',
    questions: [
      { q: 'Full of holes but still holds water?',                   a: 'sponge', hints: ['You use it to wash dishes.', 'It absorbs liquid.', 'Think: kitchen cleaning tool.'] },
      { q: 'Light as a feather, yet no one can hold it for a minute?', a: 'breath', hints: ['You do it every second.', 'It keeps you alive.', 'Inhale... exhale...'] },
      { q: 'Has a head, a tail, is brown, and has no legs?',          a: 'penny',  hints: ["It's worth very little.", "It's a coin.", 'One cent.'] },
    ],
  },
  {
    id: 'quiz', title: 'Stage 3 — Quiz', emoji: '👻',
    color: '#ec4899', bg: '#fdf2f8', intro: 'Answer the spooky quiz question.',
    questions: [
      { q: 'What do ghosts eat for dinner?',                   a: 'spooketti',  hints: ["It's a food.", 'Sounds like a pasta dish.', 'Spaghetti... but spooky.'] },
      { q: "What is a witch's favourite subject in school?",   a: 'spelling',   hints: ["It's a school subject.", 'Witches cast these.', 'S-P-E-L-L-I-N-G.'] },
      { q: "What is a monster's favourite dessert?",           a: 'ice scream', hints: ["It's cold.", 'Sounds like a frightened reaction.', 'Ice... scream.'] },
    ],
  },
]

const MONSTER_CHALLENGES = [
  { q: 'What do you call a ghost that tells good jokes?', a: 'boogie man',            hint: 'It boogies.' },
  { q: 'What kind of music do mummies listen to?',        a: 'rap',                   hint: 'They like to wrap things.' },
  { q: 'Why did the vampire need mouthwash?',             a: 'because he had bad breath', hint: 'Think about what vampires drink.' },
]

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)] }

function initState() {
  return {
    phase: 'intro', stageIdx: 0, question: null,
    resources: [...RESOURCES], hintsLeft: 3, hintIdx: 0,
    score: 0, answer: '', feedback: null, shownHints: [], totalAnswered: 0,
  }
}

export default function Game() {
  const [gs, setGs] = useState(initState)
  const update = (patch) => setGs(prev => ({ ...prev, ...patch }))

  const startGame = () => {
    const q = pickRandom(STAGES[0].questions)
    update({ phase: 'stage', stageIdx: 0, question: q, answer: '', feedback: null, shownHints: [], hintIdx: 0 })
  }

  const loseResource = (state) => {
    const next = state.resources.slice(1)
    return next.length === 0
      ? { ...state, resources: next, phase: 'lose' }
      : { ...state, resources: next }
  }

  const handleAnswer = () => {
    const { answer, question, stageIdx, score, totalAnswered } = gs
    const correct = answer.trim().toLowerCase() === question.a
    if (correct) {
      const newScore = score + 10
      const next = stageIdx + 1
      if (next < STAGES.length) {
        const nextQ = pickRandom(STAGES[next].questions)
        update({ score: newScore, stageIdx: next, question: nextQ, answer: '', feedback: 'correct', shownHints: [], hintIdx: 0, totalAnswered: totalAnswered + 1 })
      } else {
        update({ score: newScore, phase: 'imposter', answer: '', feedback: 'correct', shownHints: [], hintIdx: 0, totalAnswered: totalAnswered + 1 })
      }
      setTimeout(() => update({ feedback: null }), 700)
    } else {
      const next = loseResource(gs)
      setGs({ ...gs, ...next, feedback: 'wrong', answer: '', totalAnswered: totalAnswered + 1 })
      setTimeout(() => setGs(p => ({ ...p, feedback: null })), 700)
    }
  }

  const handleUseHint = () => {
    const { hintsLeft, hintIdx, question, shownHints } = gs
    if (hintsLeft === 0) return
    const h = question.hints[hintIdx % question.hints.length]
    update({ hintsLeft: hintsLeft - 1, hintIdx: hintIdx + 1, shownHints: [...shownHints, h] })
  }

  const handleImposterChoice = (outcome) => {
    outcome === 'good'
      ? update({ phase: 'win', score: gs.score + 20 })
      : update({ phase: 'final' })
  }

  const handleFinalChoice = (action) => {
    if (action === 'fight') {
      const win = Math.random() > 0.4
      update({ phase: win ? 'win' : 'lose', score: win ? gs.score + 15 : gs.score })
    } else {
      update({ phase: 'monster', question: pickRandom(MONSTER_CHALLENGES), answer: '', feedback: null })
    }
  }

  const handleMonsterAnswer = () => {
    const correct = gs.answer.trim().toLowerCase() === gs.question.a
    if (correct) {
      update({ phase: 'win', score: gs.score + 25 })
    } else {
      const next = loseResource(gs)
      setGs({ ...gs, ...next, answer: '', feedback: 'wrong' })
      setTimeout(() => setGs(p => ({ ...p, feedback: null })), 700)
    }
  }

  const restart = () => setGs(initState())

  const stage = STAGES[gs.stageIdx]
  const totalStages = STAGES.length + 1
  const progressPct =
    gs.phase === 'stage'    ? (gs.stageIdx / totalStages) * 100 :
    gs.phase === 'imposter' ? (STAGES.length / totalStages) * 100 :
    gs.phase === 'win' || gs.phase === 'lose' ? 100 : 0

  // ── Sidebar panel (always visible during game) ──
  const showSidebar = gs.phase !== 'intro'

  return (
    <div className="page">
      <div className="page-header">
        <h1>🏚️ Mystery Village Game</h1>
        <p>Solve riddles and puzzles to escape the forest. Every wrong answer costs a resource.</p>
      </div>

      {gs.phase === 'intro' ? (
        /* ── Intro screen ── */
        <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
          <div className="game-intro">
            <div className="game-intro-scene">🌲🏚️🌲</div>
            <div className="game-intro-stars">🌙 ⭐ 🌙</div>
            <h2 style={{ marginBottom: '0.75rem' }}>The Mysterious Village</h2>
            <p style={{ maxWidth: 420, margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
              You are lost in a forest maze. Solve every challenge to escape.
              Each wrong answer costs you a resource. Lose them all — game over.
            </p>
            <div className="game-stages-flow">
              {STAGES.map((s, i) => (
                <>
                  <span key={s.id} className="game-stage-pill" style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}33` }}>
                    {s.emoji} {s.title.split('—')[1]?.trim()}
                  </span>
                  {i < STAGES.length - 1 && <span key={`arr-${i}`} className="game-stage-arrow">→</span>}
                </>
              ))}
              <span className="game-stage-arrow">→</span>
              <span className="game-stage-pill" style={{ background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }}>👥 Imposter</span>
            </div>
            <div style={{ margin: '1.25rem 0', padding: '1rem', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Starting Resources</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {RESOURCES.map(r => (
                  <span key={r} style={{ padding: '0.3rem 0.75rem', background: 'var(--success-soft)', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: 999, fontSize: '0.82rem', fontWeight: 500 }}>{r}</span>
                ))}
              </div>
            </div>
            <Button variant="primary" size="lg" onClick={startGame}>Start Adventure →</Button>
          </div>
        </div>
      ) : (
        /* ── Game layout with sidebar ── */
        <div className="game-layout">

          {/* Left: Player panel */}
          <div className="game-sidebar-panel">
            <div className="game-player-avatar">🕵️</div>
            <div className="game-player-name">Officer Mosin</div>
            <div className="game-player-role">Forest Investigator</div>

            <div className="game-stat-row">
              <div className="game-stat">
                <span className="game-stat-label">⭐ Score</span>
                <span className="game-stat-value">{gs.score}</span>
              </div>
              <div className="game-stat">
                <span className="game-stat-label">💡 Hints Left</span>
                <span className="game-stat-value" style={{ color: gs.hintsLeft === 0 ? 'var(--danger)' : 'var(--primary)' }}>{gs.hintsLeft}</span>
              </div>
              <div className="game-stat">
                <span className="game-stat-label">🎯 Answered</span>
                <span className="game-stat-value">{gs.totalAnswered}</span>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Resources</div>
              <div className="game-resources-list">
                {RESOURCES.map(r => (
                  <div key={r} className={`resource-row${gs.resources.includes(r) ? '' : ' lost'}`}>
                    <span>{gs.resources.includes(r) ? '✓' : '✗'}</span>
                    {r}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={restart}
              style={{ marginTop: '1.25rem', width: '100%', padding: '0.5rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all var(--transition)' }}
              onMouseOver={e => e.target.style.color = 'var(--danger)'}
              onMouseOut={e => e.target.style.color = 'var(--text-muted)'}
            >
              ↺ Restart Game
            </button>
          </div>

          {/* Right: Main stage */}
          <div className={`game-main-panel${gs.feedback === 'correct' ? ' game-feedback-correct' : gs.feedback === 'wrong' ? ' game-feedback-wrong' : ''}`}>

            {/* Progress bar */}
            <div style={{ padding: '1rem 1.5rem 0' }}>
              <div className="game-progress-wrap">
                <div className="game-progress-label">
                  <span>Progress</span>
                  <span>{Math.round(progressPct)}%</span>
                </div>
                <div className="game-progress-bar">
                  <div className="game-progress-fill" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            </div>

            {/* ── Active stage ── */}
            {gs.phase === 'stage' && stage && (
              <>
                <div className="game-stage-header">
                  <div className="game-stage-icon" style={{ background: stage.bg, color: stage.color }}>
                    {stage.emoji}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{stage.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{stage.intro}</div>
                  </div>
                  <span className="badge" style={{ marginLeft: 'auto', background: stage.bg, color: stage.color }}>
                    Stage {gs.stageIdx + 1} / {STAGES.length}
                  </span>
                </div>

                <div className="game-stage-body">
                  <div className={`game-question${gs.feedback === 'correct' ? ' game-feedback-correct' : gs.feedback === 'wrong' ? ' game-feedback-wrong' : ''}`}
                    style={{ borderColor: gs.feedback === 'correct' ? 'var(--success)' : gs.feedback === 'wrong' ? 'var(--danger)' : undefined,
                             background: gs.feedback === 'correct' ? 'var(--success-soft)' : gs.feedback === 'wrong' ? 'var(--danger-soft)' : undefined }}>
                    ❓ {gs.question.q}
                  </div>

                  {gs.shownHints.map((h, i) => (
                    <div key={i} className="game-hint-box">
                      <span>💡</span>
                      <span><strong>Hint {i + 1}:</strong> {h}</span>
                    </div>
                  ))}

                  <div className="game-answer-row">
                    <input
                      className="input"
                      placeholder="Type your answer and press Enter..."
                      value={gs.answer}
                      onChange={e => update({ answer: e.target.value })}
                      onKeyDown={e => e.key === 'Enter' && handleAnswer()}
                      style={{ borderColor: gs.feedback === 'correct' ? 'var(--success)' : gs.feedback === 'wrong' ? 'var(--danger)' : undefined }}
                    />
                    <Button onClick={handleAnswer}>Submit</Button>
                    <Button variant="secondary" onClick={handleUseHint} disabled={gs.hintsLeft === 0}>
                      💡 {gs.hintsLeft}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* ── Imposter ── */}
            {gs.phase === 'imposter' && (
              <>
                <div className="game-stage-header">
                  <div className="game-stage-icon" style={{ background: '#fffbeb', color: '#d97706' }}>👥</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Stage 4 — The Imposter</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Two officers give conflicting advice. One is an imposter.</div>
                  </div>
                  <span className="badge badge-warning" style={{ marginLeft: 'auto' }}>Final Stage</span>
                </div>
                <div className="game-stage-body">
                  <div style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>👮 🤔 👮</div>
                  <div className="game-question">
                    You reach the camp. Two officers give conflicting advice — but one is an imposter. Choose wisely.
                  </div>
                  <div className="game-choices">
                    <button className="game-choice" onClick={() => handleImposterChoice('bad')}>
                      <span className="game-choice-num">1</span>
                      🌲 Follow Officer A — head deeper into the forest.
                    </button>
                    <button className="game-choice" onClick={() => handleImposterChoice('good')}>
                      <span className="game-choice-num">2</span>
                      🏕️ Follow Officer B — stay near the village and wait for rescue.
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── Final choice ── */}
            {gs.phase === 'final' && (
              <>
                <div className="game-stage-header">
                  <div className="game-stage-icon" style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}>⚔️</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Final Decision</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Something feels wrong deep in the forest.</div>
                  </div>
                </div>
                <div className="game-stage-body">
                  <div style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>🌑 😰 🌑</div>
                  <div className="game-question">Something feels wrong deep in the forest. What will you do?</div>
                  <div className="game-choices">
                    <button className="game-choice" onClick={() => handleFinalChoice('fight')}>
                      <span className="game-choice-num">1</span>
                      ⚔️ Fight the imposters (60% chance of survival)
                    </button>
                    <button className="game-choice" onClick={() => handleFinalChoice('escape')}>
                      <span className="game-choice-num">2</span>
                      🏃 Try to escape into the dark (solve a riddle)
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── Monster ── */}
            {gs.phase === 'monster' && gs.question && (
              <>
                <div className="game-stage-header">
                  <div className="game-stage-icon" style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}>🐉</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Monster Encounter</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Solve this to hide from the monster!</div>
                  </div>
                </div>
                <div className="game-stage-body">
                  <div style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '1rem' }}>🐉</div>
                  <div className="game-question" style={{ borderColor: 'var(--danger)', background: 'var(--danger-soft)' }}>
                    ❓ {gs.question.q}
                  </div>
                  <div className="game-hint-box">
                    <span>💡</span><span><strong>Hint:</strong> {gs.question.hint}</span>
                  </div>
                  <div className="game-answer-row" style={{ marginTop: '1rem' }}>
                    <input
                      className="input"
                      placeholder="Your answer..."
                      value={gs.answer}
                      onChange={e => update({ answer: e.target.value })}
                      onKeyDown={e => e.key === 'Enter' && handleMonsterAnswer()}
                      style={{ borderColor: gs.feedback === 'wrong' ? 'var(--danger)' : undefined }}
                    />
                    <Button onClick={handleMonsterAnswer}>Submit</Button>
                  </div>
                </div>
              </>
            )}

            {/* ── Win ── */}
            {gs.phase === 'win' && (
              <div className="game-result-screen">
                <div className="game-result-icon">🎉</div>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🏆 🌟 🏆</div>
                <h2 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>You Escaped!</h2>
                <p>You survived the Mysterious Village and made it out safely. Well done!</p>
                <div className="game-score-grid">
                  <div className="game-score-box">
                    <div className="num">{gs.score}</div>
                    <div className="lbl">Final Score</div>
                  </div>
                  <div className="game-score-box">
                    <div className="num">{gs.resources.length}</div>
                    <div className="lbl">Resources Left</div>
                  </div>
                  <div className="game-score-box">
                    <div className="num">{gs.totalAnswered}</div>
                    <div className="lbl">Answered</div>
                  </div>
                </div>
                <Button variant="success" onClick={restart}>Play Again</Button>
              </div>
            )}

            {/* ── Lose ── */}
            {gs.phase === 'lose' && (
              <div className="game-result-screen">
                <div className="game-result-icon">💀</div>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🌲 ☠️ 🌲</div>
                <h2 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>Game Over</h2>
                <p>You lost all your resources. The forest claimed you.</p>
                <div className="game-score-grid">
                  <div className="game-score-box">
                    <div className="num">{gs.score}</div>
                    <div className="lbl">Final Score</div>
                  </div>
                  <div className="game-score-box">
                    <div className="num">{gs.totalAnswered}</div>
                    <div className="lbl">Answered</div>
                  </div>
                </div>
                <Button variant="danger" onClick={restart}>Try Again</Button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}
