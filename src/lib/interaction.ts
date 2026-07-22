/*
 * Shared mutable interaction state, read inside the R3F frame loop.
 * Deliberately NOT React state: pointer and scroll values change every
 * frame and must never re-render the React tree (see useFrame consumers).
 */
export const interaction = {
  /** Normalized pointer position, -1..1 (0 at viewport center). */
  pointerX: 0,
  pointerY: 0,
  /** Page scroll progress 0..1, written by the Lenis scroll handler. */
  progress: 0,
};
