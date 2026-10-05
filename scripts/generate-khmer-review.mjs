/**
 * Builds khmer-translation-review.json for fractions-mixed-numbers.
 * Prefills joist/scenery-phet chrome from curve-fitting review when available.
 * Leaves sim / fractions-common / vegas visible UI empty for translation.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const simRoot = path.resolve( __dirname, '..' );
const workspace = path.resolve( simRoot, '..' );
const cfReviewPath = path.resolve(
  workspace, '..', 'curve-fitting', 'curve-fitting', 'khmer-translation-review.json'
);

function entry( english, category, notes, khmer = '' ) {
  const e = { english, khmer, category };
  if ( notes ) {
    e.notes = notes;
  }
  return e;
}

function emptyCount( ...objs ) {
  return objs.reduce( ( n, o ) => n + Object.values( o ).filter( e => !e.khmer ).length, 0 );
}

const sim_visible_ui = {
  'fractions-mixed-numbers.title': entry(
    'Fractions: Mixed Numbers',
    'title',
    'Sim title on home screen / browser tab / navbar.'
  ),
  'screen.intro': entry(
    'Intro',
    'screen_name',
    'Home screen card + navbar for Intro screen.'
  ),
  'screen.game': entry(
    'Game',
    'screen_name',
    'Home screen card + navbar for Game (practice/levels) screen.'
  ),
  'screen.lab': entry(
    'Lab',
    'screen_name',
    'Home screen card + navbar for Lab screen.'
  )
};

// Only strings shown in THIS sim (Intro + Building Game). Matching-game-only omitted.
const fractions_common_visible_ui = {
  representationMax: entry(
    'Max',
    'control_label',
    'Intro screen: Max control label (max number of wholes/containers). Source: fractions-common.'
  ),
  mixedNumber: entry(
    'Mixed Number',
    'checkbox_control',
    'Intro screen: checkbox to show mixed-number form. Source: fractions-common.'
  ),
  equation: entry(
    'Equation',
    'accordion_box',
    'Intro screen: Equation accordion box title (bottom-left when Mixed Number is on). Source: fractions-common.'
  ),
  levelTitlePattern: entry(
    'Level {{number}}',
    'game_status',
    'Game screen: level title during a challenge. Keep {{number}} placeholder. Source: fractions-common.'
  )
};

const game_vegas_visible_ui = {
  chooseYourLevel: entry(
    'Choose Your Level!',
    'game_level_select',
    'Game screen: title on level-selection page. Source: vegas.'
  ),
  next: entry(
    'Next',
    'game_button',
    'Game screen: Next button after completing a level (goes to next level). Source: vegas.'
  ),
  youCompletedAllLevels: entry(
    'You completed all levels!',
    'game_reward_dialog',
    'Game screen: message when all 10 levels are complete. Source: vegas.'
  ),
  done: entry(
    'Done',
    'game_button',
    'Game screen: Done button on all-levels-completed dialog (also used in joist chrome). Source: vegas.'
  )
};

const cf = JSON.parse( fs.readFileSync( cfReviewPath, 'utf8' ) );
const shared_joist_chrome = structuredClone( cf.shared_joist_chrome );
const shared_scenery_phet_chrome = structuredClone( cf.shared_scenery_phet_chrome );

const review = {
  meta: {
    project: 'fractions-mixed-numbers',
    fork: 'https://github.com/krumath-org/fractions-mixed-numbers',
    source_en_files: [
      'fractions-mixed-numbers/fractions-mixed-numbers-strings_en.json',
      'fractions-common/fractions-common-strings_en.json',
      'vegas/vegas-strings_en.json',
      'joist/joist-strings_en.json',
      'scenery-phet/scenery-phet-strings_en.json'
    ],
    locale_target: 'km',
    generated: '2026-10-05',
    how_to_fill: [
      'Fill empty "khmer" fields. Do not rename keys or change "english".',
      'Keep placeholders {{likeThis}} and {0} unchanged inside Khmer text.',
      'PRIORITY 1 — sim_visible_ui: title + Intro / Game / Lab screen names (4 strings) — EMPTY, please translate.',
      'PRIORITY 1b — fractions_common_visible_ui: Intro Max / Mixed Number / Equation + Game Level {{number}} (4 strings) — EMPTY, please translate.',
      'PRIORITY 1c — game_vegas_visible_ui: Choose Your Level!, Next, You completed all levels!, Done (4 strings) — EMPTY, please translate.',
      'PRIORITY 2 — shared_joist_chrome / shared_scenery_phet_chrome: PhET menu, About/Credits, Preferences/Settings tabs, Reset All, Keyboard Shortcuts (prefilled from curve-fitting — review/adjust).',
      'Screens: Intro (explore mixed numbers), Game (10 levels / practice), Lab (free build). Home/nav chrome uses joist strings.',
      'Omitted (not shown in this sim): Matching-game strings (My Matches, OK, Time: {0} sec, Fractions/Mixed Numbers Choose Your Level), vegas Check/Try Again/Show Answer/Reward Keep Going, backend/dev-only titles, credit person names, screen-reader-only a11y strings.',
      'Icon-only controls (Back, Refresh/Reset level) have no on-screen English labels.',
      'Math symbols like = and numeric tick labels (0, 1, …) are not listed.',
      'Send this file back when ready; we will apply into babel as fractions-mixed-numbers-strings_km.json (+ fractions-common / vegas / joist / scenery-phet as needed).'
    ],
    counts: {
      sim_visible_ui: Object.keys( sim_visible_ui ).length,
      fractions_common_visible_ui: Object.keys( fractions_common_visible_ui ).length,
      game_vegas_visible_ui: Object.keys( game_vegas_visible_ui ).length,
      shared_joist_chrome: Object.keys( shared_joist_chrome ).length,
      shared_scenery_phet_chrome: Object.keys( shared_scenery_phet_chrome ).length,
      total:
        Object.keys( sim_visible_ui ).length +
        Object.keys( fractions_common_visible_ui ).length +
        Object.keys( game_vegas_visible_ui ).length +
        Object.keys( shared_joist_chrome ).length +
        Object.keys( shared_scenery_phet_chrome ).length,
      empty_khmer_needing_translation: emptyCount(
        sim_visible_ui,
        fractions_common_visible_ui,
        game_vegas_visible_ui,
        shared_joist_chrome,
        shared_scenery_phet_chrome
      ),
      empty_priority1_sim_and_game: emptyCount(
        sim_visible_ui,
        fractions_common_visible_ui,
        game_vegas_visible_ui
      )
    }
  },
  sim_visible_ui,
  fractions_common_visible_ui,
  game_vegas_visible_ui,
  shared_joist_chrome,
  shared_scenery_phet_chrome
};

const outPath = path.join( simRoot, 'khmer-translation-review.json' );
fs.writeFileSync( outPath, `${JSON.stringify( review, null, 2 )}\n`, 'utf8' );
console.log( `Wrote ${outPath}` );
console.log( JSON.stringify( review.meta.counts, null, 2 ) );
console.log( 'EMPTY priority-1 strings:' );
for ( const [ section, obj ] of Object.entries( {
  sim_visible_ui,
  fractions_common_visible_ui,
  game_vegas_visible_ui
} ) ) {
  for ( const [ k, v ] of Object.entries( obj ) ) {
    if ( !v.khmer ) {
      console.log( `  [${section}] ${k}: ${JSON.stringify( v.english )}` );
    }
  }
}
