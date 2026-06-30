'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { hexToHsl, hslToHex, normalizeHex } from '@lp-studio/tokens'

type ColorPickerPopoverProps = {
  hex: string
  onChange: (hex: string) => void
  onClose: () => void
  anchorRef: React.RefObject<HTMLElement | null>
}

type EyeDropperResult = { sRGBHex: string }

declare global {
  interface Window {
    EyeDropper?: new () => { open: () => Promise<EyeDropperResult> }
  }
}

export function ColorPickerPopover({ hex, onChange, onClose, anchorRef }: ColorPickerPopoverProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const svRef = useRef<HTMLDivElement>(null)
  const initial = hexToHsl(normalizeHex(hex))
  const [hue, setHue] = useState(initial.h)
  const [sat, setSat] = useState(initial.s)
  const [light, setLight] = useState(initial.l)
  const [hexInput, setHexInput] = useState(normalizeHex(hex))
  const [eyedropperOk, setEyedropperOk] = useState(false)

  const currentHex = hslToHex(hue, sat, light)

  const emit = useCallback(
    (h: number, s: number, l: number) => {
      const next = hslToHex(h, s, l)
      setHexInput(next)
      onChange(next)
    },
    [onChange],
  )

  useEffect(() => {
    setEyedropperOk(typeof window !== 'undefined' && 'EyeDropper' in window)
  }, [])

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (panelRef.current?.contains(target)) return
      if (anchorRef.current?.contains(target)) return
      onClose()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [anchorRef, onClose])

  const pickSv = (clientX: number, clientY: number) => {
    const el = svRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width)
    const y = Math.min(Math.max(clientY - rect.top, 0), rect.height)
    const nextS = (x / rect.width) * 100
    const nextL = 100 - (y / rect.height) * 100
    setSat(nextS)
    setLight(nextL)
    emit(hue, nextS, nextL)
  }

  const onSvPointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    pickSv(e.clientX, e.clientY)
    const onMove = (ev: PointerEvent) => pickSv(ev.clientX, ev.clientY)
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const onHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextH = Number(e.target.value)
    setHue(nextH)
    emit(nextH, sat, light)
  }

  const syncFromHex = (value: string) => {
    const normalized = normalizeHex(value)
    const hsl = hexToHsl(normalized)
    setHue(hsl.h)
    setSat(hsl.s)
    setLight(hsl.l)
    setHexInput(normalized)
    onChange(normalized)
  }

  const onHexBlur = () => {
    syncFromHex(hexInput)
  }

  const onEyedropper = async () => {
    if (!window.EyeDropper) return
    try {
      const dropper = new window.EyeDropper()
      const result = await dropper.open()
      syncFromHex(result.sRGBHex)
    } catch {
      /* user cancelled */
    }
  }

  const svX = `${sat}%`
  const svY = `${100 - light}%`

  return (
    <div
      ref={panelRef}
      className="absolute left-0 top-full z-50 mt-2 w-[240px] rounded-xl border border-gray-200 bg-white p-3 shadow-xl"
      role="dialog"
      aria-label="Couleur personnalisée"
    >
      <div
        ref={svRef}
        className="relative h-36 w-full cursor-crosshair overflow-hidden rounded-lg border border-black/10"
        style={{
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hue} 100% 50%))`,
        }}
        onPointerDown={onSvPointerDown}
      >
        <div
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md ring-1 ring-black/20"
          style={{ left: svX, top: svY, backgroundColor: currentHex }}
        />
      </div>

      <div className="mt-3 flex items-center gap-2">
        {eyedropperOk ? (
          <button
            type="button"
            onClick={onEyedropper}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-[#1A3066] hover:bg-gray-50"
            title="Pipette — choisir une couleur à l'écran"
            aria-label="Pipette"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M20.71 5.63l-2.34-2.34a1 1 0 0 0-1.41 0l-2.34 2.34a1 1 0 0 0 0 1.41l3.12-3.12 1.91 1.91a1 1 0 0 0 1.41 0l1.5-1.5a1 1 0 0 0 0-1.41l-1.91-1.91 3.12-3.12a1 1 0 0 0 0-1.41zM7 17l-1.5 1.5L3 16l1.5-1.5L7 17z" />
            </svg>
          </button>
        ) : null}
        <div className="relative min-w-0 flex-1">
          <input
            type="range"
            min={0}
            max={360}
            value={Math.round(hue)}
            onChange={onHueChange}
            className="h-3 w-full cursor-pointer appearance-none rounded-full"
            style={{
              background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
            }}
            aria-label="Teinte"
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span
          className="h-9 w-9 shrink-0 rounded-lg border border-black/10 shadow-inner"
          style={{ backgroundColor: currentHex }}
          aria-hidden
        />
        <label className="flex min-w-0 flex-1 items-center gap-1.5 text-xs text-[#5C6B8A]">
          <span className="font-medium">HEX</span>
          <input
            type="text"
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            onBlur={onHexBlur}
            onKeyDown={(e) => e.key === 'Enter' && onHexBlur()}
            className="w-full rounded border border-gray-200 px-2 py-1.5 font-mono text-xs uppercase text-[#1A3066] outline-none focus:border-[#E63946]"
            spellCheck={false}
          />
        </label>
      </div>
    </div>
  )
}
