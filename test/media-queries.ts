import { vi } from 'vitest'

type MediaState = {
  width: number
  orientation: 'portrait' | 'landscape'
  hover: 'none' | 'hover'
  colorScheme: 'light' | 'dark'
  contrast: 'no-preference' | 'more' | 'less' | 'custom'
  reducedMotion: 'no-preference' | 'reduce'
}

const defaults: MediaState = {
  width: 1024,
  orientation: 'landscape',
  hover: 'hover',
  colorScheme: 'light',
  contrast: 'no-preference',
  reducedMotion: 'no-preference'
}

function evaluate(query: string, state: MediaState): boolean {
  if (!query) return true
  const width = /^\((min|max)-width: ([\d.]+)px\)$/.exec(query)
  if (width) {
    return width[1] === 'min'
      ? state.width >= Number(width[2])
      : state.width <= Number(width[2])
  }
  const features: Record<string, string> = {
    orientation: state.orientation,
    hover: state.hover,
    'prefers-color-scheme': state.colorScheme,
    'prefers-contrast': state.contrast,
    'prefers-reduced-motion': state.reducedMotion
  }
  const feature = /^\(([\w-]+): ([\w-]+)\)$/.exec(query)
  if (feature && Object.hasOwn(features, feature[1])) {
    return features[feature[1]] === feature[2]
  }
  throw new Error(`Unsupported media query in test adapter: ${query}`)
}

class TestMediaQueryList extends EventTarget implements MediaQueryList {
  onchange: MediaQueryList['onchange'] = null
  private readonly changeListeners =
    new Set<EventListenerOrEventListenerObject>()

  constructor(
    readonly media: string,
    public matches: boolean
  ) {
    super()
  }

  get listenerCount() {
    return this.changeListeners.size
  }

  override addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions
  ) {
    super.addEventListener(type, listener, options)
    if (type === 'change' && listener) this.changeListeners.add(listener)
  }

  override removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions
  ) {
    super.removeEventListener(type, listener, options)
    if (type === 'change' && listener) this.changeListeners.delete(listener)
  }

  addListener(listener: Parameters<MediaQueryList['addListener']>[0]) {
    this.addEventListener('change', listener as EventListener | null)
  }

  removeListener(listener: Parameters<MediaQueryList['removeListener']>[0]) {
    this.removeEventListener('change', listener as EventListener | null)
  }

  notify() {
    const event = Object.assign(new Event('change'), {
      matches: this.matches,
      media: this.media
    }) as MediaQueryListEvent
    this.dispatchEvent(event)
    this.onchange?.call(this, event)
  }
}

/** Models the plugin's queries, updating every value before dispatching changes. */
export function createMediaQueries(initial: Partial<MediaState> = {}) {
  let state = { ...defaults, ...initial }
  const lists: TestMediaQueryList[] = []
  return {
    matchMedia: vi.fn((query: string): MediaQueryList => {
      const list = new TestMediaQueryList(query, evaluate(query, state))
      lists.push(list)
      return list
    }),
    update(patch: Partial<MediaState>) {
      state = { ...state, ...patch }
      const changed = lists.filter((list) => {
        const next = evaluate(list.media, state)
        if (next === list.matches) return false
        list.matches = next
        return true
      })
      changed.forEach((list) => list.notify())
    },
    get listenerCount() {
      return lists.reduce((count, list) => count + list.listenerCount, 0)
    }
  }
}
