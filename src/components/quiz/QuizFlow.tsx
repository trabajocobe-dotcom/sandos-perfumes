'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react'
import { ProductImage } from '@/components/ui/ProductImage'
import { Rating } from '@/components/ui/Rating'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/components/ui/Toast'
import { GENDER_QUESTION, QUIZ, scoreQuiz, type QuizAnswers, type QuizResult } from '@/lib/quiz'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Gender } from '@/types'

const TOTAL_STEPS = QUIZ.length + 1

export function QuizFlow() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [results, setResults] = useState<QuizResult[] | null>(null)

  const progress = results ? 1 : step / TOTAL_STEPS

  const answer = (id: keyof QuizAnswers, value: string) => {
    const next = { ...answers, [id]: value }
    setAnswers(next)

    if (step + 1 >= TOTAL_STEPS) setResults(scoreQuiz(next))
    else setStep(step + 1)
  }

  const restart = () => {
    setAnswers({})
    setResults(null)
    setStep(0)
  }

  if (results) return <QuizResults results={results} onRestart={restart} />

  const isGenderStep = step === QUIZ.length
  const question = QUIZ[step]

  return (
    <div className="mx-auto max-w-[42rem]">
      {/* Progreso: saber cuánto falta es lo que sostiene la tasa de finalización */}
      <div className="flex items-center gap-4">
        <div
          className="h-[2px] flex-1 bg-ink-line"
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progreso del test"
        >
          <div
            className="h-full bg-gilt transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="tnum text-[13px] text-bone-3">
          {step + 1}/{TOTAL_STEPS}
        </span>
      </div>

      <div key={step} className="animate-rise mt-12">
        <p className="overline overline-gilt">
          {isGenderStep ? `Última pregunta` : question.overline}
        </p>

        <h2 className="mt-4 text-h1">
          {isGenderStep ? '¿Qué fragancias quieres ver?' : question.question}
        </h2>

        <div className="mt-10 grid gap-3">
          {isGenderStep
            ? GENDER_QUESTION.map((option) => (
                <OptionButton
                  key={option.value}
                  label={option.label}
                  onClick={() => answer('genero', option.value as Gender)}
                />
              ))
            : question.options.map((option) => (
                <OptionButton
                  key={option.value}
                  label={option.label}
                  hint={option.hint}
                  onClick={() => answer(question.id as keyof QuizAnswers, option.value)}
                />
              ))}
        </div>

        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="link-editorial mt-10 inline-flex items-center gap-2 text-[14px] text-bone-3"
          >
            <ArrowLeft className="size-3.5" />
            Volver
          </button>
        )}
      </div>
    </div>
  )
}

function OptionButton({
  label,
  hint,
  onClick,
}: {
  label: string
  hint?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex items-center justify-between gap-6 rounded-brand border border-ink-line px-6 py-5 text-left',
        'transition-[colors,scale] duration-300 hover:border-gilt hover:bg-gilt/[0.05]',
        // Hundido apenas perceptible: en una tarjeta de este tamaño el 0.97 de
        // los botones chicos se ve como un salto.
        'active:scale-[0.99] motion-reduce:active:scale-100'
      )}
    >
      <span>
        <span className="block font-display text-[1.125rem] leading-snug">{label}</span>
        {hint && <span className="mt-1 block text-[14px] text-bone-3">{hint}</span>}
      </span>
      <ArrowRight className="size-4 shrink-0 text-bone-3 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gilt" />
    </button>
  )
}

function QuizResults({
  results,
  onRestart,
}: {
  results: QuizResult[]
  onRestart: () => void
}) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const addAllSamples = () => {
    const withSample = results.filter((r) => r.product.sample_available)
    withSample.forEach((r) => addItem(r.product, 1, { sample: true }))
    toast(`${withSample.length} muestras agregadas al carrito`)
  }

  const samplesTotal = results
    .filter((r) => r.product.sample_available)
    .reduce((sum, r) => sum + (r.product.sample_price ?? 0), 0)

  return (
    <div className="animate-rise">
      <div className="mx-auto max-w-[42rem] text-center">
        <p className="overline overline-gilt">Tu perfil olfativo</p>
        <h2 className="mt-4 text-h1">
          Estas tres son <span className="accent-word">para ti</span>
        </h2>
        <p className="mx-auto mt-5 max-w-[34rem] text-[16px] leading-[1.8] text-bone-2">
          Debajo de cada una te explicamos por qué salió elegida. Si quieres estar seguro antes de
          gastar el frasco, lleva las tres muestras de 2 ml.
        </p>
      </div>

      <ol className="mt-14 space-y-px border border-ink-line bg-ink-line">
        {results.map((result, index) => (
          <li key={result.product.id} className="bg-ink">
            <div className="grid gap-6 p-6 sm:grid-cols-[10rem_1fr] sm:gap-8 sm:p-8">
              <Link
                href={`/producto/${result.product.slug}`}
                className="group relative aspect-square overflow-hidden bg-ink-raised"
              >
                <ProductImage
                  src={result.product.image_url}
                  alt={result.product.name}
                  sizes="160px"
                />
              </Link>

              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <p className="overline">
                      Opción {index + 1} · {result.product.house}
                    </p>
                    <h3 className="mt-1.5 font-display text-h3">
                      <Link
                        href={`/producto/${result.product.slug}`}
                        className="transition-colors hover:text-gilt"
                      >
                        {result.product.name}
                      </Link>
                    </h3>
                  </div>
                  <p className="tnum font-display text-[1.25rem] text-gilt">
                    {formatCurrency(result.product.price)}
                  </p>
                </div>

                <div className="mt-3">
                  <Rating value={result.product.rating} count={result.product.review_count} />
                </div>

                <ul className="mt-5 space-y-2">
                  {result.reasons.map((reason) => (
                    <li
                      key={reason}
                      className="flex items-start gap-2.5 text-[14px] text-bone-2"
                    >
                      <Check className="mt-0.5 size-3.5 shrink-0 text-gilt" strokeWidth={2.5} />
                      {reason}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Link
                    href={`/producto/${result.product.slug}`}
                    className="btn btn-quiet btn-sm"
                  >
                    Ver la ficha
                  </Link>
                  {result.product.sample_available && (
                    <button
                      type="button"
                      onClick={() => {
                        addItem(result.product, 1, { sample: true })
                        toast(`Muestra de ${result.product.name} agregada`)
                      }}
                      className="btn btn-outline btn-sm"
                    >
                      Muestra {formatCurrency(result.product.sample_price ?? 0)}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        {samplesTotal > 0 && (
          <button type="button" onClick={addAllSamples} className="btn btn-primary btn-lg">
            Llevar las 3 muestras — {formatCurrency(samplesTotal)}
          </button>
        )}
        <button type="button" onClick={onRestart} className="btn btn-quiet btn-lg">
          <RotateCcw className="size-4" strokeWidth={1.5} />
          Rehacer el test
        </button>
      </div>
    </div>
  )
}
