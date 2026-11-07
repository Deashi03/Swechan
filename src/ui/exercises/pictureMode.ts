import type { ExerciseType } from '../../learning/exercises/types';

/**
 * How the prompt picture of a choice exercise is shown (product owner 0.16): in "which word fits the
 * picture?" an animation tied to the word plays once and returns to its poster frame (▶ replays it). Still pictures, symbols
 * and every other exercise show the still frame.
 */
export function pictureMode(type: ExerciseType): 'once' | 'still' {
  return type === 'image_choice' ? 'once' : 'still';
}
