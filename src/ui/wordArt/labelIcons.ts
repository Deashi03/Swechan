/**
 * Small text-free icons for labels and signs (0.18.1). Pictures must never spell out the answer,
 * so packages, signs and badges carry an icon instead of a word. Each icon is centred on (x, y)
 * and about 12 units tall at s = 1.
 */
import { C, all, circle, ellipse, g, line, path, rect, type Svg } from './kit';

const at = (x: number, y: number, s: number, ...c: Svg[]) => g(`translate(${x} ${y}) scale(${s})`, ...c);
export const wheatIcon = (x: number, y: number, s = 1, col: string = '#c9973a') => at(x, y, s, line('M0 8 L0 -8', col, 1.4), ...[-5, -1, 3].map((d) => all(ellipse(-2.2, d, 2, 1.2, col, null), ellipse(2.2, d, 2, 1.2, col, null))), ellipse(0, -7, 1.4, 2, col, null));
export const berryIcon = (x: number, y: number, s = 1) => at(x, y, s, path('M0 6 C-6 2 -6 -4 0 -3 C6 -4 6 2 0 6 Z', C.red, C.ink, 0.8), path('M-3 -4 L0 -7 L3 -4', 'none', C.green, 1.4), ...[[-2, 0], [2, 0], [0, 3]].map(([a, b]) => circle(a!, b!, 0.5, '#f6e08a', null)));
export const fishIcon = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, path('M-8 0 C-4 -5 4 -5 6 0 C4 5 -4 5 -8 0 Z M6 0 L10 -4 L10 4 Z', col, null), circle(-4, -1, 0.9, C.ink, null));
export const seedsIcon = (x: number, y: number, s = 1, col: string = '#8a5a2a') => at(x, y, s, ...[[-4, -2], [0, -4], [4, -2], [-2, 2], [3, 3]].map(([a, b]) => ellipse(a!, b!, 1.8, 1.1, col, null)));
export const cakeIcon = (x: number, y: number, s = 1) => at(x, y, s, rect(-7, -1, 14, 7, '#f6c0d0', 1, C.ink, 0.8), rect(-7, -4, 14, 3, C.white, 1, C.ink, 0.8), circle(0, -6, 1.6, C.red, null));
export const mugIcon = (x: number, y: number, s = 1) => at(x, y, s, rect(-5, -6, 10, 12, '#f2c14e', 1, C.white, 1), path('M5 -3 C9 -3 9 3 5 3', 'none', C.white, 1.4), rect(-5, -7, 10, 3, C.white, 1, null));
export const fragileIcon = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, path('M-5 -7 L5 -7 C5 0 2 2 0 2 C-2 2 -5 0 -5 -7 Z', 'none', col, 1.4), line('M0 2 L0 7 M-3 7 L3 7', col, 1.4), path('M-1 -7 L1 -4 L-1 -2', 'none', col, 1));
export const shieldIcon = (x: number, y: number, s = 1, col: string = C.navy) => at(x, y, s, path('M-6 -7 L6 -7 L6 -1 C6 4 0 7 0 7 C0 7 -6 4 -6 -1 Z', col, null), path('M-3 -1 l2 2 l4 -4', 'none', C.white, 1.4));
export const houseIcon = (x: number, y: number, s = 1, col: string = C.navy) => at(x, y, s, path('M-7 0 L0 -6 L7 0 Z', col, null), rect(-5, 0, 10, 7, col, 0, null), rect(-1.5, 3, 3, 4, C.white, 0, null));
export const boxIcon = (x: number, y: number, s = 1) => at(x, y, s, rect(-7, -5, 14, 11, C.tan, 1, C.ink, 0.8), line('M-7 -2 L7 -2 M0 -5 L0 -2', '#a0673d', 0.8));
export const starIcon = (x: number, y: number, s = 1, col: string = C.yellow) => at(x, y, s, path('M0 -7 L2 -2 L7 -2 L3 1 L4.5 6 L0 3 L-4.5 6 L-3 1 L-7 -2 L-2 -2 Z', col, null));
export const bookIcon = (x: number, y: number, s = 1, col: string = C.navy) => at(x, y, s, path('M0 -4 C-3 -6 -6 -6 -8 -5 L-8 5 C-6 4 -3 4 0 6 C3 4 6 4 8 5 L8 -5 C6 -6 3 -6 0 -4 Z', C.white, col, 1.2), line('M0 -4 L0 6', col, 1));
export const wineIcon = (x: number, y: number, s = 1, col: string = '#4a1a24') => at(x, y, s, path('M-4 -7 L4 -7 C4 -1 2 0 0 0 C-2 0 -4 -1 -4 -7 Z', col, null), line('M0 0 L0 6 M-3 6 L3 6', col, 1.4));
export const flameIcon = (x: number, y: number, s = 1, col: string = C.orange) => at(x, y, s, path('M0 -8 C4 -3 6 0 5 3 C4 7 -4 7 -5 3 C-6 0 -3 -2 -2 -5 C-1 -2 0 -2 0 -8 Z', col, null), path('M0 0 C2 2 2 4 0 5 C-2 4 -2 2 0 0 Z', C.yellow, null));
export const bikeIcon = (x: number, y: number, s = 1, col: string = C.navy) => at(x, y, s, circle(-6, 3, 4, 'none', col, 1.4), circle(6, 3, 4, 'none', col, 1.4), path('M-6 3 L-2 -3 L4 -3 L6 3 M-2 -3 L0 3 L4 -3', 'none', col, 1.2));
export const capIcon = (x: number, y: number, s = 1, col: string = C.navy) => at(x, y, s, path('M-9 -2 L0 -6 L9 -2 L0 2 Z', col, null), path('M-5 0 L-5 4 C-2 6 2 6 5 4 L5 0', col, null), line('M8 -2 L8 4', col, 1));
export const childIcon = (x: number, y: number, s = 1, col: string = '#e4572e') => at(x, y, s, circle(0, -3, 4, C.skin, C.ink, 0.8), path('M-5 7 C-5 2 5 2 5 7 Z', col, null));
export const enterIcon = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, rect(1, -7, 7, 14, 'none', 0.5, col, 1.4), path('M-8 0 L0 0 M-3 -4 L1 0 L-3 4', 'none', col, 1.6));
export const washerIcon = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, rect(-6, -7, 12, 14, 'none', 2, col, 1.2), circle(0, 1, 3.6, 'none', col, 1.2), line('M-4 -4 L-1 -4', col, 1));
export const heartIcon = (x: number, y: number, s = 1, col: string = C.red) => at(x, y, s, path('M0 6 C-9 0 -6 -8 0 -3 C6 -8 9 0 0 6 Z', col, null));
export const checkIcon = (x: number, y: number, s = 1, col: string = C.green) => at(x, y, s, path('M-6 0 L-2 4 L6 -5', 'none', col, 2.4));
export const leafIcon = (x: number, y: number, s = 1, col: string = C.green) => at(x, y, s, path('M-6 6 C-6 -4 0 -7 7 -7 C7 1 2 6 -6 6 Z', col, null), line('M-6 6 L3 -3', C.white, 0.8));
export const forkKnifeIcon = (x: number, y: number, s = 1, col: string = C.white) => at(x, y, s, line('M-3 -7 L-3 7 M-5 -7 L-5 -3 C-5 -1 -1 -1 -1 -3 L-1 -7 M4 7 L4 -7 C7 -5 7 0 4 0', col, 1.2));
export const nutIcon = (x: number, y: number, s = 1) => at(x, y, s, path('M0 -6 C5 -6 7 -1 6 2 C5 6 2 7 0 7 C-2 7 -5 6 -6 2 C-7 -1 -5 -6 0 -6 Z', '#c9973a', C.ink, 0.8), path('M-4 -1 C-1 -3 1 -3 4 -1', 'none', '#8a5a2a', 0.8));
export const yeastIcon = (x: number, y: number, s = 1) => at(x, y, s, ...[[-3, 1, 3], [3, -1, 2.4], [0, -4, 1.8], [4, 4, 1.6]].map(([a, b, r]) => circle(a!, b!, r!, 'none', '#c9a040', 1)));
