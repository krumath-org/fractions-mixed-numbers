/**
 * Apply khmer-translation-review.json → babel *-strings_km.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const simRoot = path.resolve( __dirname, '..' );
const workspaceRoot = path.resolve( simRoot, '..' );
const reviewPath = path.join( simRoot, 'khmer-translation-review.json' );

const review = JSON.parse( fs.readFileSync( reviewPath, 'utf8' ) );

const toBabelFlat = entries => {
  const out = {};
  for ( const [ key, entry ] of Object.entries( entries ) ) {
    if ( !entry || typeof entry.khmer !== 'string' || entry.khmer === '' ) {
      throw new Error( `Missing khmer for key: ${key}` );
    }
    out[ key ] = { value: entry.khmer };
  }
  return out;
};

const writeBabel = ( repo, fileName, obj ) => {
  const dir = path.join( workspaceRoot, 'babel', repo );
  fs.mkdirSync( dir, { recursive: true } );
  const filePath = path.join( dir, fileName );
  fs.writeFileSync( filePath, `${JSON.stringify( obj, null, 2 )}\n`, 'utf8' );
  console.log( 'Wrote', filePath );
};

writeBabel(
  'fractions-mixed-numbers',
  'fractions-mixed-numbers-strings_km.json',
  toBabelFlat( review.sim_visible_ui )
);

writeBabel(
  'fractions-common',
  'fractions-common-strings_km.json',
  toBabelFlat( review.fractions_common_visible_ui )
);

writeBabel( 'vegas', 'vegas-strings_km.json', toBabelFlat( review.game_vegas_visible_ui ) );

writeBabel( 'joist', 'joist-strings_km.json', toBabelFlat( review.shared_joist_chrome ) );

const sceneryPath = path.join( workspaceRoot, 'babel', 'scenery-phet', 'scenery-phet-strings_km.json' );
let sceneryKm = {};
if ( fs.existsSync( sceneryPath ) ) {
  sceneryKm = JSON.parse( fs.readFileSync( sceneryPath, 'utf8' ) );
}
Object.assign( sceneryKm, toBabelFlat( review.shared_scenery_phet_chrome ) );
writeBabel( 'scenery-phet', 'scenery-phet-strings_km.json', sceneryKm );

let empty = 0;
for ( const section of [
  review.sim_visible_ui,
  review.fractions_common_visible_ui,
  review.game_vegas_visible_ui,
  review.shared_joist_chrome,
  review.shared_scenery_phet_chrome
] ) {
  for ( const e of Object.values( section ) ) {
    if ( !e.khmer ) {
      empty++;
    }
  }
}
review.meta.counts.empty_khmer_needing_translation = empty;
review.meta.applied = '2026-10-05';
if ( !review.meta.how_to_fill.some( s => s.startsWith( 'Applied into babel' ) ) ) {
  review.meta.how_to_fill.push(
    'Applied into babel: fractions-mixed-numbers-strings_km.json, fractions-common-strings_km.json, vegas-strings_km.json, joist-strings_km.json, scenery-phet-strings_km.json (chrome keys merged).'
  );
}
fs.writeFileSync( reviewPath, `${JSON.stringify( review, null, 2 )}\n`, 'utf8' );

// Unbuilt/dev-server reads conglomerate _all.json, not per-locale babel files alone.
const { spawnSync } = await import( 'child_process' );
const patch = spawnSync( process.execPath, [ path.join( __dirname, 'patch-generated-strings-km.mjs' ) ], {
  stdio: 'inherit'
} );
if ( patch.status !== 0 ) {
  throw new Error( 'patch-generated-strings-km.mjs failed' );
}

console.log( 'Done applying Khmer strings.' );
console.log( {
  title: review.sim_visible_ui[ 'fractions-mixed-numbers.title' ].khmer,
  empty
} );
