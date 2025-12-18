export function useOnClickOutside(
    ref: React.RefObject<HTMLElement | null>,
    handler: (event: MouseEvent | TouchEvent) => void
) {
    if (typeof window !== 'undefined') {
        const listener = (event: MouseEvent | TouchEvent) => {
            // Do nothing if clicking ref's element or descendent elements
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return
            }
            handler(event)
        }

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { useEffect } = require('react')

        useEffect(() => {
            document.addEventListener('mousedown', listener)
            document.addEventListener('touchstart', listener)
            return () => {
                document.removeEventListener('mousedown', listener)
                document.removeEventListener('touchstart', listener)
            }
        }, [ref, handler])
    }
}
